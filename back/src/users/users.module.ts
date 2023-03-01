import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SettingsService } from 'src/settings/settings.service';

@Module({
	imports: [PrismaModule],
	controllers: [UsersController],
	providers: [UsersService, SettingsService],
	exports: [UsersService],
})
export class UsersModule {}
