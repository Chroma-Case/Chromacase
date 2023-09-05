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
} from '@nestjs/common';
import { Plage } from 'src/models/plage';
import { CreateSongDto } from './dto/create-song.dto';
import { SongService } from './song.service';
import { Request } from 'express';
import { Prisma, Song } from '@prisma/client';
import { createReadStream, existsSync } from 'fs';
import { ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { HistoryService } from 'src/history/history.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FilterQuery } from 'src/utils/filter.pipe';

@Controller('song')
@ApiTags('song')
export class SongController {
	static filterableFields: string[] = [
		'+id',
		'name',
		'+artistId',
		'+albumId',
		'+genreId',
	];

	constructor(
		private readonly songService: SongService,
		private readonly historyService: HistoryService,
	) {}

	@Get(':id/midi')
	async getMidi(@Param('id', ParseIntPipe) id: number) {
		const song = await this.songService.song({ id });
		if (!song) throw new NotFoundException('Song not found');

		try {
			const file = createReadStream(song.midiPath);
			return new StreamableFile(file, { type: 'audio/midi' });
		} catch {
			throw new InternalServerErrorException();
		}
	}

	@Get(':id/illustration')
	async getIllustration(@Param('id', ParseIntPipe) id: number) {
		const song = await this.songService.song({ id });
		if (!song) throw new NotFoundException('Song not found');

		if (song.illustrationPath === null) throw new NotFoundException();
		if (!existsSync(song.illustrationPath))
			throw new NotFoundException('Illustration not found');

		try {
			const file = createReadStream(song.illustrationPath);
			return new StreamableFile(file);
		} catch {
			throw new InternalServerErrorException();
		}
	}

	@Get(':id/musicXml')
	async getMusicXml(@Param('id', ParseIntPipe) id: number) {
		const song = await this.songService.song({ id });
		if (!song) throw new NotFoundException('Song not found');

		const file = createReadStream(song.musicXmlPath, { encoding: 'binary' });
		return new StreamableFile(file);
	}

	@Post()
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

	@Delete(':id')
	async remove(@Param('id', ParseIntPipe) id: number) {
		try {
			return await this.songService.deleteSong({ id });
		} catch {
			throw new NotFoundException('Invalid ID');
		}
	}

	@Get()
	async findAll(
		@Req() req: Request,
		@FilterQuery(SongController.filterableFields) where: Prisma.SongWhereInput,
		@Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
		@Query('take', new DefaultValuePipe(20), ParseIntPipe) take: number,
	): Promise<Plage<Song>> {
		const ret = await this.songService.songs({
			skip,
			take,
			where,
		});
		return new Plage(ret, req);
	}

	@Get(':id')
	async findOne(@Param('id', ParseIntPipe) id: number) {
		const res = await this.songService.song({ id });

		if (res === null) throw new NotFoundException('Song not found');
		return res;
	}

	@Get(':id/history')
	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	@ApiUnauthorizedResponse({ description: 'Invalid token' })
	async getHistory(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
		return this.historyService.getForSong({
			playerId: req.user.id,
			songId: id,
		});
	}
}
