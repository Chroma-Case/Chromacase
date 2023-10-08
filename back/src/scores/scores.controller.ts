import {
	Controller,
	Get,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ScoresService } from './scores.service';

@ApiTags('scores')
@Controller('scores')
export class ScoresController {
	constructor(private readonly scoresService: ScoresService) {}
    

    // @ApiOkResponse({ description: 'Successfully sent the Top 3 players'})
    // @Get('scores/top/3')
    // getTopThree(): Promise<any> {
    //     // return await this.scoresService.topThree();
    //     return [] as any[];
    // }
}