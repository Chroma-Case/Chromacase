import { Injectable } from "@nestjs/common";
import { Prisma, Artist } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ArtistService {
	constructor(private prisma: PrismaService) {}

	async create(data: Prisma.ArtistCreateInput): Promise<Artist> {
		return this.prisma.artist.create({
			data,
		});
	}

	async get(
		where: Prisma.ArtistWhereUniqueInput,
		include?: Prisma.ArtistInclude,
	): Promise<Artist | null> {
		return this.prisma.artist.findUnique({
			where,
			include,
		});
	}

	async list(params: {
		skip?: number;
		take?: number;
		cursor?: Prisma.ArtistWhereUniqueInput;
		where?: Prisma.ArtistWhereInput;
		orderBy?: Prisma.ArtistOrderByWithRelationInput;
		include?: Prisma.ArtistInclude;
	}): Promise<Artist[]> {
		const { skip, take, cursor, where, orderBy, include } = params;
		return this.prisma.artist.findMany({
			skip,
			take,
			cursor,
			where,
			orderBy,
			include,
		});
	}

	async delete(where: Prisma.ArtistWhereUniqueInput): Promise<Artist> {
		return this.prisma.artist.delete({
			where,
		});
	}
}
