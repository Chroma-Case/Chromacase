import { Injectable } from '@nestjs/common';
import { Lesson, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LessonService {
	constructor(private prisma: PrismaService) {}

	async getAll(params: {
		skip?: number;
		take?: number;
		cursor?: Prisma.LessonWhereUniqueInput;
		where?: Prisma.LessonWhereInput;
		orderBy?: Prisma.LessonOrderByWithRelationInput;
	}): Promise<Lesson[]> {
		const { skip, take, cursor, where, orderBy } = params;
		return this.prisma.lesson.findMany({
			skip,
			take,
			cursor,
			where,
			orderBy,
		});
	}

	async get(id: number): Promise<Lesson | null> {
		return this.prisma.lesson.findFirst({
			where: {
				id: id,
			},
		});
	}

	async create(lesson: Lesson): Promise<Lesson> {
		return this.prisma.lesson.create({ data: lesson });
	}

	async delete(id: number): Promise<Lesson> {
		return this.prisma.lesson.delete({ where: { id: id } });
	}
}
