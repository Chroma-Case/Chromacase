import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class SearchHistoryDto {
	@ApiProperty()
	@IsNumber()
	userID: number;

	@ApiProperty()
	query: string;

	@ApiProperty()
	type: "song" | "artist" | "album" | "genre";
}
