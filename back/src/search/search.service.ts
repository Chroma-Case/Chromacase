import { DefaultValuePipe, Injectable, ParseIntPipe, Query, Req } from '@nestjs/common';
import { Album, Artist, Prisma, Song } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SearchService {
	constructor(private prisma: PrismaService) {}

	async songByTitle(songWhereUniqueInput: Prisma.SongWhereUniqueInput): Promise<Song | null> {
		return this.prisma.song.findUnique({
			where: songWhereUniqueInput,
		});
	}

	async songsByArtist(artistId: number): Promise<Song[]> {
		return this.prisma.song.findMany({
			where: {
				artistId: artistId
			},
			orderBy: [
			]
		});
	}

	async songsByGenre(genreId: number): Promise<Song[]> {
		return this.prisma.song.findMany({
			where: {
				genreId: genreId
			}
		});
	}
	
	async songsByAlbum(albumId: number): Promise<Song[]> {
		return this.prisma.song.findMany({
			where: {
				albumId: albumId
			}
		});
	}

	async artistByName(artistName: string): Promise<Artist | null> {
		return this.prisma.artist.findUnique({
			where: {
				name: artistName
			}
		});
	}

	async guessSong(word: string): Promise<Song[]> {
		return this.prisma.song.findMany({
			where: {
				name: {contains: word}
			}
		});
	}

	async guessArtist(word: string): Promise<Artist[]> {
		return this.prisma.artist.findMany({
			where: {
				name: {contains: word},
			}
		});
		
	}

	async guessAlbum(word: string): Promise<Album[]> {
		return this.prisma.album.findMany({
			where: {
				name: {contains: word},
			}
		});
	}

	async findAdvanced(params: {
		albumId?: number;
		genreId?: number;
		artistId?: number;
		orderBy?: Prisma.SongOrderByWithRelationInput;
	}): Promise<Song[]> {
		const { albumId: albumId, genreId: genreId, artistId: artistId, orderBy: orderBy } = params;
		return this.prisma.song.findMany({
			where: {
				OR:[
					{
						albumId: { equals: albumId },
						genreId: { equals: genreId },
						artistId: { equals: artistId },
					}
				]
			},
			orderBy
		});
	}
}
