import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateArtistDto {
	@IsNotEmpty()
	@ApiProperty()
	name: string;
}
