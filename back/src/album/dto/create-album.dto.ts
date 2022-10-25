import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateAlbumDto {
	@IsNotEmpty()
	@ApiProperty()
	name: string;

	@ApiProperty()
	artist?: number;
}
