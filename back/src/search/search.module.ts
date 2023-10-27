import { Module } from "@nestjs/common";
import { SearchService } from "./search.service";
import { SearchController } from "./search.controller";
import { HistoryModule } from "src/history/history.module";
import { PrismaModule } from "src/prisma/prisma.module";
import { SongService } from "src/song/song.service";
import { MeiliService } from "./meilisearch.service";

@Module({
	imports: [PrismaModule, HistoryModule],
	controllers: [SearchController],
	providers: [SearchService, SongService, MeiliService],
	exports: [SearchService, MeiliService],
})
export class SearchModule {}
