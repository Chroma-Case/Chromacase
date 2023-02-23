import { ApiProperty } from '@nestjs/swagger';

export class SearchSongDto {
	@ApiProperty()
	artist?: number;

	@ApiProperty()
	album?: number;

	@ApiProperty()
	genre?: number;
}
