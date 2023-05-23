import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class SongHistoryDto {
	@ApiProperty()
	@IsNumber()
	songID: number;

	@ApiProperty()
	@IsNumber()
	userID: number;

	@ApiProperty()
	@IsNumber()
	score: number;

	@ApiProperty()
	difficulties: Record<string, number>

	@ApiProperty()
	info: Record<string, number>
}
