import Model from "./Model";
import SongDetails from "./SongDetails";
import Artist from "./Artist";

interface Song extends Model {
	id: number;
	name: string;
	artistId: number;
	albumId: number | null;
	genreId: number | null;
	cover: string;
	details: SongDetails;
}

export interface SongWithArtist extends Song {
	artist: Artist;
}

export default Song;