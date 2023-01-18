import { BadRequestException, Body, Controller, DefaultValuePipe, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseIntPipe, Post, Query, Req } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { Prisma, Song } from '@prisma/client';
import { Plage } from 'src/models/plage';
import { SongService } from 'src/song/song.service';
import { SearchSongDto } from './dto/search-song.dto';
import { SearchService } from './search.service';
import { Request } from 'express';
import { type } from 'os';

@ApiTags('search')
@Controller('search')
export class SearchController {
	constructor(private readonly searchService: SearchService, private readonly songService: SongService) {}

	@Get('/title/:name')
	async findByName(@Param('name') name: string): Promise<Song | null> {
		const ret = await this.searchService.songByTitle({ name })
		if (!ret) throw new NotFoundException;
		return ret;
	}

	@Post('/advanced/song')
	@HttpCode(200) // change from '201 created' to '200 OK' http default response code
	async findAdvanced(@Body() searchSongDto: SearchSongDto): Promise<Song[] | null> {
		const ret = await this.searchService.findAdvanced({
			albumId: searchSongDto.album ? + searchSongDto.album : undefined,
			artistId: searchSongDto.artist ? + searchSongDto.artist : undefined,
			genreId: searchSongDto.genre ? + searchSongDto.genre: undefined
		});
		if (!ret) throw new NotFoundException;
		else return ret;
	}

	@Get('/artist/:artistId')
	async findByArtist(@Param('artistId', ParseIntPipe) artistId: number): Promise<Song[] | null> {
		const ret = await this.searchService.songsByArtist(artistId);
		if (!ret) throw new NotFoundException;
		else return ret;
	}

	@Get('genre/:genreId')
	async findByGenre(@Param('genreId', ParseIntPipe) genreId: number): Promise<Song[] | null> {
		const ret = await this.searchService.songsByGenre(genreId);
		if (!ret) throw new NotFoundException;
		else return ret;
	}

	@Get('album/:albumId')
	async findByAlbum(@Param('albumId', ParseIntPipe) albumId: number): Promise<Song[] | null> {
		const ret = await this.searchService.songsByAlbum(albumId);
		if (!ret) throw new NotFoundException;
		else return ret;
	}

	@Get('guess/:type/:word')
	@ApiParam({name: 'word', type: 'string', required: true, example: 'Yoko Shimomura'})
	@ApiParam({name: 'type', type: 'string', required: true, example: 'artist'})
	async guess(@Param() params: {'type': string, 'word': string}): Promise<any[] | null> {
		let ret: any[];
		switch (params.type) {
			case 'artist':
				ret = await this.searchService.guessArtist(params.word);
				break;
			case 'album':
				ret = await this.searchService.guessAlbum(params.word);
				break;
			case 'song':
				ret = await this.searchService.guessSong(params.word);
				break;
			default:
				throw new BadRequestException;
		}
		if (!ret || ret.length == 0) throw new NotFoundException;
		else return ret;
	}
}
