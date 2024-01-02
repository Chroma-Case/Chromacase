import { Module } from "@nestjs/common";
import { SongService } from "./song.service";
import { SongController } from "./song.controller";
import { PrismaModule } from "src/prisma/prisma.module";
import { HistoryModule } from "src/history/history.module";
import { SearchModule } from "src/search/search.module";

@Module({
	imports: [PrismaModule, HistoryModule, SearchModule],
	providers: [SongService],
	controllers: [SongController],
})
export class SongModule {}
