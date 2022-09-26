import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
	@ApiProperty()
	@IsNotEmpty()
	password: string;

	@IsNotEmpty()
	@ApiProperty()
	username: string;

	@IsNotEmpty()
	@ApiProperty()
	email: string;
}
