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
import Constants from 'expo-constants';
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
import { base64ToBlob } from 'file64';
import { ImagePickerAsset } from 'expo-image-picker';

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
		process.env.NODE_ENV != 'development' && Platform.OS === 'web'
			? '/api'
			: Constants.manifest?.extra?.apiUrl;
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
				console.log(await response.json());
				throw new APIError(response.statusText, response.status);
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
				throw new APIError(response.statusText ?? body, response.status);
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
		const data = await API.fetch(
			{
				route: `/auth/me/likes${songId}`,
				method: 'POST',
				body: {
					songId: songId
				}
			}
		)
	}

	public static getLikedSongs(): Query<likedSong[]> {
		return {
			key: ['liked songs'],
			exec: () =>
				API.fetch(
					{
						route: '/auth/me/likes',
					},
					{ handler: ListHandler(LikedSongHandler)}
				),
		};
	}

		public static getUserPlaayHistory(): Query<SongHistoryItem[]> {
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
}
