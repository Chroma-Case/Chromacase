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
						<CloseCircle size="24" color={'#ED4A51'} />
					) : (
						<AddSquare size="24" color={'#6075F9'} />
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
					width: '100%',
					margin: 5,
					padding: isMobileView ? 8 : 16,
					gap: 10,
				}}
			>
				{!!artist && (
					<View
						style={{
							flexGrow: 0,
							flexShrink: 0,
							flexDirection: 'row',
							flexWrap: 'nowrap',
							maxWidth: '100%',
						}}
					>
						<ArtistChipComponent
							onPress={() => setArtist('')}
							name={artist}
							selected={true}
						/>
					</View>
				)}
				<View
					style={{
						flexGrow: 1,
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center',
					}}
				>
					<View style={{ flexGrow: 1 }}>
						<Input
							type="text"
							value={query}
							variant={'unstyled'}
							placeholder={translate('searchBarPlaceholder')}
							style={{ height: 30, flex: 1 }}
							onChangeText={(value) => setQuery(value)}
						/>
					</View>
					<ButtonBase type="menu" icon={SearchNormal1} onPress={handleValidate} />
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
										props.onValidate({
											artist: artist.id,
											genre:
												genresQuery.data?.find((a) => a.name === genre)
													?.id ?? undefined,
											query: query,
										});
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
							props.onValidate({
								artist:
									artistsQuery.data?.find((a) => a.name === artist)?.id ??
									undefined,
								genre:
									genresQuery.data?.find((g) => g.name === itemValue)?.id ??
									undefined,
								query: query,
							});
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
