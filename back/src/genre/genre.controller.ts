import {
	Body,
	ConflictException,
	Controller,
	DefaultValuePipe,
	Delete,
	Get,
	InternalServerErrorException,
	NotFoundException,
	Param,
	ParseIntPipe,
	Post,
	Query,
	Req,
	StreamableFile,
	UseGuards,
} from "@nestjs/common";
import { ApiOkResponsePlaginated, Plage } from "src/models/plage";
import { CreateGenreDto } from "./dto/create-genre.dto";
import { Request } from "express";
import { GenreService } from "./genre.service";
import { Prisma, Genre } from "@prisma/client";
import { ApiTags } from "@nestjs/swagger";
import { createReadStream, existsSync } from "fs";
import { FilterQuery } from "src/utils/filter.pipe";
import { Genre as _Genre } from "src/_gen/prisma-class/genre";
import { IncludeMap, mapInclude } from "src/utils/include";
import { Public } from "src/auth/public";
import { AuthGuard } from "@nestjs/passport";

@Controller("genre")
@ApiTags("genre")
@UseGuards(AuthGuard(["jwt", "api-key"]))
export class GenreController {
	static filterableFields: string[] = ["+id", "name"];
	static includableFields: IncludeMap<Prisma.GenreInclude> = {
		Song: true,
	};

	constructor(private readonly service: GenreService) {}

	@Post()
	async create(@Body() dto: CreateGenreDto) {
		try {
			return await this.service.create(dto);
		} catch {
			throw new ConflictException(await this.service.get({ name: dto.name }));
		}
	}

	@Delete(":id")
	async remove(@Param("id", ParseIntPipe) id: number) {
		try {
			return await this.service.delete({ id });
		} catch {
			throw new NotFoundException("Invalid ID");
		}
	}

	@Get(":id/illustration")
	@Public()
	async getIllustration(@Param("id", ParseIntPipe) id: number) {
		const genre = await this.service.get({ id });
		if (!genre) throw new NotFoundException("Genre not found");
		const path = `/assets/genres/${genre.name}/illustration.png`;
		if (!existsSync(path))
			throw new NotFoundException("Illustration not found");

		try {
			const file = createReadStream(path);
			return new StreamableFile(file);
		} catch {
			throw new InternalServerErrorException();
		}
	}

	@Get()
	@ApiOkResponsePlaginated(_Genre)
	async findAll(
		@Req() req: Request,
		@FilterQuery(GenreController.filterableFields)
		where: Prisma.GenreWhereInput,
		@Query("include") include: string,
		@Query("skip", new DefaultValuePipe(0), ParseIntPipe) skip: number,
		@Query("take", new DefaultValuePipe(20), ParseIntPipe) take: number,
	): Promise<Plage<Genre>> {
		const ret = await this.service.list({
			skip,
			take,
			where,
			include: mapInclude(include, req, GenreController.includableFields),
		});
		return new Plage(ret, req);
	}

	@Get(":id")
	async findOne(
		@Req() req: Request,
		@Query("include") include: string,
		@Param("id", ParseIntPipe) id: number,
	) {
		const res = await this.service.get(
			{ id },
			mapInclude(include, req, GenreController.includableFields),
		);

		if (res === null) throw new NotFoundException("Genre not found");
		return res;
	}
}
