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
import { CreateArtistDto } from "./dto/create-artist.dto";
import { Request } from "express";
import { ArtistService } from "./artist.service";
import { Prisma, Artist } from "@prisma/client";
import {
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
} from "@nestjs/swagger";
import { createReadStream, existsSync } from "fs";
import { FilterQuery } from "src/utils/filter.pipe";
import { Artist as _Artist } from "src/_gen/prisma-class/artist";
import { IncludeMap, mapInclude } from "src/utils/include";
import { Public } from "src/auth/public";
import { AuthGuard } from "@nestjs/passport";

@Controller("artist")
@ApiTags("artist")
@UseGuards(AuthGuard(["jwt", "api-key"]))
export class ArtistController {
	static filterableFields = ["+id", "name"];
	static includableFields: IncludeMap<Prisma.ArtistInclude> = {
		Song: true,
		Album: true,
	};

	constructor(private readonly service: ArtistService) {}

	@Post()
	@ApiOperation({
		description: "Register a new artist, should not be used by frontend",
	})
	async create(@Body() dto: CreateArtistDto) {
		try {
			return await this.service.create(dto);
		} catch {
			throw new ConflictException(await this.service.get({ name: dto.name }));
		}
	}

	@Delete(":id")
	@ApiOperation({ description: "Delete an artist by id" })
	async remove(@Param("id", ParseIntPipe) id: number) {
		try {
			return await this.service.delete({ id });
		} catch {
			throw new NotFoundException("Invalid ID");
		}
	}

	@Get(":id/illustration")
	@ApiOperation({ description: "Get an artist's illustration" })
	@ApiNotFoundResponse({ description: "Artist or illustration not found" })
	@Public()
	async getIllustration(@Param("id", ParseIntPipe) id: number) {
		const artist = await this.service.get({ id });
		if (!artist) throw new NotFoundException("Artist not found");
		const path = `/assets/artists/${artist.name}/illustration.png`;
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
	@ApiOperation({ description: "Get all artists paginated" })
	@ApiOkResponsePlaginated(_Artist)
	async findAll(
		@Req() req: Request,
		@FilterQuery(ArtistController.filterableFields)
		where: Prisma.ArtistWhereInput,
		@Query("include") include: string,
		@Query("skip", new DefaultValuePipe(0), ParseIntPipe) skip: number,
		@Query("take", new DefaultValuePipe(20), ParseIntPipe) take: number,
	): Promise<Plage<Artist>> {
		const ret = await this.service.list({
			skip,
			take,
			where,
			include: mapInclude(include, req, ArtistController.includableFields),
		});
		return new Plage(ret, req);
	}

	@Get(":id")
	@ApiOperation({ description: "Get an artist by id" })
	@ApiOkResponse({ type: _Artist })
	async findOne(
		@Req() req: Request,
		@Query("include") include: string,
		@Param("id", ParseIntPipe) id: number,
	) {
		const res = await this.service.get(
			{ id },
			mapInclude(include, req, ArtistController.includableFields),
		);

		if (res === null) throw new NotFoundException("Artist not found");
		return res;
	}
}
