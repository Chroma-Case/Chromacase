import React from 'react';
import { Button, Text, Select } from 'native-base';
import { ScrollView, View } from 'react-native';
import { Input } from 'native-base';
import ButtonBase from '../UI/ButtonBase';
import { AddSquare, CloseCircle, SearchNormal1 } from 'iconsax-react-native';
import { useQuery } from '../../Queries';
import API from '../../API';
import Genre from '../../models/Genre';
import { translate } from '../../i18n/i18n';

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

const SearchBarComponent = () => {
	const [query, setQuery] = React.useState('');
	const [genre, setGenre] = React.useState({} as Genre | undefined);
	const [artist, setArtist] = React.useState('');
	const artistsQuery = useQuery(API.getAllArtists());
	const genresQuery = useQuery(API.getAllGenres());

	return (
		<View>
			<View
				style={{
					borderBottomWidth: 1,
					borderBottomColor: '#9E9E9E',
					display: 'flex',
					flexDirection: 'row',
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
						flexShrink: 1,
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
						flexGrow: 1,
						flexShrink: 1,
					}}
				>
					<Input
						type="text"
						value={query}
						variant={'unstyled'}
						placeholder="What are you looking for ?"
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
				/>
			</View>
			<View
				style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
					gap: 10,
				}}
			>
				<ScrollView
					horizontal={true}
					style={{
						paddingBottom: 10,
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
						{artistsQuery.data?.map((artist, index) => (
							<ArtistChipComponent
								key={index}
								name={artist.name}
								onPress={() => {
									setArtist(artist.name);
								}}
							/>
						))}
					</View>
				</ScrollView>
				<View>
					<Select
						selectedValue={genre?.name}
						placeholder={translate('genreFilter')}
						accessibilityLabel="Genre"
						onValueChange={(itemValue) => {
							setGenre(
								genresQuery.data?.find((genre) => {
									genre.name == itemValue;
								})
							);
						}}
					>
						<Select.Item label={translate('emptySelection')} value=''/>
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
