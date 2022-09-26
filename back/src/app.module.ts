import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { SongModule } from './song/song.module';
import { LessonModule } from './lesson/lesson.module';

@Module({
  imports: [UsersModule, PrismaModule, AuthModule, SongModule, LessonModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
