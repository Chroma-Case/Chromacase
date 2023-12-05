import {
	Body,
	ConflictException,
	Controller,
	DefaultValuePipe,
	Delete,
	Get,
	NotFoundException,
	Param,
	ParseIntPipe,
	Post,
	Query,
	Req,
	UseGuards,
} from "@nestjs/common";
import { ApiOkResponsePlaginated, Plage } from "src/models/plage";
import { CreateAlbumDto } from "./dto/create-album.dto";
import { AlbumService } from "./album.service";
import { Request } from "express";
import { Prisma, Album } from "@prisma/client";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { FilterQuery } from "src/utils/filter.pipe";
import { Album as _Album } from "src/_gen/prisma-class/album";
import { IncludeMap, mapInclude } from "src/utils/include";
import { AuthGuard } from "@nestjs/passport";
import { ChromaAuthGuard } from "src/auth/chroma-auth.guard";

@Controller("album")
@ApiTags("album")
@UseGuards(ChromaAuthGuard)
export class AlbumController {
	static filterableFields: string[] = ["+id", "name", "+artistId"];
	static includableFields: IncludeMap<Prisma.AlbumInclude> = {
		artist: true,
		Song: true,
	};

	constructor(private readonly albumService: AlbumService) {}

	@Post()
	@ApiOperation({
		description: "Register a new album, should not be used by frontend",
	})
	async create(@Body() createAlbumDto: CreateAlbumDto) {
		try {
			return await this.albumService.createAlbum({
				...createAlbumDto,
				artist: createAlbumDto.artist
					? { connect: { id: createAlbumDto.artist } }
					: undefined,
			});
		} catch {
			throw new ConflictException(
				await this.albumService.album({ name: createAlbumDto.name }),
			);
		}
	}

	@Delete(":id")
	@ApiOperation({ description: "Delete an album by id" })
	async remove(@Param("id", ParseIntPipe) id: number) {
		try {
			return await this.albumService.deleteAlbum({ id });
		} catch {
			throw new NotFoundException("Invalid ID");
		}
	}

	@Get()
	@ApiOkResponsePlaginated(_Album)
	@ApiOperation({ description: "Get all albums paginated" })
	async findAll(
		@Req() req: Request,
		@FilterQuery(AlbumController.filterableFields)
		where: Prisma.AlbumWhereInput,
		@Query("include") include: string,
		@Query("skip", new DefaultValuePipe(0), ParseIntPipe) skip: number,
		@Query("take", new DefaultValuePipe(20), ParseIntPipe) take: number,
	): Promise<Plage<Album>> {
		const ret = await this.albumService.albums({
			skip,
			take,
			where,
			include: mapInclude(include, req, AlbumController.includableFields),
		});
		return new Plage(ret, req);
	}

	@Get(":id")
	@ApiOperation({ description: "Get an album by id" })
	@ApiOkResponse({ type: _Album })
	async findOne(
		@Req() req: Request,
		@Query("include") include: string,
		@Param("id", ParseIntPipe) id: number,
	) {
		const res = await this.albumService.album(
			{ id },
			mapInclude(include, req, AlbumController.includableFields),
		);

		if (res === null) throw new NotFoundException("Album not found");
		return res;
	}
}
