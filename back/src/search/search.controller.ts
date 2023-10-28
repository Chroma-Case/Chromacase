import {
	Controller,
	DefaultValuePipe,
	Get,
	InternalServerErrorException,
	NotFoundException,
	Param,
	ParseIntPipe,
	Query,
	Request,
	UseGuards,
} from "@nestjs/common";
import {
	ApiOkResponse,
	ApiOperation,
	ApiTags,
	ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { Artist, Genre, Song } from "@prisma/client";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { SearchService } from "./search.service";
import { Song as _Song } from "src/_gen/prisma-class/song";
import { Genre as _Genre } from "src/_gen/prisma-class/genre";
import { Artist as _Artist } from "src/_gen/prisma-class/artist";
import { mapInclude } from "src/utils/include";
import { SongController } from "src/song/song.controller";
import { GenreController } from "src/genre/genre.controller";
import { ArtistController } from "src/artist/artist.controller";

@ApiTags("search")
@Controller("search")
@UseGuards(JwtAuthGuard)
export class SearchController {
	constructor(private readonly searchService: SearchService) {}

	@Get("songs/:query")
	@ApiOkResponse({ type: _Song, isArray: true })
	@ApiOperation({ description: "Search a song" })
	@ApiUnauthorizedResponse({ description: "Invalid token" })
	async searchSong(
		@Request() req: any,
		@Param('query') query: string,
		@Query('artistId') artistId: number,
		@Query('genreId') genreId: number,
		@Query('include') include: string,
		@Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
		@Query('take', new DefaultValuePipe(20), ParseIntPipe) take: number,
	): Promise<Song[] | null> {
		return await this.searchService.searchSong(
			query,
			artistId,
			genreId,
			mapInclude(include, req, SongController.includableFields),
			skip,
			take,
		);
	}

	@Get("artists/:query")
	@UseGuards(JwtAuthGuard)
	@ApiOkResponse({ type: _Artist, isArray: true })
	@ApiUnauthorizedResponse({ description: "Invalid token" })
	@ApiOperation({ description: "Search an artist" })
	async searchArtists(
		@Request() req: any,
		@Query("include") include: string,
		@Param("query") query: string,
		@Query("skip", new DefaultValuePipe(0), ParseIntPipe) skip: number,
		@Query("take", new DefaultValuePipe(20), ParseIntPipe) take: number,
	): Promise<Artist[] | null> {
		return await this.searchService.searchArtists(
			query,
			mapInclude(include, req, ArtistController.includableFields),
			skip,
			take,
		);
	}
}
