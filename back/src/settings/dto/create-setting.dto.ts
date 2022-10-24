import { ApiProperty } from '@nestjs/swagger';

export class CreateSettingDto {
	@ApiProperty()
	userId: number;
}
