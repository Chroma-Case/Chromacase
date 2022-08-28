import Skill from "./Skill";
import Model from "./Model";

interface Chapter extends Model {
	start: number;
	end: number;
	songId: number;
	name: string;
	type: 'chorus' | 'verse';
	key_aspect: Skill;
	difficulty: number
}

export default Chapter;