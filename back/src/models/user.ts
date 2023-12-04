import { ApiProperty } from "@nestjs/swagger";

export class User {
	@ApiProperty()
	id: number;
	@ApiProperty()
	username: string;
	@ApiProperty()
	email: string | null;
	@ApiProperty()
	isGuest: boolean;
	@ApiProperty()
	partyPlayed: number;
}
