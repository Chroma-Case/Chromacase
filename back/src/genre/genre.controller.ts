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
import { CreateGenreDto } from './dto/create-genre.dto';
import { Request } from 'express';
import { GenreService } from './genre.service';
import { Prisma, Genre } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { createReadStream } from 'fs';

@Controller('genre')
@ApiTags('genre')
export class GenreController {
	constructor(private readonly service: GenreService) { }

	@Post()
	async create(@Body() dto: CreateGenreDto) {
		try {
			return await this.service.create(dto);
		} catch {
			throw new ConflictException(await this.service.get({ name: dto.name }));
		}
	}

	@Delete(':id')
	async remove(@Param('id', ParseIntPipe) id: number) {
		return await this.service.delete({ id });
	}

	@Get(':id/illustration')
	async getIllustration(@Param('id', ParseIntPipe) id: number) {
		const genre = await this.service.get({ id });
		if (!genre) throw new NotFoundException('Genre not found');
		const path = `/assets/genres/${genre.name}/illustration.png`;

		try {
			const file = createReadStream(path);
			return new StreamableFile(file);
		} catch {
			throw new InternalServerErrorException();
		}
	}

	@Get()
	async findAll(
		@Req() req: Request,
		@Query() filter: Prisma.SongWhereInput,
		@Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
		@Query('take', new DefaultValuePipe(20), ParseIntPipe) take: number,
	): Promise<Plage<Genre>> {
		try {
			const ret = await this.service.list({
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
		const res = await this.service.get({ id });

		if (res === null) throw new NotFoundException('Genre not found');
		return res;
	}
}
