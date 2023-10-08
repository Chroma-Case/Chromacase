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
import {
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Artist, Genre, Song } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { SearchSongDto } from './dto/search-song.dto';
import { SearchService } from './search.service';
import { Song as _Song } from 'src/_gen/prisma-class/song';
import { Genre as _Genre } from 'src/_gen/prisma-class/genre';
import { Artist as _Artist } from 'src/_gen/prisma-class/artist';

@ApiTags('search')
@Controller('search')
export class SearchController {
	constructor(private readonly searchService: SearchService) {}

	@Get('songs/:query')
	@ApiOkResponse({ type: _Song, isArray: true })
	@ApiOperation({ description: 'Search a song' })
	@ApiUnauthorizedResponse({ description: 'Invalid token' })
	@UseGuards(JwtAuthGuard)
	async searchSong(
		@Request() req: any,
		@Param('query') query: string,
	): Promise<Song[] | null> {
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
	@ApiUnauthorizedResponse({ description: 'Invalid token' })
	@ApiOkResponse({ type: _Genre, isArray: true })
	@ApiOperation({ description: 'Search a genre' })
	async searchGenre(
		@Request() req: any,
		@Param('query') query: string,
	): Promise<Genre[] | null> {
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
	@ApiOkResponse({ type: _Artist, isArray: true })
	@ApiUnauthorizedResponse({ description: 'Invalid token' })
	@ApiOperation({ description: 'Search an artist' })
	async searchArtists(
		@Request() req: any,
		@Param('query') query: string,
	): Promise<Artist[] | null> {
		try {
			const ret = await this.searchService.artistByGuess(query, req.user?.id);
			if (!ret.length) throw new NotFoundException();
			else return ret;
		} catch (error) {
			throw new InternalServerErrorException();
		}
	}
}
