import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { ArtistController } from "./artist.controller";
import { ArtistService } from "./artist.service";
import { SearchModule } from "src/search/search.module";

@Module({
	imports: [PrismaModule, SearchModule],
	controllers: [ArtistController],
	providers: [ArtistService],
})
export class ArtistModule {}
