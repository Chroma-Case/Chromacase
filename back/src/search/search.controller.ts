import {
	BadRequestException,
	Body,
	Controller,
	Get,
	HttpCode,
	InternalServerErrorException,
	NotFoundException,
	Param,
	ParseIntPipe,
	Post,
	Request,
	UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Artist, Genre, Song } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { SearchSongDto } from './dto/search-song.dto';
import { SearchService } from './search.service';

@ApiTags('search')
@Controller('search')
export class SearchController {
	constructor(private readonly searchService: SearchService) { }

	@ApiOperation({
		summary: 'Get a song details by song name',
		description: 'Get a song details by song name',
	})
	@Get('song/:name')
	@UseGuards(JwtAuthGuard)
	async findByName(@Request() req: any, @Param('name') name: string): Promise<Song | null> {
		const ret = await this.searchService.songByTitle({ name }, req.user?.id);
		if (!ret) throw new NotFoundException();
		return ret;
	}

	@ApiOperation({
		summary: 'Get songs details by advanced filter',
		description: 'Get songs details by advanced filter',
	})
	@Post('song/advanced')
	@HttpCode(200) // change from '201 created' to '200 OK' http default response code
	async findAdvanced(
		@Body() searchSongDto: SearchSongDto,
	): Promise<Song[] | null> {
		try {
			const ret = await this.searchService.findAdvanced({
				albumId: searchSongDto.album ? +searchSongDto.album : undefined,
				artistId: searchSongDto.artist ? +searchSongDto.artist : undefined,
				genreId: searchSongDto.genre ? +searchSongDto.genre : undefined,
			});
			if (!ret.length) throw new NotFoundException();
			else return ret;
		} catch (error) {
			console.log(error);
			throw new BadRequestException(null, error?.toString());
		}
	}

	@ApiOperation({
		summary: 'Get songs details by artist',
		description: 'Get songs details by artist',
	})
	@Get('song/artist/:artistId')
	async findByArtist(
		@Param('artistId', ParseIntPipe) artistId: number,
	): Promise<Song[] | null> {
		const ret = await this.searchService.songsByArtist(artistId);
		if (!ret.length) throw new NotFoundException();
		else return ret;
	}

	@ApiOperation({
		summary: 'Get songs details by genre',
		description: 'Get songs details by genre',
	})
	@Get('song/genre/:genreId')
	async findByGenre(
		@Param('genreId', ParseIntPipe) genreId: number,
	): Promise<Song[] | null> {
		const ret = await this.searchService.songsByGenre(genreId);
		if (!ret.length) throw new NotFoundException();
		else return ret;
	}

	@ApiOperation({
		summary: 'Get songs details by album',
		description: 'Get songs details by album',
	})
	@Get('song/album/:albumId')
	async findByAlbum(
		@Param('albumId', ParseIntPipe) albumId: number,
	): Promise<Song[] | null> {
		const ret = await this.searchService.songsByAlbum(albumId);
		if (ret.length) throw new NotFoundException();
		else return ret;
	}

	@ApiOperation({
		summary: 'Guess elements details by keyword',
		description: 'Guess elements details by keyword',
	})
	@Get('guess/:type/:word')
	@ApiParam({
		name: 'word',
		type: 'string',
		required: true,
		example: 'Yoko Shimomura',
	})
	@ApiParam({ name: 'type', type: 'string', required: true, example: 'artist' })
	@UseGuards(JwtAuthGuard)
	async guess(
		@Request() req: any,
		@Param() params: { type: string; word: string },
	): Promise<any[] | null> {
		try {
			let ret: any[];
			switch (params.type) {
				case 'artist':
					ret = await this.searchService.guessArtist(params.word, req.user?.id);
					break;
				case 'album':
					ret = await this.searchService.guessAlbum(params.word, req.user?.id);
					break;
				case 'song':
					ret = await this.searchService.guessSong(params.word, req.user?.id);
					break;
				default:
					throw new BadRequestException();
			}
			if (!ret.length) throw new NotFoundException();
			else return ret;
		} catch (error) {
			console.log(error);
			throw new InternalServerErrorException(null, error?.toString());
		}
	}

	@Get('songs/:query')
	@UseGuards(JwtAuthGuard)
	async searchSong(@Request() req: any, @Param('query') query: string): Promise<Song[] | null> {
		try {
			const ret = await this.searchService.songByGuess(query, req.user?.id);
			if (!ret.length) throw new NotFoundException();
			else return ret;
		} catch (error) {
			throw new InternalServerErrorException();
		}
	}

	@Get('genres/:query')
	@UseGuards(JwtAuthGuard)
	async searchGenre(@Request() req: any, @Param('query') query: string): Promise<Genre[] | null> {
		try {
			const ret = await this.searchService.genreByGuess(query, req.user?.id);
			if (!ret.length) throw new NotFoundException();
			else return ret;
		} catch (error) {
			throw new InternalServerErrorException();
		}
	}

	@Get('artists/:query')
	@UseGuards(JwtAuthGuard)
	async searchArtists(@Request() req: any, @Param('query') query: string): Promise<Artist[] | null> {
		try {
			const ret = await this.searchService.artistByGuess(query, req.user?.id);
			if (!ret.length) throw new NotFoundException();
			else return ret;
		} catch (error) {
			throw new InternalServerErrorException();
		}
	}
}