import { Injectable } from '@nestjs/common';
import { Prisma, Album } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AlbumService {
	constructor(private prisma: PrismaService) {}

	async createAlbum(data: Prisma.AlbumCreateInput): Promise<Album> {
		return this.prisma.album.create({
			data,
		});
	}

	async album(
		albumWhereUniqueInput: Prisma.AlbumWhereUniqueInput,
	): Promise<Album | null> {
		return this.prisma.album.findUnique({
			where: albumWhereUniqueInput,
		});
	}

	async albums(params: {
		skip?: number;
		take?: number;
		cursor?: Prisma.AlbumWhereUniqueInput;
		where?: Prisma.AlbumWhereInput;
		orderBy?: Prisma.AlbumOrderByWithRelationInput;
	}): Promise<Album[]> {
		const { skip, take, cursor, where, orderBy } = params;
		return this.prisma.album.findMany({
			skip,
			take,
			cursor,
			where,
			orderBy,
		});
	}

	async deleteAlbum(where: Prisma.AlbumWhereUniqueInput): Promise<Album> {
		return this.prisma.album.delete({
			where,
		});
	}
}
