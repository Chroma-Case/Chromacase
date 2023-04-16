// users/users.module.ts

import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { GoogleStrategy } from './google.strategy';

@Module({
	imports: [PrismaModule],
	controllers: [UsersController],
	providers: [UsersService, GoogleStrategy],
	exports: [UsersService],
})
export class UsersModule {}
