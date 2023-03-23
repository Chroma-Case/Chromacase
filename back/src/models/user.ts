import { ApiProperty } from '@nestjs/swagger';

export class User {
	@ApiProperty()
	id: number;
	@ApiProperty()
	username: string;
	@ApiProperty()
	email: string;
	@ApiProperty()
	isGuest: boolean;
	@ApiProperty()
	partyPlayed: number;
}
