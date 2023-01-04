import { DefaultValuePipe, Injectable, ParseIntPipe, Query, Req } from '@nestjs/common';
import { Prisma, Song } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SearchService {
    constructor(private prisma: PrismaService) {}
    async songByTitle(songWhereUniqueInput: Prisma.SongWhereUniqueInput): Promise<Song | null> {
		return this.prisma.song.findUnique({
			where: songWhereUniqueInput,
		});
	}

    async all(): Promise<Song[] | null> {
        return this.prisma.song.findMany
    }

    getHello(): string {
		return 'Hello World!';
	}

    // async songAdvanced(
    //     SongWhereInput: Prisma.SongWhereInput): Promise<Song[] | null> {
    //         return this.prisma.song.findMany({
    //             where: SongWhereInput,
    //         });
    //     }
}
