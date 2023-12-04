import { Module } from '@nestjs/common';
import { ScoresService } from './scores.service';
import { ScoresController } from './scores.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
	imports: [PrismaModule],
	controllers: [ScoresController],
	providers: [ScoresService],
})
export class ScoresModule {}
