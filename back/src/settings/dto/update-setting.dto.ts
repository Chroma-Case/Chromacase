import { ApiProperty } from "@nestjs/swagger";

export class UpdateSettingDto {
	@ApiProperty()
	pushNotification?: boolean;
	@ApiProperty()
	emailNotification?: boolean;
	@ApiProperty()
	trainingNotification?: boolean;
	@ApiProperty()
	newSongNotification?: boolean;
	@ApiProperty()
	recommendations?: boolean;
	@ApiProperty()
	weeklyReport?: boolean;
	@ApiProperty()
	leaderBoard?: boolean;
	@ApiProperty()
	showActivity?: boolean;
}
