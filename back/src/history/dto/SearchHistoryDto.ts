import { ApiProperty } from '@nestjs/swagger';

export class SearchHistoryDto {
	@ApiProperty()
	query: string;

	@ApiProperty()
	type: 'song' | 'artist' | 'album' | 'genre';
}
