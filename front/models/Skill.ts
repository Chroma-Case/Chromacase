import * as yup from 'yup';

const Skills = [
	'rhythm',
	'two-hands',
	'combos',
	'arpeggio',
	'distance',
	'left-hand',
	'right-hand',
	'lead-head-change',
	'chord-complexity',
	'chord-timing',
	'pedal',
	'precision'
] as const;
type Skill = typeof Skills[number];

export const SkillValidator =  yup.mixed<Skill>().oneOf(Skills);

export default Skill;
