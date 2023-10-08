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
	Query,
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
import { mapInclude } from 'src/utils/include';
import { SongController } from 'src/song/song.controller';
import { GenreController } from 'src/genre/genre.controller';
import { ArtistController } from 'src/artist/artist.controller';

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
		@Query('include') include: string,
		@Param('query') query: string,
	): Promise<Song[] | null> {
		try {
			const ret = await this.searchService.songByGuess(
				query,
				req.user?.id,
				mapInclude(include, req, SongController.includableFields),
			);
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
		@Query('include') include: string,
		@Param('query') query: string,
	): Promise<Genre[] | null> {
		try {
			const ret = await this.searchService.genreByGuess(
				query,
				req.user?.id,
				mapInclude(include, req, GenreController.includableFields),
			);
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
		@Query('include') include: string,
		@Param('query') query: string,
	): Promise<Artist[] | null> {
		try {
			const ret = await this.searchService.artistByGuess(
				query,
				req.user?.id,
				mapInclude(include, req, ArtistController.includableFields),
			);
			if (!ret.length) throw new NotFoundException();
			else return ret;
		} catch (error) {
			throw new InternalServerErrorException();
		}
	}
}
