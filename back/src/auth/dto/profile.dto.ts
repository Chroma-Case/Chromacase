import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class Profile {
	@ApiProperty()
	@IsNotEmpty()
	username: string;

	@ApiProperty()
	@IsNotEmpty()
	password: string;

	@ApiProperty()
	@IsNotEmpty()
	email: string;
}
