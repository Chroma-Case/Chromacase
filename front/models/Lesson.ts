import { SkillValidator } from './Skill';
import { ModelValidator } from './Model';
import * as yup from 'yup';

export const LessonValidator = yup
	.object({
		name: yup.string().required(),
		description: yup.string().required(),
		requiredLevel: yup.number().required(),
		mainSkill: SkillValidator.required(),
	})
	.concat(ModelValidator);

/**
 * A Lesson is an exercice that the user can try to practice a skill
 */
type Lesson = yup.InferType<typeof LessonValidator>;

export default Lesson;
