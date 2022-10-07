import { HStack, VStack, Text, Progress } from "native-base";
import { translate } from "../i18n/i18n";
import Card from './Card';
type CompetenciesTableProps = {
	pedalsCompetency: number;
	rightHandCompetency: number;
	leftHandCompetency: number;
	accuracyCompetency: number;
	arpegeCompetency: number;
	chordsCompetency: number;
}

const CompetenciesTable = (props: CompetenciesTableProps) => {
	return <Card padding={5}>
		<HStack space={5} flex={1}> 
			<VStack space={5}> 
			{ Object.keys(props).map((competencyName) => (
				<Text bold>{translate(competencyName as keyof CompetenciesTableProps)}</Text>
			))}
			</VStack>
			<VStack space={5} flex={1}>
			{ Object.keys(props).map((competencyName) => (
				<Progress flex={1} value={props[competencyName as keyof CompetenciesTableProps]} />
			))}
			</VStack>
		</HStack>
		
	</Card>
}

export default CompetenciesTable