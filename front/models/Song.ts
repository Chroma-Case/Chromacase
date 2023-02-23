import Metrics from "./Metrics";
import Model from "./Model";

interface Song extends Model {
	name: string
	artistId: number | null
	albumId: number | null
	genreId: number | null;
	cover: string;
	metrics: Metrics;
}

export default Song;