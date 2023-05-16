import { Injectable } from '@nestjs/common';
import { Album, Artist, Prisma, Song, Genre } from '@prisma/client';
import { HistoryService } from 'src/history/history.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SearchService {
	constructor(private prisma: PrismaService, private history: HistoryService) { }

	async songByGuess(query: string, userID: number): Promise<Song[]> {
		await this.history.createSearchHistoryRecord({ query: query, type: 'song', userID });
		return this.prisma.song.findMany({
			where: {
				name: { contains: query, mode: 'insensitive' },
			},
		});
	}

	async genreByGuess(query: string, userID: number): Promise<Genre[]> {
		await this.history.createSearchHistoryRecord({ query: query, type: 'genre', userID });
		return this.prisma.genre.findMany({
			where: {
				name: { contains: query, mode: 'insensitive' },
			},
		});
	}

	async artistByGuess(query: string, userID: number): Promise<Artist[]> {
		await this.history.createSearchHistoryRecord({ query: query, type: 'artist', userID });
		return this.prisma.artist.findMany({
			where: {
				name: { contains: query, mode: 'insensitive' },
			},
		});
	}
}
