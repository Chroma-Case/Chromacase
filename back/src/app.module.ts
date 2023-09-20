import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { SongModule } from './song/song.module';
import { LessonModule } from './lesson/lesson.module';
import { SettingsModule } from './settings/settings.module';
import { ArtistService } from './artist/artist.service';
import { GenreModule } from './genre/genre.module';
import { ArtistModule } from './artist/artist.module';
import { AlbumModule } from './album/album.module';
import { SearchModule } from './search/search.module';
import { HistoryModule } from './history/history.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
	imports: [
		UsersModule,
		PrismaModule,
		AuthModule,
		SongModule,
		LessonModule,
		GenreModule,
		ArtistModule,
		AlbumModule,
		SearchModule,
		SettingsModule,
		HistoryModule,
		MailerModule.forRoot({
			transport: process.env.SMTP_TRANSPORT,
			defaults: {
				from: process.env.MAIL_AUTHOR,
			},
		}),
	],
	controllers: [AppController],
	providers: [AppService, PrismaService, ArtistService],
})
export class AppModule {}
