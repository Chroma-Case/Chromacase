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
		info,
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
				info,
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
			orderBy: { playDate: 'desc' },
			skip,
			take,
		});
	}

	async getForSong({
		playerId,
		songId,
	}: {
		playerId: number;
		songId: number;
	}): Promise<{ best: number; history: SongHistory[] }> {
		const history = await this.prisma.songHistory.findMany({
			where: { user: { id: playerId }, song: { id: songId } },
			orderBy: { playDate: 'desc' },
		});

		return {
			best: Math.max(...history.map((x) => x.score)),
			history,
		};
	}

	async createSearchHistoryRecord(
		userID: number,
		{ query, type }: SearchHistoryDto,
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
			orderBy: { searchDate: 'desc' },
			skip,
			take,
		});
	}
}
