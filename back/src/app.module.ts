import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { LessonController } from './lesson/lesson.controller';
import { LessonService } from './lesson/lesson.service';

@Module({
	imports: [UsersModule, PrismaModule, AuthModule],
	controllers: [AppController, LessonController],
	providers: [AppService, PrismaService, LessonService],
})
export class AppModule {}
