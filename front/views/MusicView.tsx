import React from 'react';
import { Center, Text, useBreakpointValue, useTheme } from 'native-base';
import { useWindowDimensions } from 'react-native';
import {
	TabView,
	SceneMap,
	TabBar,
	NavigationState,
	Route,
	SceneRendererProps,
} from 'react-native-tab-view';
import { Heart, Clock, StatusUp, FolderCross } from 'iconsax-react-native';
import { Scene } from 'react-native-tab-view/lib/typescript/src/types';
import { RouteProps } from '../Navigation';
import { translate } from '../i18n/i18n';
import ScaffoldCC from '../components/UI/ScaffoldCC';
import MusicList from '../components/UI/MusicList';
import { useQueries, useQuery } from '../Queries';
import API from '../API';
import Song from '../models/Song';
import { LoadingView } from '../components/Loading';

// Fichier de données fictives, par exemple MusicData.ts
export const fakeMusicData = [
	{
		id: '1',
		image: 'https://placekitten.com/200/200',
		liked: true,
		onLike: () => console.log('Liked track 1'),
		onPlay: () => console.log('Play track 1'),
		level: 3,
		lastScore: 100000,
		bestScore: 200000,
		artist: 'Johann Sebastian Bach',
		song: 'Toccata and Fugue in D minor',
	},
	{
		id: '2',
		image: 'https://placekitten.com/200/201',
		liked: false,
		onLike: () => console.log('Liked track 2'),
		onPlay: () => console.log('Play track 2'),
		level: 2,
		lastScore: 150000,
		bestScore: 250000,
		artist: 'Wolfgang Amadeus Mozart',
		song: 'Eine kleine Nachtmusik',
	},
	{
		id: '3',
		image: 'https://placekitten.com/200/202',
		liked: true,
		onLike: () => console.log('Liked track 3'),
		onPlay: () => console.log('Play track 3'),
		level: 5,
		lastScore: 200000,
		bestScore: 300000,
		artist: 'Ludwig van Beethoven',
		song: 'Symphony No.5 in C Minor',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: true,
		onLike: () => console.log('Liked track 2'),
		onPlay: () => console.log('Play track 2'),
		level: 4,
		lastScore: -6041866,
		bestScore: 1792627,
		artist: 'Cassey Cavnor',
		song: 'Dirty Ho (Lan tou He)',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: true,
		onLike: () => console.log('Liked track 3'),
		onPlay: () => console.log('Play track 3'),
		level: 3,
		lastScore: -2372092,
		bestScore: -967983,
		artist: 'Addi Rieger',
		song: 'Company Men, The',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: false,
		onLike: () => console.log('Liked track 2'),
		onPlay: () => console.log('Play track 3'),
		level: 0,
		lastScore: -5935902,
		bestScore: -6940127,
		artist: 'Sarge Croom',
		song: 'Newsies',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: true,
		onLike: () => console.log('Liked track 3'),
		onPlay: () => console.log('Play track 2'),
		level: 5,
		lastScore: -3980235,
		bestScore: -7895014,
		artist: 'Brigg Welsby',
		song: 'Bobby',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: false,
		onLike: () => console.log('Liked track 1'),
		onPlay: () => console.log('Play track 1'),
		level: 3,
		lastScore: 1621097,
		bestScore: -6233674,
		artist: 'Tammy Frear',
		song: 'Footprints of a Spirit, The (Huellas de un espíritu)',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: true,
		onLike: () => console.log('Liked track 1'),
		onPlay: () => console.log('Play track 2'),
		level: 2,
		lastScore: -4299184,
		bestScore: -495720,
		artist: 'Davide Broschek',
		song: 'Simon Says',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: true,
		onLike: () => console.log('Liked track 2'),
		onPlay: () => console.log('Play track 2'),
		level: 1,
		lastScore: 767838,
		bestScore: -8154546,
		artist: 'Steffane Tooker',
		song: 'Deadfall',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: false,
		onLike: () => console.log('Liked track 1'),
		onPlay: () => console.log('Play track 3'),
		level: 1,
		lastScore: 4664756,
		bestScore: 370710,
		artist: 'Sisile Merriott',
		song: 'Crow, The: Wicked Prayer',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: true,
		onLike: () => console.log('Liked track 2'),
		onPlay: () => console.log('Play track 2'),
		level: 3,
		lastScore: 6121666,
		bestScore: -7111438,
		artist: "Sherri O'Griffin",
		song: 'Japanese Story',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: false,
		onLike: () => console.log('Liked track 1'),
		onPlay: () => console.log('Play track 1'),
		level: 2,
		lastScore: -1200469,
		bestScore: 7753495,
		artist: 'Libbi Feige',
		song: 'Climax, The',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: false,
		onLike: () => console.log('Liked track 3'),
		onPlay: () => console.log('Play track 1'),
		level: 5,
		lastScore: 1809908,
		bestScore: -2296480,
		artist: 'Merola Helliker',
		song: 'Lady Eve, The',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: true,
		onLike: () => console.log('Liked track 2'),
		onPlay: () => console.log('Play track 2'),
		level: 1,
		lastScore: -4816854,
		bestScore: -3423779,
		artist: 'Carmela Beacom',
		song: 'Jungle Book, The',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: true,
		onLike: () => console.log('Liked track 2'),
		onPlay: () => console.log('Play track 3'),
		level: 4,
		lastScore: -6011431,
		bestScore: -6967162,
		artist: 'Kelsi Simko',
		song: 'Mulholland Drive',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: false,
		onLike: () => console.log('Liked track 1'),
		onPlay: () => console.log('Play track 1'),
		level: 1,
		lastScore: -8223754,
		bestScore: -121676,
		artist: 'Xenia Meak',
		song: 'Gendarme Gets Married, The (Le gendarme se marie)',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: true,
		onLike: () => console.log('Liked track 2'),
		onPlay: () => console.log('Play track 1'),
		level: 4,
		lastScore: -1237859,
		bestScore: 5566342,
		artist: 'Rosalyn Markie',
		song: 'Beyond the Fear',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: false,
		onLike: () => console.log('Liked track 2'),
		onPlay: () => console.log('Play track 2'),
		level: 3,
		lastScore: -8627463,
		bestScore: 840132,
		artist: 'Regan Rewcassell',
		song: 'Eden',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: false,
		onLike: () => console.log('Liked track 2'),
		onPlay: () => console.log('Play track 2'),
		level: 2,
		lastScore: 2253750,
		bestScore: 7447445,
		artist: 'Fidela Lippi',
		song: '66 Scenes From America',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: true,
		onLike: () => console.log('Liked track 1'),
		onPlay: () => console.log('Play track 1'),
		level: 1,
		lastScore: -7525532,
		bestScore: 5961571,
		artist: 'Isac Leftley',
		song: 'Life of Emile Zola, The',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: true,
		onLike: () => console.log('Liked track 1'),
		onPlay: () => console.log('Play track 2'),
		level: 3,
		lastScore: -4681154,
		bestScore: 6039966,
		artist: 'Issi McKmurrie',
		song: 'Gremlins 2: The New Batch',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: false,
		onLike: () => console.log('Liked track 1'),
		onPlay: () => console.log('Play track 1'),
		level: 3,
		lastScore: -8736434,
		bestScore: 171899,
		artist: 'Mathian Iskowicz',
		song: 'Alive Inside',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: false,
		onLike: () => console.log('Liked track 2'),
		onPlay: () => console.log('Play track 1'),
		level: 3,
		lastScore: 5783443,
		bestScore: 4508317,
		artist: 'Garek Hadcock',
		song: 'Street Mobster (a.k.a. Modern Yakuza: Outlaw Killer) (Gendai yakuza: hito-kiri yota)',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: false,
		onLike: () => console.log('Liked track 1'),
		onPlay: () => console.log('Play track 1'),
		level: 4,
		lastScore: 4521728,
		bestScore: -1549426,
		artist: 'Spence Loveguard',
		song: 'Bastards, The (Los bastardos)',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: true,
		onLike: () => console.log('Liked track 3'),
		onPlay: () => console.log('Play track 2'),
		level: 5,
		lastScore: -1773795,
		bestScore: 8285865,
		artist: 'Shirley Espinola',
		song: 'Raise Your Voice',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: false,
		onLike: () => console.log('Liked track 2'),
		onPlay: () => console.log('Play track 1'),
		level: 1,
		lastScore: 7256121,
		bestScore: 5562922,
		artist: 'Mikael Yirrell',
		song: 'Nitro Circus: The Movie',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: true,
		onLike: () => console.log('Liked track 3'),
		onPlay: () => console.log('Play track 2'),
		level: 0,
		lastScore: 7528625,
		bestScore: 523891,
		artist: 'Giovanna Burchfield',
		song: 'Onion Field, The',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: false,
		onLike: () => console.log('Liked track 3'),
		onPlay: () => console.log('Play track 3'),
		level: 4,
		lastScore: 8610671,
		bestScore: -7816079,
		artist: 'Eugenius Leftbridge',
		song: 'Compulsion',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: false,
		onLike: () => console.log('Liked track 2'),
		onPlay: () => console.log('Play track 2'),
		level: 3,
		lastScore: 2886144,
		bestScore: 6020383,
		artist: 'Garvin Marcus',
		song: 'RocketMan (a.k.a. Rocket Man)',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: true,
		onLike: () => console.log('Liked track 1'),
		onPlay: () => console.log('Play track 2'),
		level: 1,
		lastScore: 3240248,
		bestScore: -4724599,
		artist: 'Nell Denzey',
		song: 'Chasing Amy',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: false,
		onLike: () => console.log('Liked track 3'),
		onPlay: () => console.log('Play track 1'),
		level: 3,
		lastScore: -5463629,
		bestScore: 4232635,
		artist: 'Blancha Oxterby',
		song: 'Savages, The',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: true,
		onLike: () => console.log('Liked track 2'),
		onPlay: () => console.log('Play track 2'),
		level: 4,
		lastScore: -4482142,
		bestScore: 8332541,
		artist: 'Rosetta Figgess',
		song: "Daffy Duck's Movie: Fantastic Island",
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: false,
		onLike: () => console.log('Liked track 2'),
		onPlay: () => console.log('Play track 1'),
		level: 1,
		lastScore: -683631,
		bestScore: 5027029,
		artist: 'Marys Scriver',
		song: 'Haunted Honeymoon',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: true,
		onLike: () => console.log('Liked track 2'),
		onPlay: () => console.log('Play track 1'),
		level: 4,
		lastScore: 7290002,
		bestScore: -7268634,
		artist: 'Adiana Swinfen',
		song: "Midsummer Night's Sex Comedy, A",
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: true,
		onLike: () => console.log('Liked track 2'),
		onPlay: () => console.log('Play track 2'),
		level: 3,
		lastScore: 8539120,
		bestScore: 2520490,
		artist: 'Lenci Tellesson',
		song: 'Quid Pro Quo',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: true,
		onLike: () => console.log('Liked track 1'),
		onPlay: () => console.log('Play track 3'),
		level: 1,
		lastScore: 2769849,
		bestScore: -3077625,
		artist: 'Marylee Sabben',
		song: 'Dancing Hawk, The (Tanczacy jastrzab)',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: true,
		onLike: () => console.log('Liked track 3'),
		onPlay: () => console.log('Play track 3'),
		level: 3,
		lastScore: 647609,
		bestScore: -6815,
		artist: 'Conney Ewart',
		song: 'Old Acquaintance',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: true,
		onLike: () => console.log('Liked track 2'),
		onPlay: () => console.log('Play track 2'),
		level: 5,
		lastScore: 722223,
		bestScore: 3398209,
		artist: 'Brendon Hearfield',
		song: 'Human Scale, The',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: false,
		onLike: () => console.log('Liked track 2'),
		onPlay: () => console.log('Play track 3'),
		level: 0,
		lastScore: 1029859,
		bestScore: 2277604,
		artist: 'Donovan Patifield',
		song: 'Return with Honor',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: true,
		onLike: () => console.log('Liked track 2'),
		onPlay: () => console.log('Play track 1'),
		level: 5,
		lastScore: -1361157,
		bestScore: 836139,
		artist: 'Laureen Yushankin',
		song: 'Manon of the Spring',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: true,
		onLike: () => console.log('Liked track 3'),
		onPlay: () => console.log('Play track 3'),
		level: 1,
		lastScore: 4509348,
		bestScore: 7566343,
		artist: 'Dot Cordobes',
		song: 'The Big Shave',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: false,
		onLike: () => console.log('Liked track 2'),
		onPlay: () => console.log('Play track 1'),
		level: 2,
		lastScore: -8836036,
		bestScore: 7757707,
		artist: 'Maddie Blackman',
		song: "When You're Strange",
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: true,
		onLike: () => console.log('Liked track 2'),
		onPlay: () => console.log('Play track 2'),
		level: 4,
		lastScore: -8045782,
		bestScore: -3214261,
		artist: 'Wiatt Durram',
		song: 'Death of a President',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: false,
		onLike: () => console.log('Liked track 2'),
		onPlay: () => console.log('Play track 2'),
		level: 2,
		lastScore: -4518414,
		bestScore: -2394538,
		artist: 'Karalee Snyder',
		song: 'China 9, Liberty 37 (Amore, piombo e furore)',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: false,
		onLike: () => console.log('Liked track 3'),
		onPlay: () => console.log('Play track 3'),
		level: 2,
		lastScore: 6371585,
		bestScore: -8197321,
		artist: 'Calida Elden',
		song: "Watch Out, We're Mad (...Altrimenti ci arrabbiamo!)",
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: false,
		onLike: () => console.log('Liked track 2'),
		onPlay: () => console.log('Play track 3'),
		level: 4,
		lastScore: 4665295,
		bestScore: 4323344,
		artist: 'Travis Yearron',
		song: 'Lassie Come Home',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: false,
		onLike: () => console.log('Liked track 1'),
		onPlay: () => console.log('Play track 2'),
		level: 0,
		lastScore: -2743930,
		bestScore: -2506969,
		artist: 'Claudie Batchelour',
		song: 'Wirey Spindell',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: true,
		onLike: () => console.log('Liked track 2'),
		onPlay: () => console.log('Play track 1'),
		level: 0,
		lastScore: 8157276,
		bestScore: -6396929,
		artist: 'Kenon Gerdes',
		song: 'I Am Michael',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: false,
		onLike: () => console.log('Liked track 1'),
		onPlay: () => console.log('Play track 3'),
		level: 0,
		lastScore: 8420043,
		bestScore: -90627,
		artist: 'Prudi Rankin',
		song: 'Emmanuelle',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: false,
		onLike: () => console.log('Liked track 2'),
		onPlay: () => console.log('Play track 2'),
		level: 3,
		lastScore: 459678,
		bestScore: -1323457,
		artist: 'Sylvester Sillito',
		song: 'GasLand',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: false,
		onLike: () => console.log('Liked track 2'),
		onPlay: () => console.log('Play track 1'),
		level: 5,
		lastScore: -3983927,
		bestScore: -8776721,
		artist: 'Ellene Novak',
		song: 'Mask',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: true,
		onLike: () => console.log('Liked track 2'),
		onPlay: () => console.log('Play track 1'),
		level: 1,
		lastScore: -3558603,
		bestScore: 5680103,
		artist: 'Craig Lupton',
		song: 'Copycat',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: true,
		onLike: () => console.log('Liked track 2'),
		onPlay: () => console.log('Play track 2'),
		level: 2,
		lastScore: 4235362,
		bestScore: 5238299,
		artist: 'Rancell Tremathack',
		song: 'Any Which Way You Can',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: false,
		onLike: () => console.log('Liked track 3'),
		onPlay: () => console.log('Play track 2'),
		level: 4,
		lastScore: -1377412,
		bestScore: 7148545,
		artist: 'Alyosha Deddum',
		song: 'Mumia Abu-Jamal: A Case for Reasonable Doubt?',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: true,
		onLike: () => console.log('Liked track 3'),
		onPlay: () => console.log('Play track 1'),
		level: 5,
		lastScore: -945041,
		bestScore: -1113097,
		artist: 'Jamison Zumbusch',
		song: 'Meet the Applegates',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: true,
		onLike: () => console.log('Liked track 3'),
		onPlay: () => console.log('Play track 2'),
		level: 2,
		lastScore: 5994306,
		bestScore: 2836966,
		artist: 'Samantha Dows',
		song: 'Chess Players, The (Shatranj Ke Khilari)',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: true,
		onLike: () => console.log('Liked track 1'),
		onPlay: () => console.log('Play track 2'),
		level: 0,
		lastScore: 719570,
		bestScore: 8677726,
		artist: 'Anthe Veart',
		song: 'The Tattooist',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: false,
		onLike: () => console.log('Liked track 1'),
		onPlay: () => console.log('Play track 3'),
		level: 0,
		lastScore: -8777884,
		bestScore: 1475585,
		artist: 'Carlo Levison',
		song: 'Balzac and the Little Chinese Seamstress (Xiao cai feng)',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: true,
		onLike: () => console.log('Liked track 2'),
		onPlay: () => console.log('Play track 1'),
		level: 3,
		lastScore: -1079544,
		bestScore: 2185825,
		artist: 'Erda Danilewicz',
		song: 'Dark Prince: The True Story of Dracula',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: true,
		onLike: () => console.log('Liked track 1'),
		onPlay: () => console.log('Play track 1'),
		level: 4,
		lastScore: -4053732,
		bestScore: -8159546,
		artist: 'Fidelio Maken',
		song: "Ditchdigger's Daughters, The",
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: true,
		onLike: () => console.log('Liked track 2'),
		onPlay: () => console.log('Play track 1'),
		level: 5,
		lastScore: 612834,
		bestScore: 6754339,
		artist: 'Dallas Hollebon',
		song: 'Thunderbolt (Pik lik feng)',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: false,
		onLike: () => console.log('Liked track 3'),
		onPlay: () => console.log('Play track 2'),
		level: 1,
		lastScore: 4928099,
		bestScore: 2211588,
		artist: 'Georg MacDermott',
		song: 'Then I Sentenced Them All to Death (Atunci i-am condamnat pe toti la moarte)',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: false,
		onLike: () => console.log('Liked track 1'),
		onPlay: () => console.log('Play track 2'),
		level: 5,
		lastScore: -3219354,
		bestScore: -3414767,
		artist: 'Terri Middlemist',
		song: 'Children of a Lesser God',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: true,
		onLike: () => console.log('Liked track 2'),
		onPlay: () => console.log('Play track 3'),
		level: 1,
		lastScore: 6968532,
		bestScore: 262053,
		artist: 'Cherin White',
		song: 'Out of Mind: The Stories of H.P. Lovecraft',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: true,
		onLike: () => console.log('Liked track 2'),
		onPlay: () => console.log('Play track 1'),
		level: 4,
		lastScore: -4346254,
		bestScore: 8249393,
		artist: 'Brandise Bradder',
		song: 'Wave, The (Welle, Die)',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: true,
		onLike: () => console.log('Liked track 2'),
		onPlay: () => console.log('Play track 1'),
		level: 2,
		lastScore: 3454077,
		bestScore: 5370105,
		artist: 'Dorry Hawick',
		song: 'Green Slime, The',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: true,
		onLike: () => console.log('Liked track 1'),
		onPlay: () => console.log('Play track 3'),
		level: 3,
		lastScore: -7848176,
		bestScore: 8346330,
		artist: 'Darwin Lynthal',
		song: 'Killers, The',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: true,
		onLike: () => console.log('Liked track 1'),
		onPlay: () => console.log('Play track 1'),
		level: 5,
		lastScore: -4389779,
		bestScore: -7612241,
		artist: 'Stanford Predohl',
		song: 'Evita',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: true,
		onLike: () => console.log('Liked track 3'),
		onPlay: () => console.log('Play track 2'),
		level: 0,
		lastScore: 5728505,
		bestScore: -1650662,
		artist: 'Leola Spykings',
		song: 'Airport 1975',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: false,
		onLike: () => console.log('Liked track 2'),
		onPlay: () => console.log('Play track 1'),
		level: 2,
		lastScore: -1029430,
		bestScore: -6090027,
		artist: 'Laurence Brownlie',
		song: 'Oyster Farmer',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: true,
		onLike: () => console.log('Liked track 2'),
		onPlay: () => console.log('Play track 1'),
		level: 5,
		lastScore: -4348919,
		bestScore: 4228044,
		artist: 'Wilbert Herkess',
		song: 'War and Peace (Jang Aur Aman)',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: false,
		onLike: () => console.log('Liked track 1'),
		onPlay: () => console.log('Play track 2'),
		level: 2,
		lastScore: 537257,
		bestScore: 1139697,
		artist: 'Briney Pochon',
		song: 'Mail Order Bride',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: false,
		onLike: () => console.log('Liked track 3'),
		onPlay: () => console.log('Play track 1'),
		level: 5,
		lastScore: 4545229,
		bestScore: 6500951,
		artist: 'Amabel von Grollmann',
		song: 'Page Miss Glory',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: false,
		onLike: () => console.log('Liked track 1'),
		onPlay: () => console.log('Play track 1'),
		level: 2,
		lastScore: 4882659,
		bestScore: 2907561,
		artist: 'Minne Stirtle',
		song: 'Crossing the Bridge',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: true,
		onLike: () => console.log('Liked track 1'),
		onPlay: () => console.log('Play track 3'),
		level: 0,
		lastScore: -6504654,
		bestScore: -3350072,
		artist: 'Forster Hallgalley',
		song: 'Mr. Bug Goes to Town (a.k.a. Hoppity Goes to Town)',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: true,
		onLike: () => console.log('Liked track 1'),
		onPlay: () => console.log('Play track 1'),
		level: 3,
		lastScore: -4904050,
		bestScore: 6249989,
		artist: 'Ashlin Druitt',
		song: 'Salvage',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: false,
		onLike: () => console.log('Liked track 1'),
		onPlay: () => console.log('Play track 1'),
		level: 2,
		lastScore: 8595971,
		bestScore: -910946,
		artist: 'Dee Whiteford',
		song: 'Christopher Strong',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: true,
		onLike: () => console.log('Liked track 2'),
		onPlay: () => console.log('Play track 2'),
		level: 2,
		lastScore: -4189479,
		bestScore: -6601395,
		artist: 'Elizabeth Bartali',
		song: 'Lara Croft Tomb Raider: The Cradle of Life',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: true,
		onLike: () => console.log('Liked track 1'),
		onPlay: () => console.log('Play track 2'),
		level: 3,
		lastScore: -2491521,
		bestScore: -4016927,
		artist: 'Vlad Gedge',
		song: 'Hairspray',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: true,
		onLike: () => console.log('Liked track 1'),
		onPlay: () => console.log('Play track 1'),
		level: 2,
		lastScore: 4290319,
		bestScore: -6000100,
		artist: 'Calli Lulham',
		song: 'Winds of the Wasteland',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: true,
		onLike: () => console.log('Liked track 2'),
		onPlay: () => console.log('Play track 1'),
		level: 1,
		lastScore: -8426202,
		bestScore: 8732106,
		artist: 'Ashly Sanders',
		song: 'Outside Providence',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: true,
		onLike: () => console.log('Liked track 1'),
		onPlay: () => console.log('Play track 1'),
		level: 1,
		lastScore: -2735365,
		bestScore: -5074941,
		artist: 'Lew Bate',
		song: 'Ethan Mao',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: true,
		onLike: () => console.log('Liked track 1'),
		onPlay: () => console.log('Play track 2'),
		level: 3,
		lastScore: 2226383,
		bestScore: -5940922,
		artist: 'Elie MacAnespie',
		song: 'Saving Private Ryan',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: false,
		onLike: () => console.log('Liked track 1'),
		onPlay: () => console.log('Play track 3'),
		level: 2,
		lastScore: -1785471,
		bestScore: 1882854,
		artist: 'Eberto Abdy',
		song: 'Scooby-Doo! Abracadabra-Doo',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: false,
		onLike: () => console.log('Liked track 3'),
		onPlay: () => console.log('Play track 3'),
		level: 4,
		lastScore: 8210072,
		bestScore: 7416746,
		artist: 'Roxie Bouzek',
		song: 'Private Parts',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: true,
		onLike: () => console.log('Liked track 3'),
		onPlay: () => console.log('Play track 2'),
		level: 1,
		lastScore: -757068,
		bestScore: -2086735,
		artist: 'Nestor Tuckwell',
		song: 'Pusher II: With Blood on My Hands',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: true,
		onLike: () => console.log('Liked track 3'),
		onPlay: () => console.log('Play track 2'),
		level: 4,
		lastScore: 7667818,
		bestScore: -4544823,
		artist: 'Ingemar Castiblanco',
		song: 'Rocky IV',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: true,
		onLike: () => console.log('Liked track 2'),
		onPlay: () => console.log('Play track 2'),
		level: 2,
		lastScore: -7948742,
		bestScore: -7564800,
		artist: 'Eddy Saines',
		song: 'Babe',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: true,
		onLike: () => console.log('Liked track 3'),
		onPlay: () => console.log('Play track 2'),
		level: 3,
		lastScore: -6119057,
		bestScore: 3464164,
		artist: 'Gav Jakubovski',
		song: '42nd Street',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: false,
		onLike: () => console.log('Liked track 1'),
		onPlay: () => console.log('Play track 3'),
		level: 1,
		lastScore: 8453682,
		bestScore: -4429348,
		artist: 'Pavia Libri',
		song: 'Fat Man and Little Boy',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: false,
		onLike: () => console.log('Liked track 1'),
		onPlay: () => console.log('Play track 3'),
		level: 1,
		lastScore: 7781547,
		bestScore: -6619210,
		artist: 'Dar Stait',
		song: 'Pretty Maids All in a Row',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: false,
		onLike: () => console.log('Liked track 3'),
		onPlay: () => console.log('Play track 2'),
		level: 5,
		lastScore: -362262,
		bestScore: -457249,
		artist: 'Annabella Pavek',
		song: 'Are You Here',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: true,
		onLike: () => console.log('Liked track 2'),
		onPlay: () => console.log('Play track 3'),
		level: 2,
		lastScore: -6314972,
		bestScore: 2860891,
		artist: 'Hillier Richardson',
		song: 'Cry, The (Grido, Il)',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: false,
		onLike: () => console.log('Liked track 1'),
		onPlay: () => console.log('Play track 1'),
		level: 4,
		lastScore: 561681,
		bestScore: 395500,
		artist: 'Doe Wyche',
		song: 'Loved Ones, The',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: true,
		onLike: () => console.log('Liked track 2'),
		onPlay: () => console.log('Play track 1'),
		level: 4,
		lastScore: 4655690,
		bestScore: -3864620,
		artist: 'Ronnica Kirkness',
		song: 'Libeled Lady',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: true,
		onLike: () => console.log('Liked track 2'),
		onPlay: () => console.log('Play track 1'),
		level: 2,
		lastScore: -3237102,
		bestScore: 7279015,
		artist: 'Ennis Kalkofer',
		song: 'Elf',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: true,
		onLike: () => console.log('Liked track 2'),
		onPlay: () => console.log('Play track 3'),
		level: 5,
		lastScore: -4883463,
		bestScore: 3856202,
		artist: 'Margaret McNamee',
		song: 'Direct Action',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: true,
		onLike: () => console.log('Liked track 2'),
		onPlay: () => console.log('Play track 3'),
		level: 2,
		lastScore: 7130068,
		bestScore: -7335491,
		artist: 'Burg Stubbs',
		song: 'Game Over',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: false,
		onLike: () => console.log('Liked track 3'),
		onPlay: () => console.log('Play track 1'),
		level: 0,
		lastScore: -5413799,
		bestScore: 1522901,
		artist: 'Guido Bearsmore',
		song: 'Apple Dumpling Gang, The',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: false,
		onLike: () => console.log('Liked track 2'),
		onPlay: () => console.log('Play track 3'),
		level: 4,
		lastScore: -75885,
		bestScore: 4456222,
		artist: 'Lemmie Belhomme',
		song: 'Guy Named Joe, A',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: false,
		onLike: () => console.log('Liked track 2'),
		onPlay: () => console.log('Play track 3'),
		level: 5,
		lastScore: 7982212,
		bestScore: -5700652,
		artist: 'Mable Feitosa',
		song: 'Who Are you Polly Maggoo (Qui êtes-vous, Polly Maggoo?)',
	},
	{
		image: 'https://static.vecteezy.com/system/resources/previews/016/552/335/non_2x/luffy-kawai-chibi-cute-onepiece-anime-design-and-doodle-art-for-icon-logo-collection-and-others-free-vector.jpg',
		liked: true,
		onLike: () => console.log('Liked track 3'),
		onPlay: () => console.log('Play track 1'),
		level: 3,
		lastScore: 633755,
		bestScore: 1462680,
		artist: 'Amalle Lillo',
		song: 'Your Friends and Neighbors',
	},
];

export const FavoritesMusic = () => {
	const playHistoryQuery = useQuery(API.getUserPlayHistory);
	const nextStepQuery = useQuery(API.getSongSuggestions);
	const songHistory = useQueries(
		playHistoryQuery.data?.map(({ songID }) => API.getSong(songID)) ?? []
	);
	const artistsQueries = useQueries(
		songHistory
			.map((entry) => entry.data)
			.concat(nextStepQuery.data ?? [])
			.filter((s): s is Song => s !== undefined)
			.map((song) => API.getArtist(song.artistId))
	);

	const isLoading =
		playHistoryQuery.isLoading ||
		nextStepQuery.isLoading ||
		songHistory.some((query) => query.isLoading) ||
		artistsQueries.some((query) => query.isLoading);

	const musics =
		nextStepQuery.data
			?.filter((song) =>
				artistsQueries.find((artistQuery) => artistQuery.data?.id === song.artistId)
			)
			.map((song) => ({
				artist: artistsQueries.find(
					(artistQuery) => artistQuery.data?.id === song.artistId
				)!.data!.name,
				song: song.name,
				image: song.cover,
				level: 42,
				lastScore: 42,
				bestScore: 42,
				liked: false,
				onLike: () => {
					console.log('onLike');
				},
				onPlay: () => {
					console.log('onPlay');
				},
			})) ?? [];

	if (isLoading) {
		return <LoadingView />;
	}
	return (
		<MusicList
			initialMusics={musics}
			// musicsPerPage={7}
		/>
	);
};

export const RecentlyPlayedMusic = () => {
	return (
		<Center style={{ flex: 1 }}>
			<Text>RecentlyPlayedMusic</Text>
		</Center>
	);
};

export const StepUpMusic = () => {
	return (
		<Center style={{ flex: 1 }}>
			<Text>StepUpMusic</Text>
		</Center>
	);
};

const renderScene = SceneMap({
	favorites: FavoritesMusic,
	recentlyPlayed: RecentlyPlayedMusic,
	stepUp: StepUpMusic,
});

const getTabData = (key: string) => {
	switch (key) {
		case 'favorites':
			return { index: 0, icon: Heart };
		case 'recentlyPlayed':
			return { index: 1, icon: Clock };
		case 'stepUp':
			return { index: 2, icon: StatusUp };
		default:
			return { index: 3, icon: FolderCross };
	}
};

const MusicTab = (props: RouteProps<object>) => {
	const layout = useWindowDimensions();
	const [index, setIndex] = React.useState(0);
	const { colors } = useTheme();
	const screenSize = useBreakpointValue({ base: 'small', md: 'big' });
	const isSmallScreen = screenSize === 'small';
	const [routes] = React.useState<Route[]>([
		{ key: 'favorites', title: 'musicTabFavorites' },
		{ key: 'recentlyPlayed', title: 'musicTabRecentlyPlayed' },
		{ key: 'stepUp', title: 'musicTabStepUp' },
	]);
	const renderTabBar = (
		props: SceneRendererProps & { navigationState: NavigationState<Route> }
	) => (
		<TabBar
			{...props}
			style={{
				backgroundColor: 'transparent',
				borderBottomWidth: 1,
				borderColor: colors.primary[300],
			}}
			activeColor={colors.text[900]}
			inactiveColor={colors.text[700]}
			indicatorStyle={{ backgroundColor: colors.primary[300] }}
			renderIcon={(
				scene: Scene<Route> & {
					focused: boolean;
					color: string;
				}
			) => {
				const tabHeader = getTabData(scene.route!.key);
				return (
					<tabHeader.icon
						size="18"
						color="#6075F9"
						variant={scene.focused ? 'Bold' : 'Outline'}
					/>
				);
			}}
			renderLabel={({ route, color }) =>
				layout.width > 800 && (
					<Text style={{ color: color, paddingLeft: 10, overflow: 'hidden' }}>
						{translate(
							route.title as
								| 'musicTabFavorites'
								| 'musicTabRecentlyPlayed'
								| 'musicTabStepUp'
						)}
					</Text>
				)
			}
			tabStyle={{ flexDirection: 'row' }}
		/>
	);

	return (
		<ScaffoldCC routeName={props.route.name} withPadding={false}>
			<TabView
				sceneContainerStyle={{
					flex: 1,
					alignSelf: 'center',
					padding: isSmallScreen ? 8 : 20,
					paddingTop: 32,
					width: '100%',
				}}
				renderTabBar={renderTabBar}
				navigationState={{ index, routes }}
				renderScene={renderScene}
				onIndexChange={setIndex}
				initialLayout={{ width: layout.width }}
			/>
		</ScaffoldCC>
	);
};

export default MusicTab;
