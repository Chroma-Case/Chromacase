import { ApiProperty } from "@nestjs/swagger";

export class Setting {
	@ApiProperty()
	id: number;
	@ApiProperty()
	userId: number;
	@ApiProperty()
	pushNotification: boolean;
	@ApiProperty()
	emailNotification: boolean;
	@ApiProperty()
	trainingNotification: boolean;
	@ApiProperty()
	newSongNotification: boolean;
	@ApiProperty()
	recommendations: boolean;
	@ApiProperty()
	weeklyReport: boolean;
	@ApiProperty()
	leaderBoard: boolean;
	@ApiProperty()
	showActivity: boolean;
}
