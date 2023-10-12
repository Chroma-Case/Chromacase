import {
	Controller,
	Get,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ScoresService } from './scores.service';
import { User } from '@prisma/client';

@ApiTags('scores')
@Controller('scores')
export class ScoresController {
	constructor(private readonly scoresService: ScoresService) {}


	@ApiOkResponse({ description: 'Successfully sent the Top 20 players'})
	@Get('scores/top/20')
	getTopTwenty(): Promise<User[]> {
		return this.scoresService.topTwenty();
	}
}