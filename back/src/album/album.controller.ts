import {
	BadRequestException,
	Body,
	ConflictException,
	Controller,
	DefaultValuePipe,
	Delete,
	Get,
	InternalServerErrorException,
	NotFoundException,
	Param,
	ParseIntPipe,
	Post,
	Query,
	Req,
	StreamableFile,
} from '@nestjs/common';
import { Plage } from 'src/models/plage';
import { CreateAlbumDto } from './dto/create-album.dto';
import { AlbumService } from './album.service';
import { Request } from 'express';
import { Prisma, Album } from '@prisma/client';
import { createReadStream } from 'fs';
import { ApiTags } from '@nestjs/swagger';

@Controller('album')
@ApiTags('album')
export class AlbumController {
	constructor(private readonly albumService: AlbumService) {}

	@Post()
	async create(@Body() createAlbumDto: CreateAlbumDto) {
		try {
			return await this.albumService.createAlbum({
				...createAlbumDto,
				artist: createAlbumDto.artist
					? { connect: { id: createAlbumDto.artist } }
					: undefined
			});
		} catch {
			throw new ConflictException(
				await this.albumService.album({ name: createAlbumDto.name }),
			);
		}
	}

	@Delete(':id')
	async remove(@Param('id', ParseIntPipe) id: number) {
		return await this.albumService.deleteAlbum({ id });
	}

	@Get()
	async findAll(
		@Req() req: Request,
		@Query() filter: Prisma.AlbumWhereInput,
		@Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
		@Query('take', new DefaultValuePipe(20), ParseIntPipe) take: number,
	): Promise<Plage<Album>> {
		try {
			const ret = await this.albumService.albums({
				skip,
				take,
				where: {
					...filter,
					id: filter.id ? +filter.id : undefined,
				},
			});
			return new Plage(ret, req);
		} catch (e) {
			console.log(e);
			throw new BadRequestException(null, e?.toString());
		}
	}

	@Get(':id')
	async findOne(@Param('id', ParseIntPipe) id: number) {
		const res = await this.albumService.album({ id });

		if (res === null) throw new NotFoundException('Album not found');
		return res;
	}
}