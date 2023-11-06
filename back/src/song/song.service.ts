import { Injectable } from "@nestjs/common";
import { Prisma, Song } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { generateSongAssets } from "src/assetsgenerator/generateImages_browserless";

@Injectable()
export class SongService {
	// number is the song id
	private assetCreationTasks: Map<number, Promise<void>>;
	constructor(private prisma: PrismaService) {
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
		return this.prisma.song.create({
			data,
		});
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
		return this.prisma.song.delete({
			where,
		});
	}
}
