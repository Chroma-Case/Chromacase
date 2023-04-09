import Model from "./Model";
import SongDetails from "./SongDetails";

interface Song extends Model {
	name: string
	artistId: number | null
	albumId: number | null
	genreId: number | null;
	cover: string;
	details: SongDetails;
}

export default Song;