import { Controller, Get, Put } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { ScoresService } from "./scores.service";
import { User } from "@prisma/client";

@ApiTags("scores")
@Controller("scores")
export class ScoresController {
	constructor(private readonly scoresService: ScoresService) {}

	@ApiOkResponse({ description: "Successfully sent the Top 20 players" })
	@Get("top/20")
	getTopTwenty(): Promise<User[]> {
		return this.scoresService.topTwenty();
	}

	// @ApiOkResponse{{description: "Successfully updated the user's total score"}}
	// @Put("/add")
	// addScore(): Promise<void> {
	// 	return this.ScoresService.add()
	// }
}
