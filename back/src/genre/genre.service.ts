import { Injectable } from '@nestjs/common';
import { Prisma, Genre } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GenreService {
	constructor(private prisma: PrismaService) {}

	async create(data: Prisma.GenreCreateInput): Promise<Genre> {
		return this.prisma.genre.create({
			data,
		});
	}

	async get(where: Prisma.GenreWhereUniqueInput): Promise<Genre | null> {
		return this.prisma.genre.findUnique({
			where,
		});
	}

	async list(params: {
		skip?: number;
		take?: number;
		cursor?: Prisma.GenreWhereUniqueInput;
		where?: Prisma.GenreWhereInput;
		orderBy?: Prisma.GenreOrderByWithRelationInput;
	}): Promise<Genre[]> {
		const { skip, take, cursor, where, orderBy } = params;
		return this.prisma.genre.findMany({
			skip,
			take,
			cursor,
			where,
			orderBy,
		});
	}

	async delete(where: Prisma.GenreWhereUniqueInput): Promise<Genre> {
		return this.prisma.genre.delete({
			where,
		});
	}
}