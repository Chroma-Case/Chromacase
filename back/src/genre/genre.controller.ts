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
import { CreateGenreDto } from './dto/create-genre.dto';
import { Request } from 'express';
import { GenreService } from './genre.service';
import { Prisma, Genre } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

@Controller('genre')
@ApiTags('genre')
export class GenreController {
	constructor(private readonly service: GenreService) {}

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
