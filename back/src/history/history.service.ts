import { Injectable } from '@nestjs/common';
import { Prisma, SongHistory } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { SongHistoryDto } from './dto/SongHistoryDto';

@Injectable()
export class HistoryService {
	constructor(private prisma: PrismaService) { }

	async createSongHistoryRecord({ songID, userID, score, difficulties }: SongHistoryDto): Promise<SongHistory> {
		return this.prisma.songHistory.create({
			data: {
				score,
				difficulties,
				song: {
					connect: {
						id: songID,
					},
				},
				user: {
					connect: {
						id: userID,
					},
				},
			}
		});
	}

	async getHistory(playerId: number, { skip, take }: { skip?: number, take?: number }): Promise<SongHistory[]> {
		return this.prisma.songHistory.findMany({
			where: { user: { id: playerId } },
			skip,
			take,
		})
	}
}
