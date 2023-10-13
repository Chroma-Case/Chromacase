import Artist, { ArtistHandler } from './models/Artist';
import Album from './models/Album';
import Chapter from './models/Chapter';
import Lesson from './models/Lesson';
import Genre, { GenreHandler } from './models/Genre';
import LessonHistory from './models/LessonHistory';
import likedSong, { LikedSongHandler } from './models/LikedSong';
import Song, { SongHandler } from './models/Song';
import { SongHistoryHandler, SongHistoryItem, SongHistoryItemHandler } from './models/SongHistory';
import User, { UserHandler } from './models/User';
import store from './state/Store';
import { Platform } from 'react-native';
import { en } from './i18n/Translations';
import UserSettings, { UserSettingsHandler } from './models/UserSettings';
import { PartialDeep, RequireExactlyOne } from 'type-fest';
import SearchHistory, { SearchHistoryHandler } from './models/SearchHistory';
import { Query } from './Queries';
import CompetenciesTable from './components/CompetenciesTable';
import ResponseHandler from './models/ResponseHandler';
import { PlageHandler } from './models/Plage';
import { ListHandler } from './models/List';
import { AccessTokenResponseHandler } from './models/AccessTokenResponse';
import * as yup from 'yup';
import { base64ToBlob } from './utils/base64ToBlob';
import { ImagePickerAsset } from 'expo-image-picker';
import { SongCursorInfos, SongCursorInfosHandler } from './models/SongCursorInfos';

type AuthenticationInput = { username: string; password: string };
type RegistrationInput = AuthenticationInput & { email: string };

export type AccessToken = string;

type FetchParams = {
	route: string;
	body?: object;
	formData?: FormData;
	method?: 'GET' | 'POST' | 'DELETE' | 'PATCH' | 'PUT';
};

type HandleParams<APIType = unknown, ModelType = APIType> = RequireExactlyOne<{
	raw: true;
	emptyResponse: true;
	handler: ResponseHandler<APIType, ModelType>;
}>;

// This Exception is intended to cover all business logic errors (invalid credentials, couldn't find a song, etc.)
// technical errors (network, server, etc.) should be handled as standard Error exceptions
// it helps to filter errors in the catch block, APIErrors messages should
// be safe to use in combination with the i18n library
export class APIError extends Error {
	constructor(
		message: string,
		public status: number,
		// Set the message to the correct error this is a placeholder
		// when the error is only used internally (middleman)
		public userMessage: keyof typeof en = 'unknownError'
	) {
		super(message);
	}
}

export class ValidationError extends Error {
	constructor(message: string) {
		super(message);
	}
}

export default class API {
	public static readonly baseUrl =
		Platform.OS === 'web' ? '/api' : process.env.EXPO_PUBLIC_API_URL!;
	public static async fetch(
		params: FetchParams,
		handle: Pick<Required<HandleParams>, 'raw'>
	): Promise<ArrayBuffer>;
	public static async fetch(
		params: FetchParams,
		handle: Pick<Required<HandleParams>, 'emptyResponse'>
	): Promise<void>;
	public static async fetch<A, R>(
		params: FetchParams,
		handle: Pick<Required<HandleParams<A, R>>, 'handler'>
	): Promise<R>;
	public static async fetch(params: FetchParams): Promise<void>;
	public static async fetch(params: FetchParams, handle?: HandleParams) {
		const jwtToken = store.getState().user.accessToken;
		const headers = {
			...(params.formData == undefined && { 'Content-Type': 'application/json' }),
			...(jwtToken && { Authorization: `Bearer ${jwtToken}` }),
		};
		const response = await fetch(`${API.baseUrl}${params.route}`, {
			headers: headers,
			body: params.formData ?? JSON.stringify(params.body),
			method: params.method ?? 'GET',
		}).catch(() => {
			throw new Error('Error while fetching API: ' + API.baseUrl);
		});
		if (!handle || handle.emptyResponse) {
			if (!response.ok) {
				let responseMessage = response.statusText;
				try {
					const responseData = await response.json();
					console.log(responseData);
					if (responseData.message) responseMessage = responseData.message;
				} catch (e) {
					console.log(e);
					throw new APIError(response.statusText, response.status, 'unknownError');
				}
				throw new APIError(responseMessage, response.status, 'unknownError');
			}
			return;
		}
		if (handle.raw) {
			return response.arrayBuffer();
		}
		const handler = handle.handler;
		const body = await response.text();
		try {
			const jsonResponse = JSON.parse(body);
			if (!response.ok) {
				throw new APIError(response.statusText ?? body, response.status, 'unknownError');
			}
			const validated = await handler.validator.validate(jsonResponse).catch((e) => {
				if (e instanceof yup.ValidationError) {
					console.error(e, 'Got: ' + body);
					throw new ValidationError(e.message);
				}
				throw e;
			});
			return handler.transformer(handler.validator.cast(validated));
		} catch (e) {
			if (e instanceof SyntaxError) throw new Error("Error while parsing Server's response");
			console.error(e);
			throw e;
		}
	}

	public static async authenticate(
		authenticationInput: AuthenticationInput
	): Promise<AccessToken> {
		return API.fetch(
			{
				route: '/auth/login',
				body: authenticationInput,
				method: 'POST',
			},
			{ handler: AccessTokenResponseHandler }
		)
			.then((responseBody) => responseBody.access_token)
			.catch((e) => {
				/// If validation fails, it means that auth failed.
				/// We want that 401 error to be thrown, instead of the plain validation vone
				if (e.status == 401)
					throw new APIError('invalidCredentials', 401, 'invalidCredentials');
				if (!(e instanceof APIError)) throw e;
				throw e;
			});
	}
	/**
	 * Create a new user profile, with an email and a password
	 * @param registrationInput the credentials to create a new profile
	 * @returns A Promise. On success, will be resolved into an instance of the API wrapper
	 */
	public static async createAccount(registrationInput: RegistrationInput): Promise<AccessToken> {
		await API.fetch({
			route: '/auth/register',
			body: registrationInput,
			method: 'POST',
		});
		// In the Future we should move autheticate out of this function
		// and maybe create a new function to create and login in one go
		return API.authenticate({
			username: registrationInput.username,
			password: registrationInput.password,
		});
	}

	public static async createAndGetGuestAccount(): Promise<AccessToken> {
		return API.fetch(
			{
				route: '/auth/guest',
				method: 'POST',
				body: undefined,
			},
			{ handler: AccessTokenResponseHandler }
		)
			.then(({ access_token }) => access_token)
			.catch((e) => {
				if (e.status == 401)
					throw new APIError('invalidCredentials', 401, 'invalidCredentials');
				if (!(e instanceof APIError)) throw e;
				throw e;
			});
	}

	public static async transformGuestToUser(registrationInput: RegistrationInput): Promise<void> {
		await API.fetch({
			route: '/auth/me',
			body: registrationInput,
			method: 'PUT',
		});
	}

	/***
	 * Retrieve information of the currently authentified user
	 */
	public static getUserInfo(): Query<User> {
		return {
			key: 'user',
			exec: async () =>
				API.fetch(
					{
						route: '/auth/me',
					},
					{ handler: UserHandler }
				),
		};
	}

	public static getUserSettings(): Query<UserSettings> {
		return {
			key: 'settings',
			exec: () =>
				API.fetch(
					{
						route: '/auth/me/settings',
					},
					{
						handler: UserSettingsHandler,
					}
				),
		};
	}

	public static async updateUserSettings(settings: PartialDeep<UserSettings>): Promise<void> {
		const dto = {
			pushNotification: settings.notifications?.pushNotif,
			emailNotification: settings.notifications?.emailNotif,
			trainingNotification: settings.notifications?.trainNotif,
			newSongNotification: settings.notifications?.newSongNotif,
			recommendations: settings.recommendations,
			weeklyReport: settings.weeklyReport,
			leaderBoard: settings.leaderBoard,
			showActivity: settings.showActivity,
		};
		return API.fetch({
			method: 'PATCH',
			route: '/auth/me/settings',
			body: dto,
		});
	}

	public static getUserSkills(): Query<Parameters<typeof CompetenciesTable>[0]> {
		return {
			key: 'skills',
			exec: async () => ({
				pedalsCompetency: Math.random() * 100,
				rightHandCompetency: Math.random() * 100,
				leftHandCompetency: Math.random() * 100,
				accuracyCompetency: Math.random() * 100,
				arpegeCompetency: Math.random() * 100,
				chordsCompetency: Math.random() * 100,
			}),
		};
	}

	public static getAllSongs(): Query<Song[]> {
		return {
			key: 'songs',
			exec: () =>
				API.fetch(
					{
						route: '/song',
					},
					{
						handler: PlageHandler(SongHandler),
					}
				).then(({ data }) => data),
		};
	}

	/**
	 * Retrieve a song
	 * @param songId the id to find the song
	 */
	public static getSong(songId: number): Query<Song> {
		return {
			key: ['song', songId],
			exec: async () =>
				API.fetch(
					{
						route: `/song/${songId}`,
					},
					{ handler: SongHandler }
				),
		};
	}

	/**
	 * @description retrieves songs from a specific artist
	 * @param artistId is the id of the artist that composed the songs aimed
	 * @returns a Promise of Songs type array
	 */
	public static getSongsByArtist(artistId: number): Query<Song[]> {
		return {
			key: ['artist', artistId, 'songs'],
			exec: () =>
				API.fetch(
					{
						route: `/song?artistId=${artistId}`,
					},
					{ handler: PlageHandler(SongHandler) }
				).then(({ data }) => data),
		};
	}

	/**
	 *  Retrieves all songs corresponding to the given genre ID
	 * @param genreId the id of the genre we're aiming
	 * @returns a promise of an array of Songs
	 */
	public static getSongsByGenre(genreId: number): Query<Song[]> {
		return {
			key: ['genre', genreId, 'songs'],
			exec: () =>
				API.fetch(
					{
						route: `/song?genreId=${genreId}`,
					},
					{ handler: PlageHandler(SongHandler) }
				).then(({ data }) => data),
		};
	}

	/**
	 * Retrive a song's midi partition
	 * @param songId the id to find the song
	 */
	public static getSongMidi(songId: number): Query<ArrayBuffer> {
		return {
			key: ['midi', songId],
			exec: () =>
				API.fetch(
					{
						route: `/song/${songId}/midi`,
					},
					{
						raw: true,
					}
				),
		};
	}

	/**
	 * Retrive a song's midi partition
	 * @param songId the id to find the song
	 */
	public static getArtistIllustration(artistId: number): string {
		return `${API.baseUrl}/artist/${artistId}/illustration`;
	}

	/**
	 * Retrive a song's midi partition
	 * @param songId the id to find the song
	 */
	public static getGenreIllustration(genreId: number): string {
		return `${API.baseUrl}/genre/${genreId}/illustration`;
	}

	/**
	 * Retrieves a genre
	 * @param genreId the id of the aimed genre
	 */
	public static getGenre(genreId: number): Query<Genre> {
		return {
			key: ['genre', genreId],
			exec: () =>
				API.fetch(
					{
						route: `/genre/${genreId}`,
					},
					{ handler: GenreHandler }
				),
		};
	}

	/**
	 * Retrive a song's musicXML partition
	 * @param songId the id to find the song
	 */
	public static getSongMusicXML(songId: number): Query<ArrayBuffer> {
		return {
			key: ['musixml', songId],
			exec: () =>
				API.fetch(
					{
						route: `/song/${songId}/musicXml`,
					},
					{ raw: true }
				),
		};
	}

	/**
	 * Retrive an artist
	 */
	public static getArtist(artistId: number): Query<Artist> {
		return {
			key: ['artist', artistId],
			exec: () =>
				API.fetch(
					{
						route: `/artist/${artistId}`,
					},
					{ handler: ArtistHandler }
				),
		};
	}

	/**
	 * Retrive a song's chapters
	 * @param songId the id to find the song
	 */
	public static getSongChapters(songId: number): Query<Chapter[]> {
		return {
			key: ['chapters', songId],
			exec: async () =>
				[1, 2, 3, 4, 5].map((value) => ({
					start: 100 * (value - 1),
					end: 100 * value,
					songId: songId,
					name: `Chapter ${value}`,
					type: 'chorus',
					key_aspect: 'rhythm',
					difficulty: value,
					id: value * 10,
				})),
		};
	}

	/**
	 * Retrieve a song's play history
	 * @param songId the id to find the song
	 */
	public static getSongHistory(songId: number) {
		return {
			key: ['song', 'history', songId],
			exec: () =>
				API.fetch(
					{
						route: `/song/${songId}/history`,
					},
					{ handler: SongHistoryHandler }
				),
		};
	}

	/**
	 * Search a song by its name
	 * @param query the string used to find the songs
	 */
	public static searchSongs(query: string): Query<Song[]> {
		return {
			key: ['search', 'song', query],
			exec: () =>
				API.fetch(
					{
						route: `/search/songs/${query}`,
					},
					{ handler: ListHandler(SongHandler) }
				),
		};
	}

	/**
	 * Search artists by name
	 * @param query the string used to find the artists
	 */
	public static searchArtists(query: string): Query<Artist[]> {
		return {
			key: ['search', 'artist', query],
			exec: () =>
				API.fetch(
					{
						route: `/search/artists/${query}`,
					},
					{ handler: ListHandler(ArtistHandler) }
				),
		};
	}

	/**
	 * Search Album by name
	 * @param query the string used to find the album
	 */
	public static searchAlbum(query: string): Query<Album[]> {
		return {
			key: ['search', 'album', query],
			exec: async () => [
				{
					id: 1,
					name: 'Super Trooper',
				},
				{
					id: 2,
					name: 'Kingdom Heart 365/2 OST',
				},
				{
					id: 3,
					name: 'The Legend Of Zelda Ocarina Of Time OST',
				},
				{
					id: 4,
					name: 'Random Access Memories',
				},
			],
		};
	}

	/**
	 * Retrieve music genres
	 */
	public static searchGenres(query: string): Query<Genre[]> {
		return {
			key: ['search', 'genre', query],
			exec: () =>
				API.fetch(
					{
						route: `/search/genres/${query}`,
					},
					{ handler: ListHandler(GenreHandler) }
				),
		};
	}

	/**
	 * Retrieve a lesson
	 * @param lessonId the id to find the lesson
	 */
	public static getLesson(lessonId: number): Query<Lesson> {
		return {
			key: ['lesson', lessonId],
			exec: async () => ({
				name: 'Song',
				description: 'A song',
				requiredLevel: 1,
				mainSkill: 'lead-head-change',
				id: lessonId,
			}),
		};
	}

	/**
	 * Retrieve the authenticated user's search history
	 * @param skip number of entries skipped before returning
	 * @param take how much do we take to return
	 * @returns Returns an array of history entries (temporary type any)
	 */
	public static getSearchHistory(skip?: number, take?: number): Query<SearchHistory[]> {
		return {
			key: ['search', 'history', 'skip', skip, 'take', take],
			exec: () =>
				API.fetch(
					{
						route: `/history/search?skip=${skip ?? 0}&take=${take ?? 5}`,
						method: 'GET',
					},
					{ handler: ListHandler(SearchHistoryHandler) }
				),
		};
	}

	/**
	 * Posts a new entry in the user's search history
	 * @param query is the query itself
	 * @param type the type of object searched
	 * @param timestamp the date it's been issued
	 * @returns nothing
	 */
	public static async createSearchHistoryEntry(query: string, type: string): Promise<void> {
		return await API.fetch({
			route: `/history/search`,
			method: 'POST',
			body: {
				query: query,
				type: type,
			},
		});
	}

	/**
	 * Retrieve the authenticated user's recommendations
	 * @returns an array of songs
	 */
	public static getSongSuggestions(): Query<Song[]> {
		return API.getAllSongs();
	}

	/**
	 * Retrieve the authenticated user's play history
	 * * @returns an array of songs
	 */
	public static getUserPlayHistory(): Query<SongHistoryItem[]> {
		return {
			key: ['history'],
			exec: () =>
				API.fetch(
					{
						route: '/history',
					},
					{ handler: ListHandler(SongHistoryItemHandler) }
				),
		};
	}

	/**
	 * Retrieve a lesson's history
	 * @param lessonId the id to find the lesson
	 */
	public static getLessonHistory(lessonId: number): Query<LessonHistory[]> {
		return {
			key: ['lesson', 'history', lessonId],
			exec: async () => [
				{
					lessonId,
					userId: 1,
				},
			],
		};
	}

	public static async updateUserEmail(newEmail: string): Promise<User> {
		return API.fetch(
			{
				route: '/auth/me',
				method: 'PUT',
				body: {
					email: newEmail,
				},
			},
			{ handler: UserHandler }
		);
	}

	public static async updateUserPassword(
		oldPassword: string,
		newPassword: string
	): Promise<User> {
		return API.fetch(
			{
				route: '/auth/me',
				method: 'PUT',
				body: {
					oldPassword: oldPassword,
					password: newPassword,
				},
			},
			{ handler: UserHandler }
		);
	}

	public static async updateProfileAvatar(image: ImagePickerAsset): Promise<void> {
		const data = await base64ToBlob(image.uri);
		const formData = new FormData();

		formData.append('file', data);
		return API.fetch({
			route: '/auth/me/picture',
			method: 'POST',
			formData,
		});
	}

	public static async addLikedSong(songId: number): Promise<void> {
		await API.fetch({
			route: `/auth/me/likes/${songId}`,
			method: 'POST',
		});
	}

	public static async removeLikedSong(songId: number): Promise<void> {
		await API.fetch({
			route: `/auth/me/likes/${songId}`,
			method: 'DELETE',
		});
	}

	public static getLikedSongs(): Query<likedSong[]> {
		return {
			key: ['liked songs'],
			exec: () =>
				API.fetch(
					{
						route: '/auth/me/likes',
					},
					{ handler: ListHandler(LikedSongHandler) }
				),
		};
	}

	public static getSongCursorInfos(songId: number): Query<SongCursorInfos> {
		// return API.fetch(
		// 	{
		// 		route: `/song/${songId}/cursorInfos`,
		// 	},
		// 	{ handler: SongCursorInfosHandler }
		// ); "https://cdn.discordapp.com/attachments/717080637038788731/1161702878923210784/4.json?ex=6539431d&is=6526ce1d&hm=f9e10f9089740c0191f4722cbb8a4fb6405f22c9c9bdd90d56457bc88a08fab0&"
		const res = JSON.parse(`{
			"pageWidth": 1647.2547474399994,
			"cursors": [
			  {
				"x": 111.37836,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 60,
					"gain": 1,
					"duration": 1666.5
				  }
				],
				"timestamp": 0,
				"timing": 208.3125
			  },
			  {
				"x": 142.5354074,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 64,
					"gain": 1,
					"duration": 1458.1875
				  }
				],
				"timestamp": 208.3125,
				"timing": 624.9375
			  },
			  {
				"x": 177.96553479999997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 67,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 416.625,
				"timing": 208.3125
			  },
			  {
				"x": 207.3956622,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 72,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 624.9375,
				"timing": 208.3125
			  },
			  {
				"x": 236.82578959999998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 76,
					"gain": 1,
					"duration": 208.3125
				  },
				  {
					"note": 64,
					"gain": 1,
					"duration": 0
				  }
				],
				"timestamp": 833.25,
				"timing": 208.3125
			  },
			  {
				"x": 266.25591699999995,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 67,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 1041.5625,
				"timing": 208.3125
			  },
			  {
				"x": 295.68604439999996,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 72,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 1249.875,
				"timing": 208.3125
			  },
			  {
				"x": 325.11617179999985,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 76,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 1458.1875,
				"timing": 208.3125
			  },
			  {
				"x": 353.4371392,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 60,
					"gain": 1,
					"duration": 1666.5
				  }
				],
				"timestamp": 1666.5,
				"timing": 208.3125
			  },
			  {
				"x": 384.5941865999999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 64,
					"gain": 1,
					"duration": 1458.1875
				  }
				],
				"timestamp": 1874.8125,
				"timing": 624.9375
			  },
			  {
				"x": 420.024314,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 67,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 2083.125,
				"timing": 208.3125
			  },
			  {
				"x": 449.45444139999995,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 72,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 2291.4375,
				"timing": 208.3125
			  },
			  {
				"x": 478.88456879999984,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 76,
					"gain": 1,
					"duration": 208.3125
				  },
				  {
					"note": 64,
					"gain": 1,
					"duration": 0
				  }
				],
				"timestamp": 2499.75,
				"timing": 208.3125
			  },
			  {
				"x": 508.3146961999998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 67,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 2708.0625,
				"timing": 208.3125
			  },
			  {
				"x": 537.7448235999999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 72,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 2916.375,
				"timing": 208.3125
			  },
			  {
				"x": 567.1749509999997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 76,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 3124.6875,
				"timing": 208.3125
			  },
			  {
				"x": 610.4959183999998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 60,
					"gain": 1,
					"duration": 1666.5
				  }
				],
				"timestamp": 3333,
				"timing": 208.3125
			  },
			  {
				"x": 639.9342158,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 62,
					"gain": 1,
					"duration": 1458.1875
				  }
				],
				"timestamp": 3541.3125,
				"timing": 624.9375
			  },
			  {
				"x": 673.6455931999999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 69,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 3749.625,
				"timing": 208.3125
			  },
			  {
				"x": 701.3569705999998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 74,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 3957.9375,
				"timing": 208.3125
			  },
			  {
				"x": 729.0683479999998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 77,
					"gain": 1,
					"duration": 208.3125
				  },
				  {
					"note": 62,
					"gain": 1,
					"duration": 0
				  }
				],
				"timestamp": 4166.25,
				"timing": 208.3125
			  },
			  {
				"x": 756.7797253999998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 69,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 4374.5625,
				"timing": 208.3125
			  },
			  {
				"x": 784.4911027999999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 74,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 4582.875,
				"timing": 208.3125
			  },
			  {
				"x": 812.2024801999999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 77,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 4791.1875,
				"timing": 208.3125
			  },
			  {
				"x": 838.8046975999998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 60,
					"gain": 1,
					"duration": 1666.5
				  }
				],
				"timestamp": 4999.5,
				"timing": 208.3125
			  },
			  {
				"x": 868.2429949999998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 62,
					"gain": 1,
					"duration": 1458.1875
				  }
				],
				"timestamp": 5207.8125,
				"timing": 624.9375
			  },
			  {
				"x": 901.9543723999998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 69,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 5416.125,
				"timing": 208.3125
			  },
			  {
				"x": 929.6657497999997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 74,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 5624.4375,
				"timing": 208.3125
			  },
			  {
				"x": 957.3771271999997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 77,
					"gain": 1,
					"duration": 208.3125
				  },
				  {
					"note": 62,
					"gain": 1,
					"duration": 0
				  }
				],
				"timestamp": 5832.75,
				"timing": 208.3125
			  },
			  {
				"x": 985.0885045999996,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 69,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 6041.0625,
				"timing": 208.3125
			  },
			  {
				"x": 1012.7998819999996,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 74,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 6249.375,
				"timing": 208.3125
			  },
			  {
				"x": 1040.5112593999997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 77,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 6457.6875,
				"timing": 208.3125
			  },
			  {
				"x": 1082.1134767999997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 59,
					"gain": 1,
					"duration": 1666.5
				  }
				],
				"timestamp": 6666,
				"timing": 208.3125
			  },
			  {
				"x": 1111.5517742,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 62,
					"gain": 1,
					"duration": 1458.1875
				  }
				],
				"timestamp": 6874.3125,
				"timing": 624.9375
			  },
			  {
				"x": 1145.2631516,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 67,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 7082.625,
				"timing": 208.3125
			  },
			  {
				"x": 1172.9745289999998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 74,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 7290.9375,
				"timing": 208.3125
			  },
			  {
				"x": 1200.6859063999998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 77,
					"gain": 1,
					"duration": 208.3125
				  },
				  {
					"note": 62,
					"gain": 1,
					"duration": 0
				  }
				],
				"timestamp": 7499.25,
				"timing": 208.3125
			  },
			  {
				"x": 1228.3972837999997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 67,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 7707.5625,
				"timing": 208.3125
			  },
			  {
				"x": 1256.1086612,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 74,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 7915.875,
				"timing": 208.3125
			  },
			  {
				"x": 1283.8200385999996,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 77,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 8124.1875,
				"timing": 208.3125
			  },
			  {
				"x": 1310.4222559999996,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 59,
					"gain": 1,
					"duration": 1666.5
				  }
				],
				"timestamp": 8332.5,
				"timing": 208.3125
			  },
			  {
				"x": 1339.8605533999998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 62,
					"gain": 1,
					"duration": 1458.1875
				  }
				],
				"timestamp": 8540.8125,
				"timing": 624.9375
			  },
			  {
				"x": 1373.5719307999998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 67,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 8749.125,
				"timing": 208.3125
			  },
			  {
				"x": 1401.2833081999997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 74,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 8957.4375,
				"timing": 208.3125
			  },
			  {
				"x": 1428.9946855999997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 77,
					"gain": 1,
					"duration": 208.3125
				  },
				  {
					"note": 62,
					"gain": 1,
					"duration": 0
				  }
				],
				"timestamp": 9165.75,
				"timing": 208.3125
			  },
			  {
				"x": 1456.7060629999996,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 67,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 9374.0625,
				"timing": 208.3125
			  },
			  {
				"x": 1484.4174403999998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 74,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 9582.375,
				"timing": 208.3125
			  },
			  {
				"x": 1512.1288177999998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 77,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 9790.6875,
				"timing": 208.3125
			  },
			  {
				"x": 1553.7310351999997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 60,
					"gain": 1,
					"duration": 1666.5
				  }
				],
				"timestamp": 9999,
				"timing": 208.3125
			  },
			  {
				"x": 1583.1693325999995,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 64,
					"gain": 1,
					"duration": 1458.1875
				  }
				],
				"timestamp": 10207.3125,
				"timing": 624.9375
			  },
			  {
				"x": 1616.8807099999995,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 67,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 10415.625,
				"timing": 208.3125
			  },
			  {
				"x": 1644.5920873999994,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 72,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 10623.9375,
				"timing": 208.3125
			  },
			  {
				"x": 1672.3034647999996,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 76,
					"gain": 1,
					"duration": 208.3125
				  },
				  {
					"note": 64,
					"gain": 1,
					"duration": 0
				  }
				],
				"timestamp": 10832.25,
				"timing": 208.3125
			  },
			  {
				"x": 1700.0148421999995,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 67,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 11040.5625,
				"timing": 208.3125
			  },
			  {
				"x": 1727.7262195999995,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 72,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 11248.875,
				"timing": 208.3125
			  },
			  {
				"x": 1755.4375969999996,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 76,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 11457.1875,
				"timing": 208.3125
			  },
			  {
				"x": 1782.0398143999996,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 60,
					"gain": 1,
					"duration": 1666.5
				  }
				],
				"timestamp": 11665.5,
				"timing": 208.3125
			  },
			  {
				"x": 1811.4781117999996,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 64,
					"gain": 1,
					"duration": 1458.1875
				  }
				],
				"timestamp": 11873.8125,
				"timing": 624.9375
			  },
			  {
				"x": 1845.1894891999996,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 67,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 12082.125,
				"timing": 208.3125
			  },
			  {
				"x": 1872.9008665999995,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 72,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 12290.4375,
				"timing": 208.3125
			  },
			  {
				"x": 1900.6122439999995,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 76,
					"gain": 1,
					"duration": 208.3125
				  },
				  {
					"note": 64,
					"gain": 1,
					"duration": 0
				  }
				],
				"timestamp": 12498.75,
				"timing": 208.3125
			  },
			  {
				"x": 1928.3236213999996,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 67,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 12707.0625,
				"timing": 208.3125
			  },
			  {
				"x": 1956.0349987999996,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 72,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 12915.375,
				"timing": 208.3125
			  },
			  {
				"x": 1983.7463761999995,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 76,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 13123.6875,
				"timing": 208.3125
			  },
			  {
				"x": 2025.3485935999995,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 60,
					"gain": 1,
					"duration": 1666.5
				  }
				],
				"timestamp": 13332,
				"timing": 208.3125
			  },
			  {
				"x": 2054.7868909999993,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 64,
					"gain": 1,
					"duration": 1458.1875
				  }
				],
				"timestamp": 13540.3125,
				"timing": 624.9375
			  },
			  {
				"x": 2088.4982683999992,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 69,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 13748.625,
				"timing": 208.3125
			  },
			  {
				"x": 2116.209645799999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 76,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 13956.9375,
				"timing": 208.3125
			  },
			  {
				"x": 2143.9210231999996,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 81,
					"gain": 1,
					"duration": 208.3125
				  },
				  {
					"note": 64,
					"gain": 1,
					"duration": 0
				  }
				],
				"timestamp": 14165.25,
				"timing": 208.3125
			  },
			  {
				"x": 2171.6324005999995,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 69,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 14373.5625,
				"timing": 208.3125
			  },
			  {
				"x": 2199.3437779999995,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 76,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 14581.875,
				"timing": 208.3125
			  },
			  {
				"x": 2227.0551553999994,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 81,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 14790.1875,
				"timing": 208.3125
			  },
			  {
				"x": 2253.6573727999994,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 60,
					"gain": 1,
					"duration": 1666.5
				  }
				],
				"timestamp": 14998.5,
				"timing": 208.3125
			  },
			  {
				"x": 2283.0956701999994,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 64,
					"gain": 1,
					"duration": 1458.1875
				  }
				],
				"timestamp": 15206.8125,
				"timing": 624.9375
			  },
			  {
				"x": 2316.8070475999994,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 69,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 15415.125,
				"timing": 208.3125
			  },
			  {
				"x": 2344.5184249999993,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 76,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 15623.4375,
				"timing": 208.3125
			  },
			  {
				"x": 2372.2298023999992,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 81,
					"gain": 1,
					"duration": 208.3125
				  },
				  {
					"note": 64,
					"gain": 1,
					"duration": 0
				  }
				],
				"timestamp": 15831.75,
				"timing": 208.3125
			  },
			  {
				"x": 2399.941179799999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 69,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 16040.0625,
				"timing": 208.3125
			  },
			  {
				"x": 2427.6525571999996,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 76,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 16248.375,
				"timing": 208.3125
			  },
			  {
				"x": 2455.3639345999995,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 81,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 16456.6875,
				"timing": 208.3125
			  },
			  {
				"x": 2496.9661519999995,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 60,
					"gain": 1,
					"duration": 1666.5
				  }
				],
				"timestamp": 16665,
				"timing": 208.3125
			  },
			  {
				"x": 2526.5568920999995,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 62,
					"gain": 1,
					"duration": 1458.1875
				  }
				],
				"timestamp": 16873.3125,
				"timing": 624.9375
			  },
			  {
				"x": 2573.257992199999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 66,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 17081.625,
				"timing": 208.3125
			  },
			  {
				"x": 2601.121812299999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 69,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 17289.9375,
				"timing": 208.3125
			  },
			  {
				"x": 2628.9856323999993,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 74,
					"gain": 1,
					"duration": 208.3125
				  },
				  {
					"note": 62,
					"gain": 1,
					"duration": 0
				  }
				],
				"timestamp": 17498.25,
				"timing": 208.3125
			  },
			  {
				"x": 2656.8494524999996,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 66,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 17706.5625,
				"timing": 208.3125
			  },
			  {
				"x": 2684.7132725999995,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 69,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 17914.875,
				"timing": 208.3125
			  },
			  {
				"x": 2712.577092699999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 74,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 18123.1875,
				"timing": 208.3125
			  },
			  {
				"x": 2739.3317527999993,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 60,
					"gain": 1,
					"duration": 1666.5
				  }
				],
				"timestamp": 18331.5,
				"timing": 208.3125
			  },
			  {
				"x": 2768.9224928999993,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 62,
					"gain": 1,
					"duration": 1458.1875
				  }
				],
				"timestamp": 18539.8125,
				"timing": 624.9375
			  },
			  {
				"x": 2802.786312999999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 66,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 18748.125,
				"timing": 208.3125
			  },
			  {
				"x": 2830.650133099999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 69,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 18956.4375,
				"timing": 208.3125
			  },
			  {
				"x": 2858.5139531999994,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 74,
					"gain": 1,
					"duration": 208.3125
				  },
				  {
					"note": 62,
					"gain": 1,
					"duration": 0
				  }
				],
				"timestamp": 19164.75,
				"timing": 208.3125
			  },
			  {
				"x": 2886.3777732999997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 66,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 19373.0625,
				"timing": 208.3125
			  },
			  {
				"x": 2914.241593399999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 69,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 19581.375,
				"timing": 208.3125
			  },
			  {
				"x": 2942.105413499999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 74,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 19789.6875,
				"timing": 208.3125
			  },
			  {
				"x": 2983.8600735999994,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 59,
					"gain": 1,
					"duration": 1666.5
				  }
				],
				"timestamp": 19998,
				"timing": 208.3125
			  },
			  {
				"x": 3013.298371,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 62,
					"gain": 1,
					"duration": 1458.1875
				  }
				],
				"timestamp": 20206.3125,
				"timing": 624.9375
			  },
			  {
				"x": 3047.0097484,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 67,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 20414.625,
				"timing": 208.3125
			  },
			  {
				"x": 3074.7211257999993,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 74,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 20622.9375,
				"timing": 208.3125
			  },
			  {
				"x": 3102.4325031999997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 79,
					"gain": 1,
					"duration": 208.3125
				  },
				  {
					"note": 62,
					"gain": 1,
					"duration": 0
				  }
				],
				"timestamp": 20831.25,
				"timing": 208.3125
			  },
			  {
				"x": 3130.143880599999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 67,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 21039.5625,
				"timing": 208.3125
			  },
			  {
				"x": 3157.8552579999996,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 74,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 21247.875,
				"timing": 208.3125
			  },
			  {
				"x": 3185.5666353999995,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 79,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 21456.1875,
				"timing": 208.3125
			  },
			  {
				"x": 3212.1688527999995,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 59,
					"gain": 1,
					"duration": 1666.5
				  }
				],
				"timestamp": 21664.5,
				"timing": 208.3125
			  },
			  {
				"x": 3241.6071501999995,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 62,
					"gain": 1,
					"duration": 1458.1875
				  }
				],
				"timestamp": 21872.8125,
				"timing": 624.9375
			  },
			  {
				"x": 3275.3185275999995,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 67,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 22081.125,
				"timing": 208.3125
			  },
			  {
				"x": 3303.0299049999994,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 74,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 22289.4375,
				"timing": 208.3125
			  },
			  {
				"x": 3330.7412823999994,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 79,
					"gain": 1,
					"duration": 208.3125
				  },
				  {
					"note": 62,
					"gain": 1,
					"duration": 0
				  }
				],
				"timestamp": 22497.75,
				"timing": 208.3125
			  },
			  {
				"x": 3358.4526597999993,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 67,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 22706.0625,
				"timing": 208.3125
			  },
			  {
				"x": 3386.1640371999993,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 74,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 22914.375,
				"timing": 208.3125
			  },
			  {
				"x": 3413.875414599999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 79,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 23122.6875,
				"timing": 208.3125
			  },
			  {
				"x": 3455.4776319999996,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 59,
					"gain": 1,
					"duration": 1666.5
				  }
				],
				"timestamp": 23331,
				"timing": 208.3125
			  },
			  {
				"x": 3484.9159293999996,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 60,
					"gain": 1,
					"duration": 1458.1875
				  }
				],
				"timestamp": 23539.3125,
				"timing": 624.9375
			  },
			  {
				"x": 3518.6273067999996,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 64,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 23747.625,
				"timing": 208.3125
			  },
			  {
				"x": 3546.3386841999995,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 67,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 23955.9375,
				"timing": 208.3125
			  },
			  {
				"x": 3574.0500616,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 72,
					"gain": 1,
					"duration": 208.3125
				  },
				  {
					"note": 60,
					"gain": 1,
					"duration": 0
				  }
				],
				"timestamp": 24164.25,
				"timing": 208.3125
			  },
			  {
				"x": 3601.7614389999994,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 64,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 24372.5625,
				"timing": 208.3125
			  },
			  {
				"x": 3629.4728164,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 67,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 24580.875,
				"timing": 208.3125
			  },
			  {
				"x": 3657.1841937999993,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 72,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 24789.1875,
				"timing": 208.3125
			  },
			  {
				"x": 3683.7864111999993,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 59,
					"gain": 1,
					"duration": 1666.5
				  }
				],
				"timestamp": 24997.5,
				"timing": 208.3125
			  },
			  {
				"x": 3713.2247085999998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 60,
					"gain": 1,
					"duration": 1458.1875
				  }
				],
				"timestamp": 25205.8125,
				"timing": 624.9375
			  },
			  {
				"x": 3746.9360859999997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 64,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 25414.125,
				"timing": 208.3125
			  },
			  {
				"x": 3774.647463399999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 67,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 25622.4375,
				"timing": 208.3125
			  },
			  {
				"x": 3802.3588407999996,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 72,
					"gain": 1,
					"duration": 208.3125
				  },
				  {
					"note": 60,
					"gain": 1,
					"duration": 0
				  }
				],
				"timestamp": 25830.75,
				"timing": 208.3125
			  },
			  {
				"x": 3830.070218199999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 64,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 26039.0625,
				"timing": 208.3125
			  },
			  {
				"x": 3857.7815955999995,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 67,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 26247.375,
				"timing": 208.3125
			  },
			  {
				"x": 3885.4929729999994,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 72,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 26455.6875,
				"timing": 208.3125
			  },
			  {
				"x": 3927.0951904,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 57,
					"gain": 1,
					"duration": 1666.5
				  }
				],
				"timestamp": 26664,
				"timing": 208.3125
			  },
			  {
				"x": 3956.5334878,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 60,
					"gain": 1,
					"duration": 1458.1875
				  }
				],
				"timestamp": 26872.3125,
				"timing": 624.9375
			  },
			  {
				"x": 3990.2448652,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 64,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 27080.625,
				"timing": 208.3125
			  },
			  {
				"x": 4017.9562425999993,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 67,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 27288.9375,
				"timing": 208.3125
			  },
			  {
				"x": 4045.6676199999997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 72,
					"gain": 1,
					"duration": 208.3125
				  },
				  {
					"note": 60,
					"gain": 1,
					"duration": 0
				  }
				],
				"timestamp": 27497.25,
				"timing": 208.3125
			  },
			  {
				"x": 4073.3789973999997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 64,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 27705.5625,
				"timing": 208.3125
			  },
			  {
				"x": 4101.0903748,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 67,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 27913.875,
				"timing": 208.3125
			  },
			  {
				"x": 4128.801752199999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 72,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 28122.1875,
				"timing": 208.3125
			  },
			  {
				"x": 4155.4039696,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 57,
					"gain": 1,
					"duration": 1666.5
				  }
				],
				"timestamp": 28330.5,
				"timing": 208.3125
			  },
			  {
				"x": 4184.842267,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 60,
					"gain": 1,
					"duration": 1458.1875
				  }
				],
				"timestamp": 28538.8125,
				"timing": 624.9375
			  },
			  {
				"x": 4218.5536444,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 64,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 28747.125,
				"timing": 208.3125
			  },
			  {
				"x": 4246.2650218,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 67,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 28955.4375,
				"timing": 208.3125
			  },
			  {
				"x": 4273.9763992,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 72,
					"gain": 1,
					"duration": 208.3125
				  },
				  {
					"note": 60,
					"gain": 1,
					"duration": 0
				  }
				],
				"timestamp": 29163.75,
				"timing": 208.3125
			  },
			  {
				"x": 4301.6877766,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 64,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 29372.0625,
				"timing": 208.3125
			  },
			  {
				"x": 4329.399154,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 67,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 29580.375,
				"timing": 208.3125
			  },
			  {
				"x": 4357.1105314,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 72,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 29788.6875,
				"timing": 208.3125
			  },
			  {
				"x": 4398.7127488,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 50,
					"gain": 1,
					"duration": 1666.5
				  }
				],
				"timestamp": 29997,
				"timing": 208.3125
			  },
			  {
				"x": 4428.3034889,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 57,
					"gain": 1,
					"duration": 1458.1875
				  }
				],
				"timestamp": 30205.3125,
				"timing": 624.9375
			  },
			  {
				"x": 4462.1673089999995,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 62,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 30413.625,
				"timing": 208.3125
			  },
			  {
				"x": 4502.8684091,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 66,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 30621.9375,
				"timing": 208.3125
			  },
			  {
				"x": 4530.7322292,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 72,
					"gain": 1,
					"duration": 208.3125
				  },
				  {
					"note": 57,
					"gain": 1,
					"duration": 0
				  }
				],
				"timestamp": 30830.25,
				"timing": 208.3125
			  },
			  {
				"x": 4558.5960493,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 62,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 31038.5625,
				"timing": 208.3125
			  },
			  {
				"x": 4586.4598694,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 66,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 31246.875,
				"timing": 208.3125
			  },
			  {
				"x": 4614.323689499999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 72,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 31455.1875,
				"timing": 208.3125
			  },
			  {
				"x": 4641.0783496,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 50,
					"gain": 1,
					"duration": 1666.5
				  }
				],
				"timestamp": 31663.5,
				"timing": 208.3125
			  },
			  {
				"x": 4670.6690897,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 57,
					"gain": 1,
					"duration": 1458.1875
				  }
				],
				"timestamp": 31871.8125,
				"timing": 624.9375
			  },
			  {
				"x": 4704.532909799999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 62,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 32080.125,
				"timing": 208.3125
			  },
			  {
				"x": 4732.3967299,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 66,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 32288.4375,
				"timing": 208.3125
			  },
			  {
				"x": 4760.26055,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 72,
					"gain": 1,
					"duration": 208.3125
				  },
				  {
					"note": 57,
					"gain": 1,
					"duration": 0
				  }
				],
				"timestamp": 32496.75,
				"timing": 208.3125
			  },
			  {
				"x": 4788.1243701,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 62,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 32705.0625,
				"timing": 208.3125
			  },
			  {
				"x": 4815.9881902,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 66,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 32913.375,
				"timing": 208.3125
			  },
			  {
				"x": 4843.852010299999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 72,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 33121.6875,
				"timing": 208.3125
			  },
			  {
				"x": 4885.6066704,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 55,
					"gain": 1,
					"duration": 1666.5
				  }
				],
				"timestamp": 33330,
				"timing": 208.3125
			  },
			  {
				"x": 4915.0449678,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 59,
					"gain": 1,
					"duration": 1458.1875
				  }
				],
				"timestamp": 33538.3125,
				"timing": 624.9375
			  },
			  {
				"x": 4948.7563452,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 62,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 33746.625,
				"timing": 208.3125
			  },
			  {
				"x": 4976.467722599999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 67,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 33954.9375,
				"timing": 208.3125
			  },
			  {
				"x": 5004.1791,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 71,
					"gain": 1,
					"duration": 208.3125
				  },
				  {
					"note": 59,
					"gain": 1,
					"duration": 0
				  }
				],
				"timestamp": 34163.25,
				"timing": 208.3125
			  },
			  {
				"x": 5031.8904774,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 62,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 34371.5625,
				"timing": 208.3125
			  },
			  {
				"x": 5059.6018548,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 67,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 34579.875,
				"timing": 208.3125
			  },
			  {
				"x": 5087.3132322,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 71,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 34788.1875,
				"timing": 208.3125
			  },
			  {
				"x": 5113.9154496,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 55,
					"gain": 1,
					"duration": 1666.5
				  }
				],
				"timestamp": 34996.5,
				"timing": 208.3125
			  },
			  {
				"x": 5143.353747,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 59,
					"gain": 1,
					"duration": 1458.1875
				  }
				],
				"timestamp": 35204.8125,
				"timing": 624.9375
			  },
			  {
				"x": 5177.0651244,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 62,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 35413.125,
				"timing": 208.3125
			  },
			  {
				"x": 5204.776501799999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 67,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 35621.4375,
				"timing": 208.3125
			  },
			  {
				"x": 5232.487879199999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 71,
					"gain": 1,
					"duration": 208.3125
				  },
				  {
					"note": 59,
					"gain": 1,
					"duration": 0
				  }
				],
				"timestamp": 35829.75,
				"timing": 208.3125
			  },
			  {
				"x": 5260.1992566,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 62,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 36038.0625,
				"timing": 208.3125
			  },
			  {
				"x": 5287.910634,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 67,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 36246.375,
				"timing": 208.3125
			  },
			  {
				"x": 5315.6220114,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 71,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 36454.6875,
				"timing": 208.3125
			  },
			  {
				"x": 5357.2242288,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 55,
					"gain": 1,
					"duration": 1666.5
				  }
				],
				"timestamp": 36663,
				"timing": 208.3125
			  },
			  {
				"x": 5398.392761699999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 58,
					"gain": 1,
					"duration": 1458.1875
				  }
				],
				"timestamp": 36871.3125,
				"timing": 624.9375
			  },
			  {
				"x": 5432.3924546,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 64,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 37079.625,
				"timing": 208.3125
			  },
			  {
				"x": 5460.392147500001,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 67,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 37287.9375,
				"timing": 208.3125
			  },
			  {
				"x": 5501.229120399999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 73,
					"gain": 1,
					"duration": 208.3125
				  },
				  {
					"note": 58,
					"gain": 1,
					"duration": 0
				  }
				],
				"timestamp": 37496.25,
				"timing": 208.3125
			  },
			  {
				"x": 5529.2288133,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 64,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 37704.5625,
				"timing": 208.3125
			  },
			  {
				"x": 5557.2285062,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 67,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 37912.875,
				"timing": 208.3125
			  },
			  {
				"x": 5585.2281991,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 73,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 38121.1875,
				"timing": 208.3125
			  },
			  {
				"x": 5612.118732,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 55,
					"gain": 1,
					"duration": 1666.5
				  }
				],
				"timestamp": 38329.5,
				"timing": 208.3125
			  },
			  {
				"x": 5641.845344900001,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 58,
					"gain": 1,
					"duration": 1458.1875
				  }
				],
				"timestamp": 38537.8125,
				"timing": 624.9375
			  },
			  {
				"x": 5675.8450378,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 64,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 38746.125,
				"timing": 208.3125
			  },
			  {
				"x": 5703.844730700001,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 67,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 38954.4375,
				"timing": 208.3125
			  },
			  {
				"x": 5731.8444236000005,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 73,
					"gain": 1,
					"duration": 208.3125
				  },
				  {
					"note": 58,
					"gain": 1,
					"duration": 0
				  }
				],
				"timestamp": 39162.75,
				"timing": 208.3125
			  },
			  {
				"x": 5759.8441164999995,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 64,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 39371.0625,
				"timing": 208.3125
			  },
			  {
				"x": 5787.8438094,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 67,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 39579.375,
				"timing": 208.3125
			  },
			  {
				"x": 5815.8435023,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 73,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 39787.6875,
				"timing": 208.3125
			  },
			  {
				"x": 5857.7340352,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 53,
					"gain": 1,
					"duration": 1666.5
				  }
				],
				"timestamp": 39996,
				"timing": 208.3125
			  },
			  {
				"x": 5887.172332600001,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 57,
					"gain": 1,
					"duration": 1458.1875
				  }
				],
				"timestamp": 40204.3125,
				"timing": 624.9375
			  },
			  {
				"x": 5920.88371,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 62,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 40412.625,
				"timing": 208.3125
			  },
			  {
				"x": 5948.5950874,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 69,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 40620.9375,
				"timing": 208.3125
			  },
			  {
				"x": 5976.3064648,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 74,
					"gain": 1,
					"duration": 208.3125
				  },
				  {
					"note": 57,
					"gain": 1,
					"duration": 0
				  }
				],
				"timestamp": 40829.25,
				"timing": 208.3125
			  },
			  {
				"x": 6004.017842200001,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 62,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 41037.5625,
				"timing": 208.3125
			  },
			  {
				"x": 6031.729219600001,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 69,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 41245.875,
				"timing": 208.3125
			  },
			  {
				"x": 6059.440597000001,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 74,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 41454.1875,
				"timing": 208.3125
			  },
			  {
				"x": 6086.0428144,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 53,
					"gain": 1,
					"duration": 1666.5
				  }
				],
				"timestamp": 41662.5,
				"timing": 208.3125
			  },
			  {
				"x": 6115.4811118,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 57,
					"gain": 1,
					"duration": 1458.1875
				  }
				],
				"timestamp": 41870.8125,
				"timing": 624.9375
			  },
			  {
				"x": 6149.1924892,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 62,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 42079.125,
				"timing": 208.3125
			  },
			  {
				"x": 6176.903866600001,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 69,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 42287.4375,
				"timing": 208.3125
			  },
			  {
				"x": 6204.6152440000005,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 74,
					"gain": 1,
					"duration": 208.3125
				  },
				  {
					"note": 57,
					"gain": 1,
					"duration": 0
				  }
				],
				"timestamp": 42495.75,
				"timing": 208.3125
			  },
			  {
				"x": 6232.3266214,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 62,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 42704.0625,
				"timing": 208.3125
			  },
			  {
				"x": 6260.0379987999995,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 69,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 42912.375,
				"timing": 208.3125
			  },
			  {
				"x": 6287.7493762,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 74,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 43120.6875,
				"timing": 208.3125
			  },
			  {
				"x": 6329.351593599999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 53,
					"gain": 1,
					"duration": 1666.5
				  }
				],
				"timestamp": 43329,
				"timing": 208.3125
			  },
			  {
				"x": 6370.3676838,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 56,
					"gain": 1,
					"duration": 1458.1875
				  }
				],
				"timestamp": 43537.3125,
				"timing": 624.9375
			  },
			  {
				"x": 6404.2149340000005,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 62,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 43745.625,
				"timing": 208.3125
			  },
			  {
				"x": 6432.0621842,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 65,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 43953.9375,
				"timing": 208.3125
			  },
			  {
				"x": 6459.9094344000005,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 71,
					"gain": 1,
					"duration": 208.3125
				  },
				  {
					"note": 56,
					"gain": 1,
					"duration": 0
				  }
				],
				"timestamp": 44162.25,
				"timing": 208.3125
			  },
			  {
				"x": 6487.7566846,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 62,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 44370.5625,
				"timing": 208.3125
			  },
			  {
				"x": 6515.6039348,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 65,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 44578.875,
				"timing": 208.3125
			  },
			  {
				"x": 6543.451185,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 71,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 44787.1875,
				"timing": 208.3125
			  },
			  {
				"x": 6570.1892752,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 53,
					"gain": 1,
					"duration": 1666.5
				  }
				],
				"timestamp": 44995.5,
				"timing": 208.3125
			  },
			  {
				"x": 6599.7634454,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 56,
					"gain": 1,
					"duration": 1458.1875
				  }
				],
				"timestamp": 45203.8125,
				"timing": 624.9375
			  },
			  {
				"x": 6633.6106956,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 62,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 45412.125,
				"timing": 208.3125
			  },
			  {
				"x": 6661.457945800001,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 65,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 45620.4375,
				"timing": 208.3125
			  },
			  {
				"x": 6689.305196,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 71,
					"gain": 1,
					"duration": 208.3125
				  },
				  {
					"note": 56,
					"gain": 1,
					"duration": 0
				  }
				],
				"timestamp": 45828.75,
				"timing": 208.3125
			  },
			  {
				"x": 6717.1524462,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 62,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 46037.0625,
				"timing": 208.3125
			  },
			  {
				"x": 6744.9996964,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 65,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 46245.375,
				"timing": 208.3125
			  },
			  {
				"x": 6772.846946600001,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 71,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 46453.6875,
				"timing": 208.3125
			  },
			  {
				"x": 6814.585036799999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 52,
					"gain": 1,
					"duration": 1666.5
				  }
				],
				"timestamp": 46662,
				"timing": 208.3125
			  },
			  {
				"x": 6844.0233342,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 55,
					"gain": 1,
					"duration": 1458.1875
				  }
				],
				"timestamp": 46870.3125,
				"timing": 624.9375
			  },
			  {
				"x": 6877.7347116,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 60,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 47078.625,
				"timing": 208.3125
			  },
			  {
				"x": 6905.446088999999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 67,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 47286.9375,
				"timing": 208.3125
			  },
			  {
				"x": 6933.157466399999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 72,
					"gain": 1,
					"duration": 208.3125
				  },
				  {
					"note": 55,
					"gain": 1,
					"duration": 0
				  }
				],
				"timestamp": 47495.25,
				"timing": 208.3125
			  },
			  {
				"x": 6960.8688438,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 60,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 47703.5625,
				"timing": 208.3125
			  },
			  {
				"x": 6988.5802212,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 67,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 47911.875,
				"timing": 208.3125
			  },
			  {
				"x": 7016.2915986,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 72,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 48120.1875,
				"timing": 208.3125
			  },
			  {
				"x": 7042.893816,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 52,
					"gain": 1,
					"duration": 1666.5
				  }
				],
				"timestamp": 48328.5,
				"timing": 208.3125
			  },
			  {
				"x": 7072.332113399999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 55,
					"gain": 1,
					"duration": 1458.1875
				  }
				],
				"timestamp": 48536.8125,
				"timing": 624.9375
			  },
			  {
				"x": 7106.043490800001,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 60,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 48745.125,
				"timing": 208.3125
			  },
			  {
				"x": 7133.7548682,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 67,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 48953.4375,
				"timing": 208.3125
			  },
			  {
				"x": 7161.4662456,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 72,
					"gain": 1,
					"duration": 208.3125
				  },
				  {
					"note": 55,
					"gain": 1,
					"duration": 0
				  }
				],
				"timestamp": 49161.75,
				"timing": 208.3125
			  },
			  {
				"x": 7189.177623,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 60,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 49370.0625,
				"timing": 208.3125
			  },
			  {
				"x": 7216.889000399999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 67,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 49578.375,
				"timing": 208.3125
			  },
			  {
				"x": 7244.6003777999995,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 72,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 49786.6875,
				"timing": 208.3125
			  },
			  {
				"x": 7286.2025951999985,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 52,
					"gain": 1,
					"duration": 1666.5
				  }
				],
				"timestamp": 49995,
				"timing": 208.3125
			  },
			  {
				"x": 7321.9354458,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 53,
					"gain": 1,
					"duration": 1458.1875
				  }
				],
				"timestamp": 50203.3125,
				"timing": 624.9375
			  },
			  {
				"x": 7361.941376399999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 57,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 50411.625,
				"timing": 208.3125
			  },
			  {
				"x": 7389.938186999999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 60,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 50619.9375,
				"timing": 208.3125
			  },
			  {
				"x": 7417.934997599999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 65,
					"gain": 1,
					"duration": 208.3125
				  },
				  {
					"note": 53,
					"gain": 1,
					"duration": 0
				  }
				],
				"timestamp": 50828.25,
				"timing": 208.3125
			  },
			  {
				"x": 7445.931808199999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 57,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 51036.5625,
				"timing": 208.3125
			  },
			  {
				"x": 7473.9286188,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 60,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 51244.875,
				"timing": 208.3125
			  },
			  {
				"x": 7501.925429399999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 65,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 51453.1875,
				"timing": 208.3125
			  },
			  {
				"x": 7528.813079999999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 52,
					"gain": 1,
					"duration": 1666.5
				  }
				],
				"timestamp": 51661.5,
				"timing": 208.3125
			  },
			  {
				"x": 7564.545930599999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 53,
					"gain": 1,
					"duration": 1458.1875
				  }
				],
				"timestamp": 51869.8125,
				"timing": 624.9375
			  },
			  {
				"x": 7604.551861199999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 57,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 52078.125,
				"timing": 208.3125
			  },
			  {
				"x": 7632.548671799999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 60,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 52286.4375,
				"timing": 208.3125
			  },
			  {
				"x": 7660.545482399999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 65,
					"gain": 1,
					"duration": 208.3125
				  },
				  {
					"note": 53,
					"gain": 1,
					"duration": 0
				  }
				],
				"timestamp": 52494.75,
				"timing": 208.3125
			  },
			  {
				"x": 7688.5422929999995,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 57,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 52703.0625,
				"timing": 208.3125
			  },
			  {
				"x": 7716.539103599999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 60,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 52911.375,
				"timing": 208.3125
			  },
			  {
				"x": 7744.5359142,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 65,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 53119.6875,
				"timing": 208.3125
			  },
			  {
				"x": 7786.4235647999985,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 50,
					"gain": 1,
					"duration": 1666.5
				  }
				],
				"timestamp": 53328,
				"timing": 208.3125
			  },
			  {
				"x": 7822.1564154,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 53,
					"gain": 1,
					"duration": 1458.1875
				  }
				],
				"timestamp": 53536.3125,
				"timing": 624.9375
			  },
			  {
				"x": 7862.162345999999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 57,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 53744.625,
				"timing": 208.3125
			  },
			  {
				"x": 7890.159156599999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 60,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 53952.9375,
				"timing": 208.3125
			  },
			  {
				"x": 7918.155967199999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 65,
					"gain": 1,
					"duration": 208.3125
				  },
				  {
					"note": 53,
					"gain": 1,
					"duration": 0
				  }
				],
				"timestamp": 54161.25,
				"timing": 208.3125
			  },
			  {
				"x": 7946.152777799999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 57,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 54369.5625,
				"timing": 208.3125
			  },
			  {
				"x": 7974.1495884,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 60,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 54577.875,
				"timing": 208.3125
			  },
			  {
				"x": 8002.146398999999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 65,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 54786.1875,
				"timing": 208.3125
			  },
			  {
				"x": 8029.034049599999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 50,
					"gain": 1,
					"duration": 1666.5
				  }
				],
				"timestamp": 54994.5,
				"timing": 208.3125
			  },
			  {
				"x": 8064.7669002,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 53,
					"gain": 1,
					"duration": 1458.1875
				  }
				],
				"timestamp": 55202.8125,
				"timing": 624.9375
			  },
			  {
				"x": 8104.772830799999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 57,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 55411.125,
				"timing": 208.3125
			  },
			  {
				"x": 8132.769641399999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 60,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 55619.4375,
				"timing": 208.3125
			  },
			  {
				"x": 8160.766451999999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 65,
					"gain": 1,
					"duration": 208.3125
				  },
				  {
					"note": 53,
					"gain": 1,
					"duration": 0
				  }
				],
				"timestamp": 55827.75,
				"timing": 208.3125
			  },
			  {
				"x": 8188.7632625999995,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 57,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 56036.0625,
				"timing": 208.3125
			  },
			  {
				"x": 8216.7600732,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 60,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 56244.375,
				"timing": 208.3125
			  },
			  {
				"x": 8244.756883799999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 65,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 56452.6875,
				"timing": 208.3125
			  },
			  {
				"x": 8286.644534399999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 43,
					"gain": 1,
					"duration": 1666.5
				  }
				],
				"timestamp": 56661,
				"timing": 208.3125
			  },
			  {
				"x": 8322.377385,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 50,
					"gain": 1,
					"duration": 1458.1875
				  }
				],
				"timestamp": 56869.3125,
				"timing": 624.9375
			  },
			  {
				"x": 8362.383315599998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 55,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 57077.625,
				"timing": 208.3125
			  },
			  {
				"x": 8390.3801262,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 59,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 57285.9375,
				"timing": 208.3125
			  },
			  {
				"x": 8418.3769368,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 65,
					"gain": 1,
					"duration": 208.3125
				  },
				  {
					"note": 50,
					"gain": 1,
					"duration": 0
				  }
				],
				"timestamp": 57494.25,
				"timing": 208.3125
			  },
			  {
				"x": 8446.373747399999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 55,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 57702.5625,
				"timing": 208.3125
			  },
			  {
				"x": 8474.370557999999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 59,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 57910.875,
				"timing": 208.3125
			  },
			  {
				"x": 8502.3673686,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 65,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 58119.1875,
				"timing": 208.3125
			  },
			  {
				"x": 8529.255019199998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 43,
					"gain": 1,
					"duration": 1666.5
				  }
				],
				"timestamp": 58327.5,
				"timing": 208.3125
			  },
			  {
				"x": 8564.9878698,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 50,
					"gain": 1,
					"duration": 1458.1875
				  }
				],
				"timestamp": 58535.8125,
				"timing": 624.9375
			  },
			  {
				"x": 8604.9938004,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 55,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 58744.125,
				"timing": 208.3125
			  },
			  {
				"x": 8632.990611,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 59,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 58952.4375,
				"timing": 208.3125
			  },
			  {
				"x": 8660.987421599999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 65,
					"gain": 1,
					"duration": 208.3125
				  },
				  {
					"note": 50,
					"gain": 1,
					"duration": 0
				  }
				],
				"timestamp": 59160.75,
				"timing": 208.3125
			  },
			  {
				"x": 8688.984232199999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 55,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 59369.0625,
				"timing": 208.3125
			  },
			  {
				"x": 8716.9810428,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 59,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 59577.375,
				"timing": 208.3125
			  },
			  {
				"x": 8744.9778534,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 65,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 59785.6875,
				"timing": 208.3125
			  },
			  {
				"x": 8786.865504,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 48,
					"gain": 1,
					"duration": 1666.5
				  }
				],
				"timestamp": 59994,
				"timing": 208.3125
			  },
			  {
				"x": 8822.598354599999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 52,
					"gain": 1,
					"duration": 1458.1875
				  }
				],
				"timestamp": 60202.3125,
				"timing": 624.9375
			  },
			  {
				"x": 8862.6042852,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 55,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 60410.625,
				"timing": 208.3125
			  },
			  {
				"x": 8890.601095799999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 60,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 60618.9375,
				"timing": 208.3125
			  },
			  {
				"x": 8918.597906399998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 64,
					"gain": 1,
					"duration": 208.3125
				  },
				  {
					"note": 52,
					"gain": 1,
					"duration": 0
				  }
				],
				"timestamp": 60827.25,
				"timing": 208.3125
			  },
			  {
				"x": 8946.594717,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 55,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 61035.5625,
				"timing": 208.3125
			  },
			  {
				"x": 8974.5915276,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 60,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 61243.875,
				"timing": 208.3125
			  },
			  {
				"x": 9002.5883382,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 64,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 61452.1875,
				"timing": 208.3125
			  },
			  {
				"x": 9029.475988799999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 48,
					"gain": 1,
					"duration": 1666.5
				  }
				],
				"timestamp": 61660.5,
				"timing": 208.3125
			  },
			  {
				"x": 9065.2088394,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 52,
					"gain": 1,
					"duration": 1458.1875
				  }
				],
				"timestamp": 61868.8125,
				"timing": 624.9375
			  },
			  {
				"x": 9105.214769999999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 55,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 62077.125,
				"timing": 208.3125
			  },
			  {
				"x": 9133.211580599998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 60,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 62285.4375,
				"timing": 208.3125
			  },
			  {
				"x": 9161.2083912,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 64,
					"gain": 1,
					"duration": 208.3125
				  },
				  {
					"note": 52,
					"gain": 1,
					"duration": 0
				  }
				],
				"timestamp": 62493.75,
				"timing": 208.3125
			  },
			  {
				"x": 9189.2052018,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 55,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 62702.0625,
				"timing": 208.3125
			  },
			  {
				"x": 9217.2020124,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 60,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 62910.375,
				"timing": 208.3125
			  },
			  {
				"x": 9245.198822999999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 64,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 63118.6875,
				"timing": 208.3125
			  },
			  {
				"x": 9287.086473599998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 48,
					"gain": 1,
					"duration": 1666.5
				  }
				],
				"timestamp": 63327,
				"timing": 208.3125
			  },
			  {
				"x": 9322.955197,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 55,
					"gain": 1,
					"duration": 1458.1875
				  }
				],
				"timestamp": 63535.3125,
				"timing": 624.9375
			  },
			  {
				"x": 9374.538920399998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 58,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 63743.625,
				"timing": 208.3125
			  },
			  {
				"x": 9402.6716038,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 60,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 63951.9375,
				"timing": 208.3125
			  },
			  {
				"x": 9430.804287199999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 64,
					"gain": 1,
					"duration": 208.3125
				  },
				  {
					"note": 55,
					"gain": 1,
					"duration": 0
				  }
				],
				"timestamp": 64160.25,
				"timing": 208.3125
			  },
			  {
				"x": 9458.9369706,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 58,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 64368.5625,
				"timing": 208.3125
			  },
			  {
				"x": 9487.069653999999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 60,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 64576.875,
				"timing": 208.3125
			  },
			  {
				"x": 9515.202337399998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 64,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 64785.1875,
				"timing": 208.3125
			  },
			  {
				"x": 9542.2258608,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 48,
					"gain": 1,
					"duration": 1666.5
				  }
				],
				"timestamp": 64993.5,
				"timing": 208.3125
			  },
			  {
				"x": 9578.0945842,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 55,
					"gain": 1,
					"duration": 1458.1875
				  }
				],
				"timestamp": 65201.8125,
				"timing": 624.9375
			  },
			  {
				"x": 9618.236387599998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 58,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 65410.125,
				"timing": 208.3125
			  },
			  {
				"x": 9646.369071,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 60,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 65618.4375,
				"timing": 208.3125
			  },
			  {
				"x": 9674.5017544,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 64,
					"gain": 1,
					"duration": 208.3125
				  },
				  {
					"note": 55,
					"gain": 1,
					"duration": 0
				  }
				],
				"timestamp": 65826.75,
				"timing": 208.3125
			  },
			  {
				"x": 9702.6344378,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 58,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 66035.0625,
				"timing": 208.3125
			  },
			  {
				"x": 9730.767121199999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 60,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 66243.375,
				"timing": 208.3125
			  },
			  {
				"x": 9758.8998046,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 64,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 66451.6875,
				"timing": 208.3125
			  },
			  {
				"x": 9800.923327999999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 41,
					"gain": 1,
					"duration": 1666.5
				  }
				],
				"timestamp": 66660,
				"timing": 208.3125
			  },
			  {
				"x": 9836.6561786,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 53,
					"gain": 1,
					"duration": 1458.1875
				  }
				],
				"timestamp": 66868.3125,
				"timing": 624.9375
			  },
			  {
				"x": 9876.662109199999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 57,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 67076.625,
				"timing": 208.3125
			  },
			  {
				"x": 9904.6589198,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 60,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 67284.9375,
				"timing": 208.3125
			  },
			  {
				"x": 9932.6557304,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 64,
					"gain": 1,
					"duration": 208.3125
				  },
				  {
					"note": 53,
					"gain": 1,
					"duration": 0
				  }
				],
				"timestamp": 67493.25,
				"timing": 208.3125
			  },
			  {
				"x": 9960.652541,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 57,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 67701.5625,
				"timing": 208.3125
			  },
			  {
				"x": 9988.6493516,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 60,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 67909.875,
				"timing": 208.3125
			  },
			  {
				"x": 10016.646162199999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 64,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 68118.1875,
				"timing": 208.3125
			  },
			  {
				"x": 10043.533812799998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 41,
					"gain": 1,
					"duration": 1666.5
				  }
				],
				"timestamp": 68326.5,
				"timing": 208.3125
			  },
			  {
				"x": 10079.266663399998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 53,
					"gain": 1,
					"duration": 1458.1875
				  }
				],
				"timestamp": 68534.8125,
				"timing": 624.9375
			  },
			  {
				"x": 10119.272593999998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 57,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 68743.125,
				"timing": 208.3125
			  },
			  {
				"x": 10147.2694046,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 60,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 68951.4375,
				"timing": 208.3125
			  },
			  {
				"x": 10175.2662152,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 64,
					"gain": 1,
					"duration": 208.3125
				  },
				  {
					"note": 53,
					"gain": 1,
					"duration": 0
				  }
				],
				"timestamp": 69159.75,
				"timing": 208.3125
			  },
			  {
				"x": 10203.263025799999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 57,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 69368.0625,
				"timing": 208.3125
			  },
			  {
				"x": 10231.2598364,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 60,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 69576.375,
				"timing": 208.3125
			  },
			  {
				"x": 10259.256647,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 64,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 69784.6875,
				"timing": 208.3125
			  },
			  {
				"x": 10313.981577599998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 42,
					"gain": 1,
					"duration": 1666.5
				  }
				],
				"timestamp": 69993,
				"timing": 208.3125
			  },
			  {
				"x": 10350.002743699999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 48,
					"gain": 1,
					"duration": 1458.1875
				  }
				],
				"timestamp": 70201.3125,
				"timing": 624.9375
			  },
			  {
				"x": 10390.2969898,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 57,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 70409.625,
				"timing": 208.3125
			  },
			  {
				"x": 10418.582115899999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 60,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 70617.9375,
				"timing": 208.3125
			  },
			  {
				"x": 10458.309161999998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 63,
					"gain": 1,
					"duration": 208.3125
				  },
				  {
					"note": 48,
					"gain": 1,
					"duration": 0
				  }
				],
				"timestamp": 70826.25,
				"timing": 208.3125
			  },
			  {
				"x": 10486.594288099997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 57,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 71034.5625,
				"timing": 208.3125
			  },
			  {
				"x": 10514.879414199997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 60,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 71242.875,
				"timing": 208.3125
			  },
			  {
				"x": 10543.1645403,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 63,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 71451.1875,
				"timing": 208.3125
			  },
			  {
				"x": 10570.340506399998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 42,
					"gain": 1,
					"duration": 1666.5
				  }
				],
				"timestamp": 71659.5,
				"timing": 208.3125
			  },
			  {
				"x": 10606.361672499997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 48,
					"gain": 1,
					"duration": 1458.1875
				  }
				],
				"timestamp": 71867.8125,
				"timing": 624.9375
			  },
			  {
				"x": 10646.655918599998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 57,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 72076.125,
				"timing": 208.3125
			  },
			  {
				"x": 10674.9410447,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 60,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 72284.4375,
				"timing": 208.3125
			  },
			  {
				"x": 10703.226170799999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 63,
					"gain": 1,
					"duration": 208.3125
				  },
				  {
					"note": 48,
					"gain": 1,
					"duration": 0
				  }
				],
				"timestamp": 72492.75,
				"timing": 208.3125
			  },
			  {
				"x": 10731.511296899998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 57,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 72701.0625,
				"timing": 208.3125
			  },
			  {
				"x": 10759.796422999998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 60,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 72909.375,
				"timing": 208.3125
			  },
			  {
				"x": 10788.081549099998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 63,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 73117.6875,
				"timing": 208.3125
			  },
			  {
				"x": 10841.699435199998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 44,
					"gain": 1,
					"duration": 1666.5
				  }
				],
				"timestamp": 73326,
				"timing": 208.3125
			  },
			  {
				"x": 10877.568158599997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 53,
					"gain": 1,
					"duration": 1458.1875
				  }
				],
				"timestamp": 73534.3125,
				"timing": 624.9375
			  },
			  {
				"x": 10917.709961999999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 59,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 73742.625,
				"timing": 208.3125
			  },
			  {
				"x": 10945.842645399998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 60,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 73950.9375,
				"timing": 208.3125
			  },
			  {
				"x": 10973.975328799997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 62,
					"gain": 1,
					"duration": 208.3125
				  },
				  {
					"note": 53,
					"gain": 1,
					"duration": 0
				  }
				],
				"timestamp": 74159.25,
				"timing": 208.3125
			  },
			  {
				"x": 11002.108012199998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 59,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 74367.5625,
				"timing": 208.3125
			  },
			  {
				"x": 11030.240695599998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 60,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 74575.875,
				"timing": 208.3125
			  },
			  {
				"x": 11058.373378999997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 62,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 74784.1875,
				"timing": 208.3125
			  },
			  {
				"x": 11085.396902399998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 44,
					"gain": 1,
					"duration": 1666.5
				  }
				],
				"timestamp": 74992.5,
				"timing": 208.3125
			  },
			  {
				"x": 11121.265625799997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 53,
					"gain": 1,
					"duration": 1458.1875
				  }
				],
				"timestamp": 75200.8125,
				"timing": 624.9375
			  },
			  {
				"x": 11161.407429199999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 59,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 75409.125,
				"timing": 208.3125
			  },
			  {
				"x": 11189.540112599998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 60,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 75617.4375,
				"timing": 208.3125
			  },
			  {
				"x": 11217.672795999997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 62,
					"gain": 1,
					"duration": 208.3125
				  },
				  {
					"note": 53,
					"gain": 1,
					"duration": 0
				  }
				],
				"timestamp": 75825.75,
				"timing": 208.3125
			  },
			  {
				"x": 11245.805479399998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 59,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 76034.0625,
				"timing": 208.3125
			  },
			  {
				"x": 11273.938162799997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 60,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 76242.375,
				"timing": 208.3125
			  },
			  {
				"x": 11302.070846199997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 62,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 76450.6875,
				"timing": 208.3125
			  },
			  {
				"x": 11344.094369599998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 43,
					"gain": 1,
					"duration": 1666.5
				  }
				],
				"timestamp": 76659,
				"timing": 208.3125
			  },
			  {
				"x": 11379.827220199997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 53,
					"gain": 1,
					"duration": 1458.1875
				  }
				],
				"timestamp": 76867.3125,
				"timing": 624.9375
			  },
			  {
				"x": 11419.833150799997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 55,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 77075.625,
				"timing": 208.3125
			  },
			  {
				"x": 11447.829961399999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 59,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 77283.9375,
				"timing": 208.3125
			  },
			  {
				"x": 11475.826771999999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 62,
					"gain": 1,
					"duration": 208.3125
				  },
				  {
					"note": 53,
					"gain": 1,
					"duration": 0
				  }
				],
				"timestamp": 77492.25,
				"timing": 208.3125
			  },
			  {
				"x": 11503.823582599998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 55,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 77700.5625,
				"timing": 208.3125
			  },
			  {
				"x": 11531.820393199996,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 59,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 77908.875,
				"timing": 208.3125
			  },
			  {
				"x": 11559.817203799996,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 62,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 78117.1875,
				"timing": 208.3125
			  },
			  {
				"x": 11586.704854399997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 43,
					"gain": 1,
					"duration": 1666.5
				  }
				],
				"timestamp": 78325.5,
				"timing": 208.3125
			  },
			  {
				"x": 11622.437704999997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 53,
					"gain": 1,
					"duration": 1458.1875
				  }
				],
				"timestamp": 78533.8125,
				"timing": 624.9375
			  },
			  {
				"x": 11662.443635599997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 55,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 78742.125,
				"timing": 208.3125
			  },
			  {
				"x": 11690.440446199998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 59,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 78950.4375,
				"timing": 208.3125
			  },
			  {
				"x": 11718.437256799998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 62,
					"gain": 1,
					"duration": 208.3125
				  },
				  {
					"note": 53,
					"gain": 1,
					"duration": 0
				  }
				],
				"timestamp": 79158.75,
				"timing": 208.3125
			  },
			  {
				"x": 11746.434067399996,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 55,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 79367.0625,
				"timing": 208.3125
			  },
			  {
				"x": 11774.430877999996,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 59,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 79575.375,
				"timing": 208.3125
			  },
			  {
				"x": 11802.427688599997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 62,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 79783.6875,
				"timing": 208.3125
			  },
			  {
				"x": 11844.315339199999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 43,
					"gain": 1,
					"duration": 1666.5
				  }
				],
				"timestamp": 79992,
				"timing": 208.3125
			  },
			  {
				"x": 11880.048189799998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 52,
					"gain": 1,
					"duration": 1458.1875
				  }
				],
				"timestamp": 80200.3125,
				"timing": 624.9375
			  },
			  {
				"x": 11920.054120399998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 55,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 80408.625,
				"timing": 208.3125
			  },
			  {
				"x": 11948.050930999998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 60,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 80616.9375,
				"timing": 208.3125
			  },
			  {
				"x": 11976.047741599998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 64,
					"gain": 1,
					"duration": 208.3125
				  },
				  {
					"note": 52,
					"gain": 1,
					"duration": 0
				  }
				],
				"timestamp": 80825.25,
				"timing": 208.3125
			  },
			  {
				"x": 12004.044552199997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 55,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 81033.5625,
				"timing": 208.3125
			  },
			  {
				"x": 12032.041362799995,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 60,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 81241.875,
				"timing": 208.3125
			  },
			  {
				"x": 12060.038173399997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 64,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 81450.1875,
				"timing": 208.3125
			  },
			  {
				"x": 12086.925823999998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 43,
					"gain": 1,
					"duration": 1666.5
				  }
				],
				"timestamp": 81658.5,
				"timing": 208.3125
			  },
			  {
				"x": 12122.658674599998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 52,
					"gain": 1,
					"duration": 1458.1875
				  }
				],
				"timestamp": 81866.8125,
				"timing": 624.9375
			  },
			  {
				"x": 12162.664605199998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 55,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 82075.125,
				"timing": 208.3125
			  },
			  {
				"x": 12190.661415799997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 60,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 82283.4375,
				"timing": 208.3125
			  },
			  {
				"x": 12218.658226399999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 64,
					"gain": 1,
					"duration": 208.3125
				  },
				  {
					"note": 52,
					"gain": 1,
					"duration": 0
				  }
				],
				"timestamp": 82491.75,
				"timing": 208.3125
			  },
			  {
				"x": 12246.655036999997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 55,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 82700.0625,
				"timing": 208.3125
			  },
			  {
				"x": 12274.651847599996,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 60,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 82908.375,
				"timing": 208.3125
			  },
			  {
				"x": 12302.648658199996,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 64,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 83116.6875,
				"timing": 208.3125
			  },
			  {
				"x": 12344.536308799998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 43,
					"gain": 1,
					"duration": 1666.5
				  }
				],
				"timestamp": 83325,
				"timing": 208.3125
			  },
			  {
				"x": 12380.269159399997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 50,
					"gain": 1,
					"duration": 1458.1875
				  }
				],
				"timestamp": 83533.3125,
				"timing": 624.9375
			  },
			  {
				"x": 12420.275089999997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 55,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 83741.625,
				"timing": 208.3125
			  },
			  {
				"x": 12448.271900599997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 59,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 83949.9375,
				"timing": 208.3125
			  },
			  {
				"x": 12476.268711199999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 65,
					"gain": 1,
					"duration": 208.3125
				  },
				  {
					"note": 50,
					"gain": 1,
					"duration": 0
				  }
				],
				"timestamp": 84158.25,
				"timing": 208.3125
			  },
			  {
				"x": 12504.265521799998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 55,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 84366.5625,
				"timing": 208.3125
			  },
			  {
				"x": 12532.262332399996,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 59,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 84574.875,
				"timing": 208.3125
			  },
			  {
				"x": 12560.259142999996,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 65,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 84783.1875,
				"timing": 208.3125
			  },
			  {
				"x": 12587.146793599997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 43,
					"gain": 1,
					"duration": 1666.5
				  }
				],
				"timestamp": 84991.5,
				"timing": 208.3125
			  },
			  {
				"x": 12622.879644199998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 50,
					"gain": 1,
					"duration": 1458.1875
				  }
				],
				"timestamp": 85199.8125,
				"timing": 624.9375
			  },
			  {
				"x": 12662.885574799999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 55,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 85408.125,
				"timing": 208.3125
			  },
			  {
				"x": 12690.882385399998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 59,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 85616.4375,
				"timing": 208.3125
			  },
			  {
				"x": 12718.879195999998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 65,
					"gain": 1,
					"duration": 208.3125
				  },
				  {
					"note": 50,
					"gain": 1,
					"duration": 0
				  }
				],
				"timestamp": 85824.75,
				"timing": 208.3125
			  },
			  {
				"x": 12746.876006599996,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 55,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 86033.0625,
				"timing": 208.3125
			  },
			  {
				"x": 12774.872817199996,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 59,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 86241.375,
				"timing": 208.3125
			  },
			  {
				"x": 12802.869627799995,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 65,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 86449.6875,
				"timing": 208.3125
			  },
			  {
				"x": 12844.757278399997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 43,
					"gain": 1,
					"duration": 1666.5
				  }
				],
				"timestamp": 86658,
				"timing": 208.3125
			  },
			  {
				"x": 12892.220364499997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 51,
					"gain": 1,
					"duration": 1458.1875
				  }
				],
				"timestamp": 86866.3125,
				"timing": 624.9375
			  },
			  {
				"x": 12932.514610599996,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 57,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 87074.625,
				"timing": 208.3125
			  },
			  {
				"x": 12960.799736699995,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 60,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 87282.9375,
				"timing": 208.3125
			  },
			  {
				"x": 13001.922142799996,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 66,
					"gain": 1,
					"duration": 208.3125
				  },
				  {
					"note": 51,
					"gain": 1,
					"duration": 0
				  }
				],
				"timestamp": 87491.25,
				"timing": 208.3125
			  },
			  {
				"x": 13030.207268899996,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 57,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 87699.5625,
				"timing": 208.3125
			  },
			  {
				"x": 13058.492394999996,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 60,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 87907.875,
				"timing": 208.3125
			  },
			  {
				"x": 13086.777521099997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 66,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 88116.1875,
				"timing": 208.3125
			  },
			  {
				"x": 13113.953487199997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 43,
					"gain": 1,
					"duration": 1666.5
				  }
				],
				"timestamp": 88324.5,
				"timing": 208.3125
			  },
			  {
				"x": 13149.974653299996,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 51,
					"gain": 1,
					"duration": 1458.1875
				  }
				],
				"timestamp": 88532.8125,
				"timing": 624.9375
			  },
			  {
				"x": 13190.268899399996,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 57,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 88741.125,
				"timing": 208.3125
			  },
			  {
				"x": 13218.554025499998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 60,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 88949.4375,
				"timing": 208.3125
			  },
			  {
				"x": 13246.839151599997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 66,
					"gain": 1,
					"duration": 208.3125
				  },
				  {
					"note": 51,
					"gain": 1,
					"duration": 0
				  }
				],
				"timestamp": 89157.75,
				"timing": 208.3125
			  },
			  {
				"x": 13275.124277699997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 57,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 89366.0625,
				"timing": 208.3125
			  },
			  {
				"x": 13303.409403799997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 60,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 89574.375,
				"timing": 208.3125
			  },
			  {
				"x": 13331.694529899996,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 66,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 89782.6875,
				"timing": 208.3125
			  },
			  {
				"x": 13373.870495999998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 43,
					"gain": 1,
					"duration": 1666.5
				  }
				],
				"timestamp": 89991,
				"timing": 208.3125
			  },
			  {
				"x": 13409.603346599997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 52,
					"gain": 1,
					"duration": 1458.1875
				  }
				],
				"timestamp": 90199.3125,
				"timing": 624.9375
			  },
			  {
				"x": 13449.609277199997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 55,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 90407.625,
				"timing": 208.3125
			  },
			  {
				"x": 13477.606087799997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 60,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 90615.9375,
				"timing": 208.3125
			  },
			  {
				"x": 13505.602898399997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 67,
					"gain": 1,
					"duration": 208.3125
				  },
				  {
					"note": 52,
					"gain": 1,
					"duration": 0
				  }
				],
				"timestamp": 90824.25,
				"timing": 208.3125
			  },
			  {
				"x": 13533.599708999995,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 55,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 91032.5625,
				"timing": 208.3125
			  },
			  {
				"x": 13561.596519599996,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 60,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 91240.875,
				"timing": 208.3125
			  },
			  {
				"x": 13589.593330199996,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 67,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 91449.1875,
				"timing": 208.3125
			  },
			  {
				"x": 13616.480980799997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 43,
					"gain": 1,
					"duration": 1666.5
				  }
				],
				"timestamp": 91657.5,
				"timing": 208.3125
			  },
			  {
				"x": 13652.213831399997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 52,
					"gain": 1,
					"duration": 1458.1875
				  }
				],
				"timestamp": 91865.8125,
				"timing": 624.9375
			  },
			  {
				"x": 13692.219761999997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 55,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 92074.125,
				"timing": 208.3125
			  },
			  {
				"x": 13720.216572599998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 60,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 92282.4375,
				"timing": 208.3125
			  },
			  {
				"x": 13748.213383199998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 67,
					"gain": 1,
					"duration": 208.3125
				  },
				  {
					"note": 52,
					"gain": 1,
					"duration": 0
				  }
				],
				"timestamp": 92490.75,
				"timing": 208.3125
			  },
			  {
				"x": 13776.210193799998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 55,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 92699.0625,
				"timing": 208.3125
			  },
			  {
				"x": 13804.207004399996,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 60,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 92907.375,
				"timing": 208.3125
			  },
			  {
				"x": 13832.203814999995,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 67,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 93115.6875,
				"timing": 208.3125
			  },
			  {
				"x": 13874.091465599997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 43,
					"gain": 1,
					"duration": 1666.5
				  }
				],
				"timestamp": 93324,
				"timing": 208.3125
			  },
			  {
				"x": 13909.824316199996,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 50,
					"gain": 1,
					"duration": 1458.1875
				  }
				],
				"timestamp": 93532.3125,
				"timing": 624.9375
			  },
			  {
				"x": 13949.830246799997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 55,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 93740.625,
				"timing": 208.3125
			  },
			  {
				"x": 13977.827057399998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 60,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 93948.9375,
				"timing": 208.3125
			  },
			  {
				"x": 14005.823867999998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 65,
					"gain": 1,
					"duration": 208.3125
				  },
				  {
					"note": 50,
					"gain": 1,
					"duration": 0
				  }
				],
				"timestamp": 94157.25,
				"timing": 208.3125
			  },
			  {
				"x": 14033.820678599996,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 55,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 94365.5625,
				"timing": 208.3125
			  },
			  {
				"x": 14061.817489199995,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 60,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 94573.875,
				"timing": 208.3125
			  },
			  {
				"x": 14089.814299799997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 65,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 94782.1875,
				"timing": 208.3125
			  },
			  {
				"x": 14116.701950399998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 43,
					"gain": 1,
					"duration": 1666.5
				  }
				],
				"timestamp": 94990.5,
				"timing": 208.3125
			  },
			  {
				"x": 14152.434800999998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 50,
					"gain": 1,
					"duration": 1458.1875
				  }
				],
				"timestamp": 95198.8125,
				"timing": 624.9375
			  },
			  {
				"x": 14192.440731599998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 55,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 95407.125,
				"timing": 208.3125
			  },
			  {
				"x": 14220.437542199998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 60,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 95615.4375,
				"timing": 208.3125
			  },
			  {
				"x": 14248.434352799997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 65,
					"gain": 1,
					"duration": 208.3125
				  },
				  {
					"note": 50,
					"gain": 1,
					"duration": 0
				  }
				],
				"timestamp": 95823.75,
				"timing": 208.3125
			  },
			  {
				"x": 14276.431163399997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 55,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 96032.0625,
				"timing": 208.3125
			  },
			  {
				"x": 14304.427973999995,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 60,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 96240.375,
				"timing": 208.3125
			  },
			  {
				"x": 14332.424784599996,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 65,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 96448.6875,
				"timing": 208.3125
			  },
			  {
				"x": 14374.312435199998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 43,
					"gain": 1,
					"duration": 1666.5
				  }
				],
				"timestamp": 96657,
				"timing": 208.3125
			  },
			  {
				"x": 14410.045285799997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 50,
					"gain": 1,
					"duration": 1458.1875
				  }
				],
				"timestamp": 96865.3125,
				"timing": 624.9375
			  },
			  {
				"x": 14450.051216399997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 55,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 97073.625,
				"timing": 208.3125
			  },
			  {
				"x": 14478.048026999997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 59,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 97281.9375,
				"timing": 208.3125
			  },
			  {
				"x": 14506.044837599999,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 65,
					"gain": 1,
					"duration": 208.3125
				  },
				  {
					"note": 50,
					"gain": 1,
					"duration": 0
				  }
				],
				"timestamp": 97490.25,
				"timing": 208.3125
			  },
			  {
				"x": 14534.041648199996,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 55,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 97698.5625,
				"timing": 208.3125
			  },
			  {
				"x": 14562.038458799996,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 59,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 97906.875,
				"timing": 208.3125
			  },
			  {
				"x": 14590.035269399996,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 65,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 98115.1875,
				"timing": 208.3125
			  },
			  {
				"x": 14616.922919999997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 43,
					"gain": 1,
					"duration": 1666.5
				  }
				],
				"timestamp": 98323.5,
				"timing": 208.3125
			  },
			  {
				"x": 14652.655770599997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 50,
					"gain": 1,
					"duration": 1458.1875
				  }
				],
				"timestamp": 98531.8125,
				"timing": 624.9375
			  },
			  {
				"x": 14692.661701199997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 55,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 98740.125,
				"timing": 208.3125
			  },
			  {
				"x": 14720.658511799997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 59,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 98948.4375,
				"timing": 208.3125
			  },
			  {
				"x": 14748.655322399998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 65,
					"gain": 1,
					"duration": 208.3125
				  },
				  {
					"note": 50,
					"gain": 1,
					"duration": 0
				  }
				],
				"timestamp": 99156.75,
				"timing": 208.3125
			  },
			  {
				"x": 14776.652132999998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 55,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 99365.0625,
				"timing": 208.3125
			  },
			  {
				"x": 14804.648943599996,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 59,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 99573.375,
				"timing": 208.3125
			  },
			  {
				"x": 14832.645754199995,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 65,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 99781.6875,
				"timing": 208.3125
			  },
			  {
				"x": 14874.533404799997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 36,
					"gain": 1,
					"duration": 1666.5
				  }
				],
				"timestamp": 99990,
				"timing": 208.3125
			  },
			  {
				"x": 14910.402128199996,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 48,
					"gain": 1,
					"duration": 1458.1875
				  }
				],
				"timestamp": 100198.3125,
				"timing": 624.9375
			  },
			  {
				"x": 14950.543931599996,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 55,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 100406.625,
				"timing": 208.3125
			  },
			  {
				"x": 14990.118534999998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 58,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 100614.9375,
				"timing": 208.3125
			  },
			  {
				"x": 15018.251218399997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 64,
					"gain": 1,
					"duration": 208.3125
				  },
				  {
					"note": 48,
					"gain": 1,
					"duration": 0
				  }
				],
				"timestamp": 100823.25,
				"timing": 208.3125
			  },
			  {
				"x": 15046.383901799998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 55,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 101031.5625,
				"timing": 208.3125
			  },
			  {
				"x": 15074.516585199997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 58,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 101239.875,
				"timing": 208.3125
			  },
			  {
				"x": 15102.649268599997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 64,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 101448.1875,
				"timing": 208.3125
			  },
			  {
				"x": 15129.672791999998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 36,
					"gain": 1,
					"duration": 1666.5
				  }
				],
				"timestamp": 101656.5,
				"timing": 208.3125
			  },
			  {
				"x": 15165.541515399997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 48,
					"gain": 1,
					"duration": 1458.1875
				  }
				],
				"timestamp": 101864.8125,
				"timing": 624.9375
			  },
			  {
				"x": 15205.683318799998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 55,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 102073.125,
				"timing": 208.3125
			  },
			  {
				"x": 15233.816002199997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 58,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 102281.4375,
				"timing": 208.3125
			  },
			  {
				"x": 15261.948685599997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 64,
					"gain": 1,
					"duration": 208.3125
				  },
				  {
					"note": 48,
					"gain": 1,
					"duration": 0
				  }
				],
				"timestamp": 102489.75,
				"timing": 208.3125
			  },
			  {
				"x": 15290.081368999998,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 55,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 102698.0625,
				"timing": 208.3125
			  },
			  {
				"x": 15318.214052399997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 58,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 102906.375,
				"timing": 208.3125
			  },
			  {
				"x": 15346.346735799996,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 64,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 103114.6875,
				"timing": 208.3125
			  },
			  {
				"x": 15388.370259199997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 36,
					"gain": 1,
					"duration": 3333
				  }
				],
				"timestamp": 103323,
				"timing": 208.3125
			  },
			  {
				"x": 15424.774297299995,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 48,
					"gain": 1,
					"duration": 1458.1875
				  }
				],
				"timestamp": 103531.3125,
				"timing": 624.9375
			  },
			  {
				"x": 15465.451415399995,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 53,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 103739.625,
				"timing": 208.3125
			  },
			  {
				"x": 15494.119413499995,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 57,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 103947.9375,
				"timing": 208.3125
			  },
			  {
				"x": 15522.787411599995,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 60,
					"gain": 1,
					"duration": 208.3125
				  },
				  {
					"note": 48,
					"gain": 1,
					"duration": 0
				  }
				],
				"timestamp": 104156.25,
				"timing": 208.3125
			  },
			  {
				"x": 15551.455409699995,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 65,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 104364.5625,
				"timing": 208.3125
			  },
			  {
				"x": 15580.123407799994,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 60,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 104572.875,
				"timing": 208.3125
			  },
			  {
				"x": 15608.791405899996,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 57,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 104781.1875,
				"timing": 208.3125
			  },
			  {
				"x": 15637.459403999997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 60,
					"gain": 1,
					"duration": 208.3125
				  },
				  {
					"note": 36,
					"gain": 1,
					"duration": 0
				  },
				  {
					"note": 48,
					"gain": 1,
					"duration": 0
				  }
				],
				"timestamp": 104989.5,
				"timing": 208.3125
			  },
			  {
				"x": 15692.863402099994,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 57,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 105197.8125,
				"timing": 208.3125
			  },
			  {
				"x": 15721.531400199994,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 53,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 105406.125,
				"timing": 208.3125
			  },
			  {
				"x": 15750.199398299996,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 57,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 105614.4375,
				"timing": 208.3125
			  },
			  {
				"x": 15778.867396399997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 53,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 105822.75,
				"timing": 208.3125
			  },
			  {
				"x": 15807.535394499995,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 50,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 106031.0625,
				"timing": 208.3125
			  },
			  {
				"x": 15836.203392599997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 53,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 106239.375,
				"timing": 208.3125
			  },
			  {
				"x": 15864.871390699995,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 50,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 106447.6875,
				"timing": 208.3125
			  },
			  {
				"x": 15932.430228799996,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 36,
					"gain": 1,
					"duration": 3333
				  }
				],
				"timestamp": 106656,
				"timing": 208.3125
			  },
			  {
				"x": 15968.204276899996,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 47,
					"gain": 1,
					"duration": 1458.1875
				  }
				],
				"timestamp": 106864.3125,
				"timing": 624.9375
			  },
			  {
				"x": 16008.251404999995,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 67,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 107072.625,
				"timing": 208.3125
			  },
			  {
				"x": 16036.289413099996,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 71,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 107280.9375,
				"timing": 208.3125
			  },
			  {
				"x": 16064.327421199996,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 74,
					"gain": 1,
					"duration": 208.3125
				  },
				  {
					"note": 47,
					"gain": 1,
					"duration": 0
				  }
				],
				"timestamp": 107489.25,
				"timing": 208.3125
			  },
			  {
				"x": 16092.365429299996,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 77,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 107697.5625,
				"timing": 208.3125
			  },
			  {
				"x": 16120.403437399997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 74,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 107905.875,
				"timing": 208.3125
			  },
			  {
				"x": 16148.441445499995,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 71,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 108114.1875,
				"timing": 208.3125
			  },
			  {
				"x": 16176.479453599995,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 74,
					"gain": 1,
					"duration": 208.3125
				  },
				  {
					"note": 36,
					"gain": 1,
					"duration": 0
				  },
				  {
					"note": 47,
					"gain": 1,
					"duration": 0
				  }
				],
				"timestamp": 108322.5,
				"timing": 208.3125
			  },
			  {
				"x": 16204.517461699996,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 71,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 108530.8125,
				"timing": 208.3125
			  },
			  {
				"x": 16232.555469799994,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 67,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 108739.125,
				"timing": 208.3125
			  },
			  {
				"x": 16260.593477899994,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 71,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 108947.4375,
				"timing": 208.3125
			  },
			  {
				"x": 16288.631485999995,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 62,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 109155.75,
				"timing": 208.3125
			  },
			  {
				"x": 16316.669494099997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 65,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 109364.0625,
				"timing": 208.3125
			  },
			  {
				"x": 16344.707502199997,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 64,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 109572.375,
				"timing": 208.3125
			  },
			  {
				"x": 16372.745510299996,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 62,
					"gain": 1,
					"duration": 208.3125
				  }
				],
				"timestamp": 109780.6875,
				"timing": 208.3125
			  },
			  {
				"x": 16430.544598399996,
				"y": 108.4,
				"width": 30,
				"height": 144,
				"notes": [
				  {
					"note": 64,
					"gain": 1,
					"duration": 3333
				  },
				  {
					"note": 67,
					"gain": 1,
					"duration": 3333
				  },
				  {
					"note": 72,
					"gain": 1,
					"duration": 3333
				  },
				  {
					"note": 36,
					"gain": 1,
					"duration": 3333
				  },
				  {
					"note": 48,
					"gain": 1,
					"duration": 3333
				  }
				],
				"timestamp": 109989,
				"timing": 3333
			  }
			]
		  }`);
		const res2 = JSON.parse(`{
			"pageWidth": 37.01052279999999,
			"cursors": [
			  {
				"x": 112.48751999999999,
				"y": 105,
				"width": 30,
				"height": 120,
				"notes": [
				  {
					"note": 62,
					"gain": 1,
					"duration": 1000
				  },
				  {
					"note": 45,
					"gain": 1,
					"duration": 2000
				  }
				],
				"timestamp": 0,
				"timing": 1000
			  },
			  {
				"x": 152.87370140000002,
				"y": 105,
				"width": 30,
				"height": 120,
				"notes": [
				  {
					"note": 65,
					"gain": 1,
					"duration": 1000
				  }
				],
				"timestamp": 1000,
				"timing": 1000
			  },
			  {
				"x": 193.5266428,
				"y": 105,
				"width": 30,
				"height": 120,
				"notes": [],
				"timestamp": 2000,
				"timing": 2000
			  },
			  {
				"x": 271.5475256,
				"y": 105,
				"width": 30,
				"height": 120,
				"notes": [
				  {
					"note": 62,
					"gain": 1,
					"duration": 1000
				  },
				  {
					"note": 45,
					"gain": 1,
					"duration": 2000
				  }
				],
				"timestamp": 4000,
				"timing": 1000
			  },
			  {
				"x": 306.93923119999994,
				"y": 105,
				"width": 30,
				"height": 120,
				"notes": [
				  {
					"note": 65,
					"gain": 1,
					"duration": 1000
				  }
				],
				"timestamp": 5000,
				"timing": 1000
			  },
			  {
				"x": 342.33093679999996,
				"y": 105,
				"width": 30,
				"height": 120,
				"notes": [
				  {
					"note": 64,
					"gain": 1,
					"duration": 1000
				  },
				  {
					"note": 45,
					"gain": 1,
					"duration": 2000
				  }
				],
				"timestamp": 6000,
				"timing": 1000
			  },
			  {
				"x": 377.7226423999999,
				"y": 105,
				"width": 30,
				"height": 120,
				"notes": [
				  {
					"note": 62,
					"gain": 1,
					"duration": 1000
				  }
				],
				"timestamp": 7000,
				"timing": 1000
			  }
			]
		  }`);
		return {
			key: ['cursorInfos', songId],
			exec: async () => res2 as SongCursorInfos,
		}
	}
}
