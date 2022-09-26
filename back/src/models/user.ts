import { ApiProperty } from '@nestjs/swagger';

export class User {
	@ApiProperty()
	id: number;
	@ApiProperty()
	username: string;
	@ApiProperty()
	password: string;
	@ApiProperty()
	email: string;
}
