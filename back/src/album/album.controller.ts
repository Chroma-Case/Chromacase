import {
	BadRequestException,
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
} from '@nestjs/common';
import { Plage } from 'src/models/plage';
import { CreateAlbumDto } from './dto/create-album.dto';
import { AlbumService } from './album.service';
import { Request } from 'express';
import { Prisma, Album } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { FilterQuery } from 'src/utils/filter.pipe';

@Controller('album')
@ApiTags('album')
export class AlbumController {
	static filterableFields: string[] = ['+id', 'name', '+artistId'];

	constructor(private readonly albumService: AlbumService) {}

	@Post()
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

	@Delete(':id')
	async remove(@Param('id', ParseIntPipe) id: number) {
		try {
			return await this.albumService.deleteAlbum({ id });
		} catch {
			throw new NotFoundException('Invalid ID');
		}
	}

	@Get()
	async findAll(
		@Req() req: Request,
		@FilterQuery(AlbumController.filterableFields)
		where: Prisma.AlbumWhereInput,
		@Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
		@Query('take', new DefaultValuePipe(20), ParseIntPipe) take: number,
	): Promise<Plage<Album>> {
		const ret = await this.albumService.albums({
			skip,
			take,
			where,
		});
		return new Plage(ret, req);
	}

	@Get(':id')
	async findOne(@Param('id', ParseIntPipe) id: number) {
		const res = await this.albumService.album({ id });

		if (res === null) throw new NotFoundException('Album not found');
		return res;
	}
}
