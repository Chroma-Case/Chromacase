import { Injectable } from '@nestjs/common';
import { Artist, Prisma, Song, Genre } from '@prisma/client';
import { HistoryService } from 'src/history/history.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { MeiliService } from './meilisearch.service';

@Injectable()
export class SearchService {
	constructor(
		private prisma: PrismaService,
		private history: HistoryService,
		private search: MeiliService,
	) {}

	async searchSong(query: string, artistId?: number): Promise<Song[]> {
		if (query.length === 0) {
			return await this.prisma.song.findMany({
				where: {
					artistId,
				},
			});
		}
		return (await this.search
			.index('songs')
			.search(query, { filter: `artistId = ${artistId}` })) as any;
	}

	async genreByGuess(
		query: string,
		userID: number,
		include?: Prisma.GenreInclude,
	): Promise<Genre[]> {
		return this.prisma.genre.findMany({
			where: {
				name: { contains: query, mode: "insensitive" },
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
				name: { contains: query, mode: "insensitive" },
			},
			include,
		});
	}
}
