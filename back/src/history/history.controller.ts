import {
	Body,
	Controller,
	DefaultValuePipe,
	Get,
	HttpCode,
	ParseIntPipe,
	Post,
	Query,
	Request,
	UseGuards,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { SearchHistory, SongHistory } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { SongHistoryDto } from './dto/SongHistoryDto';
import { HistoryService } from './history.service';
import { SearchHistoryDto } from './dto/SearchHistoryDto';
import { SongHistory as _SongHistory } from 'src/_gen/prisma-class/song_history';
import { SearchHistory as _SearchHistory} from 'src/_gen/prisma-class/search_history';

@Controller('history')
@ApiTags('history')
export class HistoryController {
	constructor(private readonly historyService: HistoryService) { }

	@Get()
	@ApiOperation({ description: "Get song history of connected user"})
	@UseGuards(JwtAuthGuard)
	@ApiOkResponse({ type: _SongHistory, isArray: true})
	@ApiUnauthorizedResponse({ description: 'Invalid token' })
	async getHistory(
		@Request() req: any,
		@Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
		@Query('take', new DefaultValuePipe(20), ParseIntPipe) take: number,
	): Promise<SongHistory[]> {
		return this.historyService.getHistory(req.user.id, { skip, take });
	}

	@Get('search')
	@ApiOperation({ description: "Get search history of connected user"})
	@UseGuards(JwtAuthGuard)
	@ApiOkResponse({ type: _SearchHistory, isArray: true})
	@ApiUnauthorizedResponse({ description: 'Invalid token' })
	async getSearchHistory(
		@Request() req: any,
		@Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
		@Query('take', new DefaultValuePipe(20), ParseIntPipe) take: number,
	): Promise<SearchHistory[]> {
		return this.historyService.getSearchHistory(req.user.id, { skip, take });
	}

	@Post()
	@ApiOperation({ description: "Create a record of a song played by a user"})
	@ApiCreatedResponse({ description: "Succesfully created a record"})
	async create(@Body() record: SongHistoryDto): Promise<SongHistory> {
		return this.historyService.createSongHistoryRecord(record);
	}

	@Post("search")
	@ApiOperation({ description: "Creates a search record in the users history"})
	@UseGuards(JwtAuthGuard)
	@ApiUnauthorizedResponse({description: "Invalid token"})
	async createSearchHistory(
		@Request() req: any,
		@Body() record: SearchHistoryDto
		): Promise<void> {
			await this.historyService.createSearchHistoryRecord(req.user.id, { query: record.query, type: record.type });
		}
}
