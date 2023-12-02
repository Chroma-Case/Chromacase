import { Column, Row, Text, useTheme } from 'native-base';
import ButtonBase from './UI/ButtonBase';
import { Translate, TranslationKey, translate } from '../i18n/i18n';
import { Play, Star1 } from 'iconsax-react-native';
import { useNavigation } from '../Navigation';

type ScoreModalProps = {
	songId: number;
	overallScore: number;
	precision: number;
	score: {
		missed: number;
		good: number;
		great: number;
		perfect: number;
		wrong: number;
		max_score: number;
		current_streak: number;
		max_streak: number;
	};
};

const ScoreModal = () => {
	const props = {
		songId: 1,
		overallScore: 74,
		precision: 0,
		score: {
			missed: 9,
			good: 1,
			great: 2,
			perfect: 4,
			wrong: 0,
			max_score: 100,
			current_streak: 1,
			max_streak: 11,
		} as const
	} as const; //TODO DELETE ME
	const navigation = useNavigation()
	const theme = useTheme();
	const score = (props.overallScore * 100) / props.score.max_score
	const column1 = {
		perfect: [props.score.perfect, 'primary'],
		great: [props.score.great, 'secondary'],
		good: [props.score.good, 'success']
	} as const
	const column2 = {
		bestStreak: [props.score.max_streak, 'notification'],
		missed: [props.score.missed, 'alert'],
		wrong: [props.score.wrong, 'error']
	} as const

	return <Column w='xl' space={4} style={{ alignItems: 'center' }}>
		<Row space={2} style={{ justifyContent: 'center' }}>
			{[1, 2, 3].map((index) => (
				<Star1
					color={theme.colors.primary[500]}
					key={index}
					variant={score >= (index * 100/ 4) ? 'Bold' : 'Outline' }
				/>
			))}
		</Row>
		<Text fontSize='3xl' >{score}%</Text>
		<Row w="100%" style={{ justifyContent: 'space-between' }}>
			<Translate translationKey='precision'/>
			<Text>{props.precision}%</Text>
		</Row>
		<Row w="100%" space={2}>
			{([column1, column2] as const).map((column, columnIndex) => (
				<Column w="50%" space={2} key={columnIndex}>
					{Object.keys(column).map((key) => {
						const translationKey = key;
						const [value, color] = column[translationKey as keyof typeof column] as [number, string];

						return <Row key={translationKey} style={{ justifyContent: 'space-between' }}>
							<Translate translationKey={translationKey as TranslationKey} fontWeight={'bold'} color={`${color}.500`} />
							<Text>x{value}</Text>
						</Row>
					})}
				</Column>
			))}
		</Row>
		<Row w="100%" style={{ justifyContent: 'space-between' }}>
			<ButtonBase
				style={{}}
				icon={Play}
				type="outlined"
				title={translate('playAgain')}
				onPress={() => navigation.navigate('Play', { songId: props.songId })}
			/>
			<ButtonBase
				style={{}}
				icon={Play}
				type="filled"
				title={translate('menuMusic')}
				onPress={() => navigation.canGoBack()
					? navigation.goBack()
					: navigation.navigate('HomeNew', {})
				}
			/>
		</Row>
	</Column>
};

export default ScoreModal;
