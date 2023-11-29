import { ScrollView, View } from 'react-native';
import { Text, useBreakpointValue } from 'native-base';
import React from 'react';
import { useQuery } from '../../Queries';
import SongCardInfo from '../../components/V2/SongCardInfo';
import API from '../../API';
import { RouteProps, useNavigation } from '../../Navigation';
import ScaffoldCC from '../../components/UI/ScaffoldCC';
import GoldenRatio from '../../components/V2/GoldenRatio';

// eslint-disable-next-line @typescript-eslint/ban-types
const HomeView = (props: RouteProps<{}>) => {
	const songsQuery = useQuery(API.getSongSuggestions(["artist"]));
	const navigation = useNavigation();
	const screenSize = useBreakpointValue({ base: 'small', md: 'big' });
	const isPhone = screenSize === 'small';

	return (
		<ScaffoldCC routeName={props.route.name}>
			<ScrollView>
				<View
					style={{
						width: '100%',
						display: 'flex',
						flexDirection: 'column',
						gap: 16,
					}}
				>
					<View
						style={{
							width: '100%',
							maxWidth: 1100,
							aspectRatio: isPhone ? 0.618 : 1.618,
						}}
					>
						<GoldenRatio />
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
							style={{
								fontSize: 24,
								fontWeight: 'bold',
								marginLeft: 16,
								marginBottom: 16,
								marginTop: 24,
							}}
						>
							{'Suggestions'}
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
							{songsQuery.data?.map((song) => (
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
		</ScaffoldCC>
	);
};

export default HomeView;
