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
import { CreateSongDto } from './dto/create-song.dto';
import { SongService } from './song.service';
import { Request } from 'express';
import { Prisma, Song } from '@prisma/client';
import { createReadStream } from 'fs';
import { ApiTags } from '@nestjs/swagger';

@Controller('song')
@ApiTags('song')
export class SongController {
	constructor(private readonly songService: SongService) {}

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

	@Get(':id/musicXml')
	async getMusicXml(@Param('id', ParseIntPipe) id: number) {
		const song = await this.songService.song({ id });
		if (!song) throw new NotFoundException('Song not found');

		const file = createReadStream(song.midiPath);
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
		return await this.songService.deleteSong({ id });
	}

	@Get()
	async findAll(
		@Req() req: Request,
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
		const res = await this.songService.song({ id });

		if (res === null) throw new NotFoundException('Song not found');
		return res;
	}
}
