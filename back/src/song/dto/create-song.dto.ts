import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateSongDto {
	@IsNotEmpty()
	@ApiProperty()
	name: string;

	@IsNotEmpty()
	@ApiProperty()
	difficulties: object;

	@IsNotEmpty()
	@ApiProperty()
	midiPath: string;

	@IsNotEmpty()
	@ApiProperty()
	musicXmlPath: string;

	@ApiProperty()
	artist?: number;

	@ApiProperty()
	album?: number;

	@ApiProperty()
	genre?: number;
}
