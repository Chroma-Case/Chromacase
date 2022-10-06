import {
	Controller,
	Get,
	Res,
	Query,
	Req,
	Request,
	Param,
	ParseIntPipe,
	DefaultValuePipe,
	BadRequestException,
	Post,
	Body,
	Delete,
	NotFoundException,
} from '@nestjs/common';
import { Plage } from 'src/models/plage';
import { LessonService } from './lesson.service';
import { ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { Prisma, Skill } from '@prisma/client';

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

@ApiTags('lessons')
@Controller('lesson')
export class LessonController {
	constructor(private lessonService: LessonService) {}

	@ApiOperation({
		summary: 'Get all lessons',
	})
	@Get()
	async getAll(
		@Req() request: Request,
		@Query() filter: Prisma.LessonWhereInput,
		@Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
		@Query('take', new DefaultValuePipe(20), ParseIntPipe) take: number,
	): Promise<Plage<Lesson>> {
		try {
			const ret = await this.lessonService.getAll({
				skip,
				take,
				where: {
					...filter,
					requiredLevel: filter.requiredLevel
						? +filter.requiredLevel
						: undefined,
				},
			});
			return new Plage(ret, request);
		} catch (e) {
			console.log(e);
			throw new BadRequestException(null, e?.toString());
		}
	}

	@ApiOperation({
		summary: 'Get a particular lessons',
	})
	@Get(':id')
	async get(@Param('id', ParseIntPipe) id: number): Promise<Lesson> {
		const ret = await this.lessonService.get(id);
		if (!ret) throw new NotFoundException();
		return ret;
	}

	@ApiOperation({
		summary: 'Create a lessons',
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
		summary: 'Delete a lessons',
	})
	@Delete(':id')
	async delete(@Param('id', ParseIntPipe) id: number): Promise<Lesson> {
		try {
			return await this.lessonService.delete(id);
		} catch (e) {
			console.log(e);
			throw new BadRequestException(null, e.toString());
		}
	}
}