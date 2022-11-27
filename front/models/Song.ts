import Metrics from "./Metrics";
import Model from "./Model";

interface Song extends Model {
	title: string;
	description: string;
	album: string;
	metrics: Metrics;
}

export default Song;