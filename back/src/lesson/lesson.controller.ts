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
} from '@nestjs/common';
import { Plage } from 'src/models/plage';
import { LessonService } from './lesson.service';
import { Response } from 'express';
import { ApiOperation } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

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
	) {
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
	async get(@Param() id: number, @Res() response: Response) {
		const ret = await this.lessonService.get(id);
		if (ret === null) return response.status(404);
		return ret;
	}
}
