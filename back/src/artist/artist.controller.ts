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
import { CreateArtistDto } from './dto/create-artist.dto';
import { Request } from 'express';
import { ArtistService } from './artist.service';
import { Prisma, Artist } from '@prisma/client';

@Controller('artist')
export class ArtistController {
	constructor(private readonly service: ArtistService) {}

	@Post()
	async create(@Body() dto: CreateArtistDto) {
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
	): Promise<Plage<Artist>> {
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

		if (res === null) throw new NotFoundException('Artist not found');
		return res;
	}
}
