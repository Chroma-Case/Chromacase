import { ApiProperty } from '@nestjs/swagger';

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
	newsongNotification: boolean;
	@ApiProperty()
	dataCollection: boolean;
	@ApiProperty()
	CustomAdds: boolean;
	@ApiProperty()
	Recommendations: boolean;
}
