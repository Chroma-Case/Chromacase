import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class GuestDto {
	@ApiProperty()
	@IsNotEmpty()
	username: string;
}
