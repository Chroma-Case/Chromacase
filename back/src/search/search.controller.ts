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