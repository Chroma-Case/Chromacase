import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty } from "class-validator";

export class CreateSongDto {

	@IsNotEmpty()
	@ApiProperty()
	name: string

	@IsNotEmpty()
	@ApiProperty()
	difficulties: object
}
