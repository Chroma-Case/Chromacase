import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class SearchHistoryDto {
	@ApiProperty()

	@ApiProperty()
	query: string;

	@ApiProperty()
	timestamp: number;

	@ApiProperty()
	type: "song" | "artist" | "album" | "genre";
}
