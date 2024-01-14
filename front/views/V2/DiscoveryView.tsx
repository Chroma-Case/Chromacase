import { ScrollView, View } from 'react-native';
import { Text, useBreakpointValue } from 'native-base';
import React from 'react';
import { useQuery } from '../../Queries';
import SongCardInfo from '../../components/V2/SongCardInfo';
import API from '../../API';
import { useNavigation } from '../../Navigation';
import GoldenRatio from '../../components/V2/GoldenRatio';
import { translate } from '../../i18n/i18n';

const HomeView = () => {
	const suggestionsQuery = useQuery(
		API.getSongSuggestions(['artist', 'likedByUsers', 'SongHistory'])
	);
	const navigation = useNavigation();
	const screenSize = useBreakpointValue({ base: 'small', md: 'big' });
	const isPhone = screenSize === 'small';
	const topSuggestions = suggestionsQuery.data?.slice(0, 4) ?? [];
	const suggestions = suggestionsQuery.data?.slice(4) ?? [];
	return (
		<ScrollView>
			<View
				style={{
					width: '100%',
					display: 'flex',
					flexDirection: 'column',
					gap: 16,
					padding: 8,
				}}
			>
				<View
					style={{
						width: '100%',
						maxWidth: 1100,
						aspectRatio: isPhone ? 0.618 : 1.618,
					}}
				>
					<GoldenRatio songs={topSuggestions} />
				</View>
				<View
					style={{
						width: '100%',
						flexDirection: 'column',
						justifyContent: 'flex-start',
						alignItems: 'stretch',
						gap: 16,
					}}
				>
					<Text
						fontSize={24}
						fontWeight={'bold'}
						style={{
							marginLeft: 16,
							marginBottom: 16,
							marginTop: 24,
						}}
					>
						{translate('discoverySuggestionSectionTitle')}
					</Text>
					<View
						style={{
							flexDirection: 'row',
							flexWrap: 'wrap',
							justifyContent: isPhone ? 'center' : 'flex-start',
							alignItems: 'flex-start',
							gap: 16,
						}}
					>
						{suggestions.map((song) => (
							<SongCardInfo
								key={song.id}
								song={song}
								onPress={() => {
									navigation.navigate('Play', { songId: song.id });
								}}
								onPlay={() => {
									console.log('play');
								}}
							/>
						))}
					</View>
				</View>
			</View>
		</ScrollView>
	);
};

export default HomeView;
