import {
	Controller,
	Get,
	Query,
	Req,
	Param,
	ParseIntPipe,
	DefaultValuePipe,
	BadRequestException,
	Post,
	Body,
	Delete,
	NotFoundException,
	UseGuards,
} from "@nestjs/common";
import { ApiOkResponsePlaginated, Plage } from "src/models/plage";
import { LessonService } from "./lesson.service";
import { ApiOperation, ApiProperty, ApiTags } from "@nestjs/swagger";
import { Prisma, Skill } from "@prisma/client";
import { FilterQuery } from "src/utils/filter.pipe";
import { Lesson as _Lesson } from "src/_gen/prisma-class/lesson";
import { IncludeMap, mapInclude } from "src/utils/include";
import { Request } from "express";
import { AuthGuard } from "@nestjs/passport";

export class Lesson {
	@ApiProperty()
	id: number;
	@ApiProperty()
	name: string;
	@ApiProperty()
	description: string;
	@ApiProperty()
	requiredLevel: number;
	@ApiProperty()
	mainSkill: Skill;
}

@ApiTags("lessons")
@Controller("lesson")
@UseGuards(AuthGuard(["jwt", "api-key"]))
export class LessonController {
	static filterableFields: string[] = [
		"+id",
		"name",
		"+requiredLevel",
		"mainSkill",
	];
	static includableFields: IncludeMap<Prisma.LessonInclude> = {
		LessonHistory: true,
	};

	constructor(private lessonService: LessonService) {}

	@ApiOperation({
		summary: "Get all lessons",
	})
	@Get()
	@ApiOkResponsePlaginated(_Lesson)
	async getAll(
		@Req() request: Request,
		@FilterQuery(LessonController.filterableFields)
		where: Prisma.LessonWhereInput,
		@Query("include") include: string,
		@Query("skip", new DefaultValuePipe(0), ParseIntPipe) skip: number,
		@Query("take", new DefaultValuePipe(20), ParseIntPipe) take: number,
	): Promise<Plage<Lesson>> {
		const ret = await this.lessonService.getAll({
			skip,
			take,
			where,
			include: mapInclude(include, request, LessonController.includableFields),
		});
		return new Plage(ret, request);
	}

	@ApiOperation({
		summary: "Get a particular lessons",
	})
	@Get(":id")
	async get(
		@Req() req: Request,
		@Query("include") include: string,
		@Param("id", ParseIntPipe) id: number,
	): Promise<Lesson> {
		const ret = await this.lessonService.get(
			id,
			mapInclude(include, req, LessonController.includableFields),
		);
		if (!ret) throw new NotFoundException();
		return ret;
	}

	@ApiOperation({
		summary: "Create a lessons",
	})
	@Post()
	async post(@Body() lesson: Lesson): Promise<Lesson> {
		try {
			return await this.lessonService.create(lesson);
		} catch (e) {
			console.log(e);
			throw new BadRequestException(null, e.toString());
		}
	}

	@ApiOperation({
		summary: "Delete a lessons",
	})
	@Delete(":id")
	async delete(@Param("id", ParseIntPipe) id: number): Promise<Lesson> {
		try {
			return await this.lessonService.delete(id);
		} catch {
			throw new NotFoundException();
		}
	}
}
