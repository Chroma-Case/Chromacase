import { Injectable } from '@nestjs/common';
import { SearchHistory, SongHistory } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { SearchHistoryDto } from './dto/SearchHistoryDto';
import { SongHistoryDto } from './dto/SongHistoryDto';

@Injectable()
export class HistoryService {
	constructor(private prisma: PrismaService) {}

	async createSongHistoryRecord({
		songID,
		userID,
		score,
		difficulties,
	}: SongHistoryDto): Promise<SongHistory> {
		await this.prisma.user.update({
			where: { id: userID },
			data: {
				partyPlayed: {
					increment: 1,
				},
			},
		});
		return this.prisma.songHistory.create({
			data: {
				score,
				difficulties,
				song: {
					connect: {
						id: songID,
					},
				},
				user: {
					connect: {
						id: userID,
					},
				},
			},
		});
	}

	async getHistory(
		playerId: number,
		{ skip, take }: { skip?: number; take?: number },
	): Promise<SongHistory[]> {
		return this.prisma.songHistory.findMany({
			where: { user: { id: playerId } },
			skip,
			take,
		});
	}

	async createSearchHistoryRecord(
		userID: number,
		{ query, type, timestamp }: SearchHistoryDto
	): Promise<SearchHistory> {
		return this.prisma.searchHistory.create({
			data: {
				query,
				type,
				user: {
					connect: {
						id: userID,
					},
				},
			},
		});
	}

	async getSearchHistory(
		playerId: number,
		{ skip, take }: { skip?: number; take?: number },
	): Promise<SearchHistory[]> {
		return this.prisma.searchHistory.findMany({
			where: { user: { id: playerId } },
			skip,
			take,
			orderBy: {id: 'desc'},
		});
	}
}
