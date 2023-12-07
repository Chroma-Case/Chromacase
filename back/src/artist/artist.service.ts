import { Injectable } from "@nestjs/common";
import { Prisma, Artist } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { MeiliService } from "src/search/meilisearch.service";

@Injectable()
export class ArtistService {
	constructor(
		private prisma: PrismaService,
		private search: MeiliService,
	) {}

	async create(data: Prisma.ArtistCreateInput): Promise<Artist> {
		const ret = await this.prisma.artist.create({
			data,
		});
		await this.search.index("artists").addDocuments([ret]);
		return ret;
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
		const ret = await this.prisma.artist.delete({
			where,
		});
		await this.search.index("artists").deleteDocument(ret.id);
		return ret;
	}
}
