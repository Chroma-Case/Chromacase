import Skill from './Skill';
import Model from './Model';

/**
 * A Lesson is an exercice that the user can try to practice a skill
 */
interface Lesson extends Model {
	/**
	 * The title of the lesson
	 */
	title: string;
	/**
	 * Short description of the lesson
	 */
	description: string;
	/**
	 * The minimum level required for the user to access this lesson
	 */
	requiredLevel: number;
	/**
	 * The main skill learnt in this lesson
	 */
	mainSkill: Skill;
}

export default Lesson;
