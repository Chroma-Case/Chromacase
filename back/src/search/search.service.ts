import { Injectable } from '@nestjs/common';
import { Album, Artist, Prisma, Song, Genre } from '@prisma/client';
import { HistoryService } from 'src/history/history.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SearchService {
	constructor(private prisma: PrismaService, private history: HistoryService) { }

	async songByTitle(
		songWhereUniqueInput: Prisma.SongWhereUniqueInput,
		userID: number
	): Promise<Song | null> {
		if (songWhereUniqueInput.name)
			await this.history.createSearchHistoryRecord({ query: songWhereUniqueInput.name, userID, type: "song" });
		return this.prisma.song.findUnique({
			where: songWhereUniqueInput,
		});
	}

	async songsByArtist(artistId: number): Promise<Song[]> {
		return this.prisma.song.findMany({
			where: {
				artistId: artistId,
			},
			orderBy: [],
		});
	}

	async songsByGenre(genreId: number): Promise<Song[]> {
		return this.prisma.song.findMany({
			where: {
				genreId: genreId,
			},
		});
	}

	async songsByAlbum(albumId: number): Promise<Song[]> {
		return this.prisma.song.findMany({
			where: {
				albumId: albumId,
			},
		});
	}

	async artistByName(artistName: string): Promise<Artist | null> {
		return this.prisma.artist.findUnique({
			where: {
				name: artistName,
			},
		});
	}

	async guessSong(word: string, userID: number): Promise<Song[]> {
		await this.history.createSearchHistoryRecord({ query: word, type: "song", userID });
		return this.prisma.song.findMany({
			where: {
				name: { contains: word },
			},
		});
	}

	async guessArtist(word: string, userID: number): Promise<Artist[]> {
		await this.history.createSearchHistoryRecord({ query: word, type: "artist", userID });
		return this.prisma.artist.findMany({
			where: {
				name: { contains: word },
			},
		});
	}

	async guessAlbum(word: string, userID: number): Promise<Album[]> {
		await this.history.createSearchHistoryRecord({ query: word, type: "album", userID });
		return this.prisma.album.findMany({
			where: {
				name: { contains: word },
			},
		});
	}

	async findAdvanced(params: {
		albumId?: number;
		genreId?: number;
		artistId?: number;
		orderBy?: Prisma.SongOrderByWithRelationInput;
	}): Promise<Song[]> {
		const {
			albumId: albumId,
			genreId: genreId,
			artistId: artistId,
			orderBy: orderBy,
		} = params;
		return this.prisma.song.findMany({
			where: {
				OR: [
					{
						albumId: { equals: albumId },
						genreId: { equals: genreId },
						artistId: { equals: artistId },
					},
				],
			},
			orderBy,
		});
	}

	async songByGuess(query: string, userID: number): Promise<Song[]> {
		await this.history.createSearchHistoryRecord({ query: query, type: 'song', userID });
		return this.prisma.song.findMany({
			where: {
				name: { contains: query },
			},
		});
	}

	async genreByGuess(query: string, userID: number): Promise<Genre[]> {
		await this.history.createSearchHistoryRecord({ query: query, type: 'genre', userID });
		return this.prisma.genre.findMany({
			where: {
				name: { contains: query },
			},
		});
	}

	async artistByGuess(query: string, userID: number): Promise<Artist[]> {
		await this.history.createSearchHistoryRecord({ query: query, type: 'artist', userID });
		return this.prisma.artist.findMany({
			where: {
				name: { contains: query },
			},
		});
	}
}
