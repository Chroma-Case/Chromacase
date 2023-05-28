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
import { CreateArtistDto } from './dto/create-artist.dto';
import { Request } from 'express';
import { ArtistService } from './artist.service';
import { Prisma, Artist } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { createReadStream, existsSync } from 'fs';
import { FilterQuery } from 'src/utils/filter.pipe';

@Controller('artist')
@ApiTags('artist')
export class ArtistController {
	static filterableFields = ['+id', 'name'];

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
		try {
			return await this.service.delete({ id });
		} catch {
			throw new NotFoundException('Invalid ID');
		}
	}

	@Get(':id/illustration')
	async getIllustration(@Param('id', ParseIntPipe) id: number) {
		const artist = await this.service.get({ id });
		if (!artist) throw new NotFoundException('Artist not found');
		const path = `/assets/artists/${artist.name}/illustration.png`;
		if (!existsSync(path))
			throw new NotFoundException('Illustration not found');

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
		@FilterQuery(ArtistController.filterableFields)
		where: Prisma.ArtistWhereInput,
		@Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
		@Query('take', new DefaultValuePipe(20), ParseIntPipe) take: number,
	): Promise<Plage<Artist>> {
		const ret = await this.service.list({
			skip,
			take,
			where,
		});
		return new Plage(ret, req);
	}

	@Get(':id')
	async findOne(@Param('id', ParseIntPipe) id: number) {
		const res = await this.service.get({ id });

		if (res === null) throw new NotFoundException('Artist not found');
		return res;
	}
}
