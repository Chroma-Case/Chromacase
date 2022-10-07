import { useNavigation } from "@react-navigation/core";
import { HStack, VStack, Text, Progress, Pressable } from "native-base";
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
	const navigation = useNavigation();
	return <Pressable onPress={() => navigation.navigate('User')}>
	{({ isHovered,  isFocused }) => (
		<Card padding={5} bg={(isHovered || isFocused) ? 'coolGray.200' : undefined }>
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
	)}
	</Pressable>
}

export default CompetenciesTable