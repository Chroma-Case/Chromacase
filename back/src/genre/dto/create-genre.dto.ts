import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateGenreDto {
	@IsNotEmpty()
	@ApiProperty()
	name: string;
}
