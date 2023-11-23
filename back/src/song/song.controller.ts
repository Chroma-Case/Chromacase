import {
	Body,
	ConflictException,
	Controller,
	DefaultValuePipe,
	Delete,
	Get,
	HttpCode,
	InternalServerErrorException,
	NotFoundException,
	Param,
	ParseIntPipe,
	Post,
	Query,
	Req,
	StreamableFile,
	UseGuards,
	Header,
} from "@nestjs/common";
import { ApiOkResponsePlaginated, Plage } from "src/models/plage";
import { CreateSongDto } from "./dto/create-song.dto";
import { SongService } from "./song.service";
import { Request } from "express";
import { Prisma, Song } from "@prisma/client";
import { createReadStream, existsSync, readFileSync } from "fs";
import {
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiProperty,
	ApiTags,
	ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { HistoryService } from "src/history/history.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { FilterQuery } from "src/utils/filter.pipe";
import { Song as _Song } from "src/_gen/prisma-class/song";
import { SongHistory } from "src/_gen/prisma-class/song_history";
import { IncludeMap, mapInclude } from "src/utils/include";
import { Public } from "src/auth/public";
import { AuthGuard } from "@nestjs/passport";
class SongHistoryResult {
	@ApiProperty()
	best: number;
	@ApiProperty({ type: SongHistory, isArray: true })
	history: SongHistory[];
}

@Controller("song")
@ApiTags("song")
@UseGuards(AuthGuard(["jwt", "api-key"]))
export class SongController {
	static filterableFields: string[] = [
		"+id",
		"name",
		"+artistId",
		"+albumId",
		"+genreId",
	];
	static includableFields: IncludeMap<Prisma.SongInclude> = {
		artist: true,
		album: true,
		genre: true,
		SongHistory: ({ user }) => ({ where: { userID: user.id } }),
		likedByUsers: ({ user }) => ({ where: { userId: user.id } }),
	};

	constructor(
		private readonly songService: SongService,
		private readonly historyService: HistoryService,
	) {}

	@Get(":id/midi")
	@ApiOperation({ description: "Streams the midi file of the requested song" })
	@ApiNotFoundResponse({ description: "Song not found" })
	@ApiOkResponse({ description: "Returns the midi file succesfully" })
	async getMidi(@Param("id", ParseIntPipe) id: number) {
		const song = await this.songService.song({ id });
		if (!song) throw new NotFoundException("Song not found");

		try {
			const file = createReadStream(song.midiPath);
			return new StreamableFile(file, { type: "audio/midi" });
		} catch {
			throw new InternalServerErrorException();
		}
	}

	@Get(":id/illustration")
	@ApiOperation({
		description: "Streams the illustration of the requested song",
	})
	@ApiNotFoundResponse({ description: "Song not found" })
	@ApiOkResponse({ description: "Returns the illustration succesfully" })
	@Header("Cache-Control", "max-age=86400")
	@Public()
	async getIllustration(@Param("id", ParseIntPipe) id: number) {
		const song = await this.songService.song({ id });
		if (!song) throw new NotFoundException("Song not found");

		if (song.illustrationPath === null) throw new NotFoundException();
		if (!existsSync(song.illustrationPath))
			throw new NotFoundException("Illustration not found");

		try {
			const file = createReadStream(song.illustrationPath);
			return new StreamableFile(file);
		} catch {
			throw new InternalServerErrorException();
		}
	}

	@Get(":id/musicXml")
	@ApiOperation({
		description: "Streams the musicXML file of the requested song",
	})
	@ApiNotFoundResponse({ description: "Song not found" })
	@ApiOkResponse({ description: "Returns the musicXML file succesfully" })
	async getMusicXml(@Param("id", ParseIntPipe) id: number) {
		const song = await this.songService.song({ id });
		if (!song) throw new NotFoundException("Song not found");

		const file = createReadStream(song.musicXmlPath, { encoding: "binary" });
		return new StreamableFile(file);
	}

	@Get(":id/assets/partition")
	@ApiOperation({
		description: "Streams the svg partition of the requested song",
	})
	@ApiNotFoundResponse({ description: "Song not found" })
	@ApiOkResponse({ description: "Returns the svg partition succesfully" })
	@Header("Cache-Control", "max-age=86400")
	@Header("Content-Type", "image/svg+xml")
	@Public()
	async getPartition(@Param("id", ParseIntPipe) id: number) {
		const song = await this.songService.song({ id });
		if (!song) throw new NotFoundException("Song not found");

		// check if /data/cache/songs/id exists
		if (!existsSync("/data/cache/songs/" + id + ".svg")) {
			// if not, generate assets
			await this.songService.createAssets(song.musicXmlPath, id);
		}

		try {
			const file = readFileSync("/data/cache/songs/" + id + ".svg");
			return file.toString();
		} catch {
			throw new InternalServerErrorException();
		}
	}

	@Get(":id/assets/cursors")
	@ApiOperation({
		description: "Streams the partition cursors of the requested song",
	})
	@ApiNotFoundResponse({ description: "Song not found" })
	@ApiOkResponse({ description: "Returns the partition cursors succesfully" })
	@Header("Cache-Control", "max-age=86400")
	@Header("Content-Type", "application/json")
	async getCursors(@Param("id", ParseIntPipe) id: number) {
		const song = await this.songService.song({ id });
		if (!song) throw new NotFoundException("Song not found");

		// check if /data/cache/songs/id exists
		if (!existsSync("/data/cache/songs/" + id + ".json")) {
			// if not, generate assets
			await this.songService.createAssets(song.musicXmlPath, id);
		}

		try {
			const file = readFileSync("/data/cache/songs/" + id + ".json");
			return JSON.parse(file.toString());
		} catch {
			throw new InternalServerErrorException();
		}
	}

	@Post()
	@ApiOperation({
		description:
			"register a new song in the database, should not be used by the frontend",
	})
	async create(@Body() createSongDto: CreateSongDto) {
		try {
			return await this.songService.createSong({
				...createSongDto,
				artist: createSongDto.artist
					? { connect: { id: createSongDto.artist } }
					: undefined,
				album: createSongDto.album
					? { connect: { id: createSongDto.album } }
					: undefined,
				genre: createSongDto.genre
					? { connect: { id: createSongDto.genre } }
					: undefined,
			});
		} catch {
			throw new ConflictException(
				await this.songService.song({ name: createSongDto.name }),
			);
		}
	}

	@Delete(":id")
	@ApiOperation({ description: "delete a song by id" })
	async remove(@Param("id", ParseIntPipe) id: number) {
		try {
			return await this.songService.deleteSong({ id });
		} catch {
			throw new NotFoundException("Invalid ID");
		}
	}

	@Get()
	@ApiOkResponsePlaginated(_Song)
	async findAll(
		@Req() req: Request,
		@FilterQuery(SongController.filterableFields) where: Prisma.SongWhereInput,
		@Query("include") include: string,
		@Query("skip", new DefaultValuePipe(0), ParseIntPipe) skip: number,
		@Query("take", new DefaultValuePipe(20), ParseIntPipe) take: number,
	): Promise<Plage<Song>> {
		const ret = await this.songService.songs({
			skip,
			take,
			where,
			include: mapInclude(include, req, SongController.includableFields),
		});
		return new Plage(ret, req);
	}

	@Get(":id")
	@ApiOperation({ description: "Get a specific song data" })
	@ApiNotFoundResponse({ description: "Song not found" })
	@ApiOkResponse({ type: _Song, description: "Requested song" })
	async findOne(
		@Req() req: Request,
		@Param("id", ParseIntPipe) id: number,
		@Query("include") include: string,
	) {
		const res = await this.songService.song(
			{
				id,
			},
			mapInclude(include, req, SongController.includableFields),
		);

		if (res === null) throw new NotFoundException("Song not found");
		return res;
	}

	@Get(":id/history")
	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	@ApiOperation({
		description: "get the history of the connected user on a specific song",
	})
	@ApiOkResponse({
		type: SongHistoryResult,
		description: "Records of previous games of the user",
	})
	@ApiUnauthorizedResponse({ description: "Invalid token" })
	async getHistory(@Req() req: any, @Param("id", ParseIntPipe) id: number) {
		return this.historyService.getForSong({
			playerId: req.user.id,
			songId: id,
		});
	}
}
