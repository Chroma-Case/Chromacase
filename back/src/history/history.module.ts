import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';

@Module({
	imports: [PrismaModule],
	providers: [HistoryService],
	controllers: [HistoryController],
	exports: [HistoryService],
})
export class HistoryModule {}
