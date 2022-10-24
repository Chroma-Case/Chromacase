import { ApiProperty } from '@nestjs/swagger';

export class UpdateSettingDto {
	@ApiProperty()
	pushNotification?: boolean;
	@ApiProperty()
	emailNotification?: boolean;
	@ApiProperty()
	trainingNotification?: boolean;
	@ApiProperty()
	newsongNotification?: boolean;
	@ApiProperty()
	dataCollection?: boolean;
	@ApiProperty()
	CustomAdds?: boolean;
	@ApiProperty()
	Recommendations?: boolean;
}
