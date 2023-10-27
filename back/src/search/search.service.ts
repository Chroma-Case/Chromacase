import { Injectable } from "@nestjs/common";
import { Artist, Prisma, Song, Genre } from "@prisma/client";
import { HistoryService } from "src/history/history.service";
import { PrismaService } from "src/prisma/prisma.service";
import { MeiliService } from "./meilisearch.service";

@Injectable()
export class SearchService {
	constructor(
		private prisma: PrismaService,
		private history: HistoryService,
		private search: MeiliService,
	) {}

	async searchSong(
		query: string,
		artistId?: number,
		include?: Prisma.SongInclude,
		skip?: number,
		take?: number,
	): Promise<Song[]> {
		if (query.length === 0) {
			return await this.prisma.song.findMany({
				where: {
					artistId,
				},
				take,
				skip,
				include,
			});
		}
		const ids = (
			await this.search.index("songs").search(query, {
				limit: take,
				offset: skip,
				...(artistId ? { filter: `artistId = ${artistId}` } : {}),
			})
		).hits.map((x) => x.id);

		return (
			await this.prisma.song.findMany({
				where: {
					id: { in: ids },
				},
				include,
			})
		).sort((x) => ids.indexOf(x.id));
	}

	async searchArtists(
		query: string,
		include?: Prisma.ArtistInclude,
		skip?: number,
		take?: number,
	): Promise<Artist[]> {
		if (query.length === 0) {
			return this.prisma.artist.findMany({
				take,
				skip,
				include,
			});
		}
		const ids = (
			await this.search.index("artists").search(query, {
				limit: take,
				offset: skip,
			})
		).hits.map((x) => x.id);

		return (
			await this.prisma.artist.findMany({
				where: {
					id: { in: ids },
				},
				include,
			})
		).sort((x) => ids.indexOf(x.id));
	}
}
