import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { LessonController } from "./lesson.controller";
import { LessonService } from "./lesson.service";

@Module({
	imports: [PrismaModule],
	controllers: [LessonController],
	providers: [LessonService],
})
export class LessonModule {}
