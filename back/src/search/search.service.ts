import { Injectable } from '@nestjs/common';
import { Artist, Prisma, Song, Genre } from '@prisma/client';
import { HistoryService } from 'src/history/history.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SearchService {
	constructor(
		private prisma: PrismaService,
		private history: HistoryService,
	) {}

	async songByGuess(
		query: string,
		userID: number,
		include?: Prisma.SongInclude,
	): Promise<Song[]> {
		return this.prisma.song.findMany({
			where: {
				name: { contains: query, mode: 'insensitive' },
			},
			include,
		});
	}

	async genreByGuess(
		query: string,
		userID: number,
		include?: Prisma.GenreInclude,
	): Promise<Genre[]> {
		return this.prisma.genre.findMany({
			where: {
				name: { contains: query, mode: 'insensitive' },
			},
			include,
		});
	}

	async artistByGuess(
		query: string,
		userID: number,
		include?: Prisma.ArtistInclude,
	): Promise<Artist[]> {
		return this.prisma.artist.findMany({
			where: {
				name: { contains: query, mode: 'insensitive' },
			},
			include,
		});
	}
}
