import { ApiProperty } from "@nestjs/swagger";

export class SearchHistoryDto {
	@ApiProperty()
	query: string;

	@ApiProperty()
	timestamp: number;

	@ApiProperty()
	type: "song" | "artist" | "album" | "genre";
}
