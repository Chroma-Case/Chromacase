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
import { ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { SearchHistory, SongHistory } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { SongHistoryDto } from './dto/SongHistoryDto';
import { HistoryService } from './history.service';
import { SearchHistoryDto } from './dto/SearchHistoryDto';

@Controller('history')
@ApiTags('history')
export class HistoryController {
	constructor(private readonly historyService: HistoryService) { }

	@Get()
	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	@ApiUnauthorizedResponse({ description: 'Invalid token' })
	async getHistory(
		@Request() req: any,
		@Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
		@Query('take', new DefaultValuePipe(20), ParseIntPipe) take: number,
	): Promise<SongHistory[]> {
		return this.historyService.getHistory(req.user.id, { skip, take });
	}

	@Get('search')
	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	@ApiUnauthorizedResponse({ description: 'Invalid token' })
	async getSearchHistory(
		@Request() req: any,
		@Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
		@Query('take', new DefaultValuePipe(20), ParseIntPipe) take: number,
	): Promise<SearchHistory[]> {
		return this.historyService.getSearchHistory(req.user.id, { skip, take });
	}

	@Post()
	@HttpCode(201)
	async create(@Body() record: SongHistoryDto): Promise<SongHistory> {
		return this.historyService.createSongHistoryRecord(record);
	}

	@Post("search")
	@HttpCode(201)
	@UseGuards(JwtAuthGuard)
	@ApiUnauthorizedResponse({description: "Invalid token"})
	async createSearchHistory(
		@Request() req: any,
		@Body() record: SearchHistoryDto
		): Promise<void> {
			await this.historyService.createSearchHistoryRecord(req.user.id, { query: record.query, type: record.type });
		}
}
