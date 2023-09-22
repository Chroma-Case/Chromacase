import {
	BadRequestException,
	Body,
	Controller,
	Get,
	HttpCode,
	InternalServerErrorException,
	NotFoundException,
	Param,
	ParseIntPipe,
	Post,
	Request,
	UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ScoresService } from './scores.service';

@ApiTags('scores')
@Controller('scores')
export class ScoresController {
	constructor(private readonly searchService: ScoresService) {}
    
}