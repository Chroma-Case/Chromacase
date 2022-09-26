import { BadRequestException, Body, Controller, DefaultValuePipe, Delete, Get, NotFoundException, Param, ParseIntPipe, Post, Query, Req } from '@nestjs/common';
import { Plage } from 'src/models/plage';
import { CreateSongDto } from './dto/create-song.dto';
import { SongService } from './song.service';
import { Request } from "express"
import { Prisma, Song } from '@prisma/client';

@Controller('song')
export class SongController {
	constructor (private readonly songService: SongService) {}

	@Post()
	async create(@Body() createSongDto: CreateSongDto) {
	  return await this.songService.createSong(createSongDto);
	}

	@Delete(':id')
	async remove(@Param('id', ParseIntPipe) id: number) {
		return await this.songService.deleteSong({id});
  	}

	@Get()
	async findAll(@Req() req: Request,
		@Query() filter: Prisma.SongWhereInput,
		@Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
		@Query('take', new DefaultValuePipe(20), ParseIntPipe) take: number,
	): Promise<Plage<Song>> {
		try {
			const ret = await this.songService.songs({
				skip,
				take,
				where: {
					...filter,
					id: filter.id
						? +filter.id
						: undefined,
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
		let res = await this.songService.song({id});
		
		if (res === null)
			throw new NotFoundException("Song not found")
		return res
	  }
}
