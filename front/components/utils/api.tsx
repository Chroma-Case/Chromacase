import API from '../../API';
import Song, { SongWithArtist } from '../../models/Song';

export const getSongWArtistSuggestions = async () => {
	const nextStepQuery = await API.getSongSuggestions();

	const songWartist = await Promise.all(
		nextStepQuery.map(async (song) => {
			if (!song.artistId) throw new Error('Song has no artistId');
			const artist = await API.getArtist(song.artistId);
			return { ...song, artist } as SongWithArtist;
		})
	);
	return songWartist;
};
