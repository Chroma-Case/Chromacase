import { Injectable } from '@nestjs/common';
import { Prisma, Song } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SongService {
	constructor(private prisma: PrismaService) {}

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
