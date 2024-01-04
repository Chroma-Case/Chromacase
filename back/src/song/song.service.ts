import { Injectable } from "@nestjs/common";
import { Prisma, Song } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { MeiliService } from "src/search/meilisearch.service";
import { generateSongAssets } from "src/assetsgenerator/generateImages_browserless";

@Injectable()
export class SongService {
	// number is the song id
	private assetCreationTasks: Map<number, Promise<void>>;
	constructor(
		private prisma: PrismaService,
		private search: MeiliService,
	) {
		this.assetCreationTasks = new Map();
	}

	async createAssets(mxlPath: string, songId: number): Promise<void> {
		if (this.assetCreationTasks.has(songId)) {
			await this.assetCreationTasks.get(songId);
			this.assetCreationTasks.delete(songId);
			return;
		}
		// mxlPath can the path to an archive to an xml file or the path to the xml file directly
		this.assetCreationTasks.set(
			songId,
			generateSongAssets(songId, mxlPath, "/data/cache/songs", "svg"),
		);
		return await this.assetCreationTasks.get(songId);
	}

	async songByArtist(data: number): Promise<Song[]> {
		return this.prisma.song.findMany({
			where: {
				artistId: { equals: data },
			},
		});
	}

	async createSong(data: Prisma.SongCreateInput): Promise<Song> {
		const song = await this.prisma.song.create({
			data,
		});
		// Inculde the name of the artist in the song document to make search easier.
		const artist = song.artistId
			? await this.prisma.artist.findFirst({
					where: { id: song.artistId },
			  })
			: null;
		await this.search
			.index("songs")
			.addDocuments([{ ...song, artist: artist?.name }]);
		return song;
	}

	async song(
		songWhereUniqueInput: Prisma.SongWhereUniqueInput,
		include?: Prisma.SongInclude,
	): Promise<Song | null> {
		return this.prisma.song.findUnique({
			where: songWhereUniqueInput,
			include,
		});
	}

	async songs(params: {
		skip?: number;
		take?: number;
		cursor?: Prisma.SongWhereUniqueInput;
		where?: Prisma.SongWhereInput;
		orderBy?: Prisma.SongOrderByWithRelationInput;
		include?: Prisma.SongInclude;
	}): Promise<Song[]> {
		const { skip, take, cursor, where, orderBy, include } = params;
		return this.prisma.song.findMany({
			skip,
			take,
			cursor,
			where,
			orderBy,
			include,
		});
	}

	async deleteSong(where: Prisma.SongWhereUniqueInput): Promise<Song> {
		const ret = await this.prisma.song.delete({
			where,
		});
		await this.search.index("songs").deleteDocument(ret.id);
		return ret;
	}
}
