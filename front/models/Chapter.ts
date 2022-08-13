import Competency from "./Competency";
import Model from "./Model";

interface Chapter extends Model {
	start: number;
	end: number;
	songId: number;
	name: string;
	type: 'chorus' | 'verse';
	key_aspect: Competency;
	difficulty: number
}

export default Chapter;