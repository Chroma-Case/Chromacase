import { Injectable } from '@nestjs/common';
import { Album, Artist, Prisma, Song, Genre } from '@prisma/client';
import { HistoryService } from 'src/history/history.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SearchService {
	constructor(private prisma: PrismaService, private history: HistoryService) { }

	async songByGuess(query: string, userID: number): Promise<Song[]> {
		return this.prisma.song.findMany({
			where: {
				name: { contains: query, mode: 'insensitive' },
			},
		});
	}

	async genreByGuess(query: string, userID: number): Promise<Genre[]> {
		return this.prisma.genre.findMany({
			where: {
				name: { contains: query, mode: 'insensitive' },
			},
		});
	}

	async artistByGuess(query: string, userID: number): Promise<Artist[]> {
		return this.prisma.artist.findMany({
			where: {
				name: { contains: query, mode: 'insensitive' },
			},
		});
	}
}
