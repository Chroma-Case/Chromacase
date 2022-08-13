import Competency from "./Competency";
import Model from "./Model";

/**
 * A Lesson is an exercice that the user can try to practice a competency
 */
interface Lesson extends Model {
	/**
	 * The title of the lesson
	 */
	title: string,
	/**
	 * Short description of the lesson
	 */
	description: string;
	/**
	 * The minimum level required for the user to access this lesson
	 */
	requiredLevel: number;
	/**
	 * The main competency learnt in this lesson
	 */
	mainCompetency: Competency;
}

export default Lesson;