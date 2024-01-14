import {
	Controller,
	DefaultValuePipe,
	Get,
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
import { Artist, Song } from "@prisma/client";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { SearchService } from "./search.service";
import { Song as _Song } from "src/_gen/prisma-class/song";
import { Artist as _Artist } from "src/_gen/prisma-class/artist";
import { mapInclude } from "src/utils/include";
import { SongController } from "src/song/song.controller";
import { ArtistController } from "src/artist/artist.controller";

@ApiTags("search")
@Controller("search")
@UseGuards(JwtAuthGuard)
export class SearchController {
	constructor(private readonly searchService: SearchService) {}

	@Get("songs")
	@ApiOkResponse({ type: _Song, isArray: true })
	@ApiOperation({ description: "Search a song" })
	@ApiUnauthorizedResponse({ description: "Invalid token" })
	async searchSong(
		@Request() req: any,
		@Query("q") query: string | null,
		@Query("artistId") artistId: number,
		@Query("genreId") genreId: number,
		@Query("include") include: string,
		@Query("skip", new DefaultValuePipe(0), ParseIntPipe) skip: number,
		@Query("take", new DefaultValuePipe(20), ParseIntPipe) take: number,
	): Promise<Song[]> {
		return await this.searchService.searchSong(
			query ?? "",
			artistId,
			genreId,
			mapInclude(include, req, SongController.includableFields),
			skip,
			take,
		);
	}

	@Get("artists")
	@UseGuards(JwtAuthGuard)
	@ApiOkResponse({ type: _Artist, isArray: true })
	@ApiUnauthorizedResponse({ description: "Invalid token" })
	@ApiOperation({ description: "Search an artist" })
	async searchArtists(
		@Request() req: any,
		@Query("include") include: string,
		@Query("q") query: string | null,
		@Query("skip", new DefaultValuePipe(0), ParseIntPipe) skip: number,
		@Query("take", new DefaultValuePipe(20), ParseIntPipe) take: number,
	): Promise<Artist[]> {
		return await this.searchService.searchArtists(
			query ?? "",
			mapInclude(include, req, ArtistController.includableFields),
			skip,
			take,
		);
	}
}
