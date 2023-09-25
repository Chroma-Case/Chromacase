import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ScoresService {
	constructor(
		private prisma: PrismaService,
	) {}

    async topThree(): Promise<any> {
        // return this.prisma.
        return [];
    }
}