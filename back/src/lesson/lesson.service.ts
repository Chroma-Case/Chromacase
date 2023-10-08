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
		include?: Prisma.LessonInclude;
	}): Promise<Lesson[]> {
		const { skip, take, cursor, where, orderBy, include } = params;
		return this.prisma.lesson.findMany({
			skip,
			take,
			cursor,
			where,
			orderBy,
			include,
		});
	}

	async get(
		id: number,
		include?: Prisma.LessonInclude,
	): Promise<Lesson | null> {
		return this.prisma.lesson.findFirst({
			where: {
				id: id,
			},
			include,
		});
	}

	async create(lesson: Lesson): Promise<Lesson> {
		return this.prisma.lesson.create({ data: lesson });
	}

	async delete(id: number): Promise<Lesson> {
		return this.prisma.lesson.delete({ where: { id: id } });
	}
}
