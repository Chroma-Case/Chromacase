import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
	imports: [PrismaModule],
	providers: [SettingsService],
	exports: [SettingsService],
})
export class SettingsModule {}
