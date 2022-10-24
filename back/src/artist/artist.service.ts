import { Injectable } from '@nestjs/common';
import { Prisma, Artist } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ArtistService {
	constructor(private prisma: PrismaService) {}

	async create(data: Prisma.ArtistCreateInput): Promise<Artist> {
		return this.prisma.artist.create({
			data,
		});
	}

	async get(where: Prisma.ArtistWhereUniqueInput): Promise<Artist | null> {
		return this.prisma.artist.findUnique({
			where,
		});
	}

	async list(params: {
		skip?: number;
		take?: number;
		cursor?: Prisma.ArtistWhereUniqueInput;
		where?: Prisma.ArtistWhereInput;
		orderBy?: Prisma.ArtistOrderByWithRelationInput;
	}): Promise<Artist[]> {
		const { skip, take, cursor, where, orderBy } = params;
		return this.prisma.artist.findMany({
			skip,
			take,
			cursor,
			where,
			orderBy,
		});
	}

	async delete(where: Prisma.ArtistWhereUniqueInput): Promise<Artist> {
		return this.prisma.artist.delete({
			where,
		});
	}
}
