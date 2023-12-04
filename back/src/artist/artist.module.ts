import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { ArtistController } from "./artist.controller";
import { ArtistService } from "./artist.service";

@Module({
	imports: [PrismaModule],
	controllers: [ArtistController],
	providers: [ArtistService],
})
export class ArtistModule {}
