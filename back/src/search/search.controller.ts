import { BadRequestException, Body, Controller, DefaultValuePipe, Get, NotFoundException, Param, ParseIntPipe, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Prisma, Song } from '@prisma/client';
import { Plage } from 'src/models/plage';
import { SongService } from 'src/song/song.service';
import { SearchSongDto } from './dto/search-song.dto';
import { SearchService } from './search.service';
import { Request } from 'express';

@ApiTags('search')
@Controller('search')
export class SearchController {
    constructor(private readonly searchService: SearchService, private readonly songService: SongService) {}
    @Get()
    getHello(): string {
        return this.searchService.getHello();
    }

    // @Get('/all')
    // findall(): Promise<Song[] | null> {
    //     return this.songService.songs();
    // }

    @Get()
	async findAll(
		@Req() req: Request,
		@Query() filter: Prisma.SongWhereInput,
		@Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
		@Query('take', new DefaultValuePipe(20), ParseIntPipe) take: number,
	): Promise<Plage<Song>> {
		try {
			const ret = await this.songService.songs({
				skip,
				take,
				where: {
					...filter,
					id: filter.id ? +filter.id : undefined,
				},
			});
			return new Plage(ret, req);
		} catch (e) {
			console.log(e);
			throw new BadRequestException(null, e?.toString());
		}
	}

    @Get('/title/:name')
    async findByName(@Param('name') name: string): Promise<Song> {
        // const ret = await this.searchService.songByTitle({ name })
        // if (!ret) throw new NotFoundException();
        throw new NotFoundException();
		// return ret;
    }

    @Get('/advanced')
    async findAdvanced(@Body() searchSongDto: SearchSongDto): Promise<Song[] | null> {
        throw new NotFoundException;
    }
}
