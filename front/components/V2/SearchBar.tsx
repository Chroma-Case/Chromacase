import React from 'react';
import { Button, Text, Select, useBreakpointValue } from 'native-base';
import { ScrollView, View } from 'react-native';
import { Input } from 'native-base';
import ButtonBase from '../UI/ButtonBase';
import { AddSquare, CloseCircle, SearchNormal1 } from 'iconsax-react-native';
import { useQuery } from '../../Queries';
import API from '../../API';
import { translate } from '../../i18n/i18n';
import { searchProps } from '../../views/V2/SearchView';

type ArtistChipProps = {
	name: string;
	selected?: boolean;
	onPress: () => void;
};

const ArtistChipComponent = (props: ArtistChipProps) => {
	return (
		<View>
			<Button variant={'ghost'} onPress={props.onPress}>
				<View
					style={{
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'center',
						gap: 10,
					}}
				>
					{props.selected ? (
						<CloseCircle size="32" color={'#ED4A51'} />
					) : (
						<AddSquare size="32" color={'#6075F9'} />
					)}
					<Text>{props.name}</Text>
				</View>
			</Button>
		</View>
	);
};

const SearchBarComponent = (props: { onValidate: (searchData: searchProps) => void }) => {
	const [query, setQuery] = React.useState('');
	const [genre, setGenre] = React.useState('');
	const [artist, setArtist] = React.useState('');
	const artistsQuery = useQuery(API.getAllArtists());
	const genresQuery = useQuery(API.getAllGenres());
	const screenSize = useBreakpointValue({ base: 'small', md: 'big' });
	const isMobileView = screenSize == 'small';

	const handleValidate = () => {
		const searchData = {
			query: query,
			artist: artistsQuery.data?.find((a) => a.name === artist)?.id ?? undefined,
			genre: genresQuery.data?.find((g) => g.name === genre)?.id ?? undefined,
		};
		props.onValidate(searchData);
	};

	return (
		<View>
			<View
				style={{
					borderBottomWidth: 1,
					borderBottomColor: '#9E9E9E',
					display: 'flex',
					flexDirection: isMobileView ? 'column' : 'row',
					alignItems: 'center',
					width: '100%',
					margin: 5,
					padding: 16,
					gap: 10,
				}}
			>
				<View
					style={{
						flexGrow: 0,
						flexShrink: 0,
						flexDirection: 'row',
						flexWrap: 'wrap',
					}}
				>
					{artist && (
						<ArtistChipComponent
							onPress={() => setArtist('')}
							name={artist}
							selected={true}
						/>
					)}
				</View>
				<View
					style={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
						flexGrow: 1,
						width: '100%',
					}}
				>
					<View
						style={{
							flexGrow: 1,
							flexShrink: 1,
						}}
					>
						<Input
							type="text"
							value={query}
							variant={'unstyled'}
							placeholder={translate('searchBarPlaceholder')}
							style={{ width: '100%', height: 30 }}
							onChangeText={(value) => setQuery(value)}
						/>
					</View>
					<ButtonBase
						type="menu"
						icon={SearchNormal1}
						style={{
							flexShrink: 0,
							flexGrow: 0,
						}}
						onPress={handleValidate}
					/>
				</View>
			</View>
			<View
				style={{
					display: 'flex',
					flexDirection: 'row',
					flexWrap: 'wrap',
					justifyContent: 'space-between',
					alignItems: 'center',
					gap: 10,
				}}
			>
				<ScrollView
					horizontal={true}
					style={{
						paddingBottom: 10,
						maxWidth: 1200,
					}}
				>
					<View
						style={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							gap: 10,
						}}
					>
						{!artist &&
							artistsQuery.data?.map((artist, index) => (
								<ArtistChipComponent
									key={index}
									name={artist.name}
									onPress={() => {
										props.onValidate({artist: artist.id, genre: genresQuery.data?.find((g) => g.name === genre)?.id ?? undefined, query: query})
										setArtist(artist.name);
									}}
								/>
							))}
					</View>
				</ScrollView>
				<View>
					<Select
						selectedValue={genre}
						placeholder={translate('genreFilter')}
						accessibilityLabel="Genre"
						onValueChange={(itemValue) => {
							setGenre(itemValue);
						}}
					>
						<Select.Item label={translate('emptySelection')} value="" />
						{genresQuery.data?.map((data, index) => (
							<Select.Item key={index} label={data.name} value={data.name} />
						))}
					</Select>
				</View>
			</View>
		</View>
	);
};

export default SearchBarComponent;
