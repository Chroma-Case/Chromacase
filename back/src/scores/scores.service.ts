import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ScoresService {
	constructor(
		private prisma: PrismaService,
	) {}

	async topTwenty(): Promise<User[]> {
		return this.prisma.user.findMany({
			orderBy: {
				partyPlayed: 'desc',
			},
			take: 20,
		});
	}
}