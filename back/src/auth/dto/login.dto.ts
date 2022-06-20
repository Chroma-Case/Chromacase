import { IsNotEmpty } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
	@ApiProperty()
	@IsNotEmpty()
	password: string;

	@ApiProperty()
	@IsNotEmpty()
	username: string;
}
