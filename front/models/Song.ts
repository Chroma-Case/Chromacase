import Metrics from "./Metrics";
import Model from "./Model";
import SongDetails from "./SongDetails";

interface Song extends Model {
	name: string
	artistId: number | null
	albumId: number | null
	genreId: number | null;
	cover: string;
	metrics: Metrics;
	details: SongDetails;
}

export default Song;