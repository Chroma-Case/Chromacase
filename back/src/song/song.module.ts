import { Module } from '@nestjs/common';
import { SongService } from './song.service';
import { SongController } from './song.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { HistoryService } from 'src/history/history.service';

@Module({
	imports: [PrismaModule, HistoryService],
	providers: [SongService],
	controllers: [SongController],
})
export class SongModule {}
