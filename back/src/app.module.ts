import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { SongModule } from './song/song.module';
import { LessonModule } from './lesson/lesson.module';
import { ArtistController } from './artist/artist.controller';
import { ArtistService } from './artist/artist.service';
import { GenreModule } from './genre/genre.module';
import { ArtistModule } from './artist/artist.module';
import { AlbumModule } from './album/album.module';

@Module({
	imports: [UsersModule, PrismaModule, AuthModule, SongModule, LessonModule, GenreModule, ArtistModule, AlbumModule],
	controllers: [AppController],
	providers: [AppService, PrismaService, ArtistService],
})
export class AppModule {}
