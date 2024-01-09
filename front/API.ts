import Artist, { ArtistHandler } from './models/Artist';
import Album from './models/Album';
import Chapter from './models/Chapter';
import Lesson from './models/Lesson';
import Genre, { GenreHandler } from './models/Genre';
import LessonHistory from './models/LessonHistory';
import { LikedSong, LikedSongHandler } from './models/LikedSong';
import Song, { SongHandler, SongInclude } from './models/Song';
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

function getBaseAPIUrl() {
	if (Platform.OS === 'web') {
		if (__DEV__ && process.env.EXPO_PUBLIC_API_URL) {
			return process.env.EXPO_PUBLIC_API_URL;
		}
		return '/api';
	}
	console.log(process.env.EXPO_PUBLIC_API_URL);
	if (process.env.EXPO_PUBLIC_API_URL) {
		return process.env.EXPO_PUBLIC_API_URL;
	}
	// fallback since some mobile build seems to not have the env variable
	return 'https://nightly.chroma.octohub.app/api';
}

export default class API {
	public static readonly baseUrl = getBaseAPIUrl();
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
		if (!response.ok) {
			throw new APIError(response.statusText ?? body, response.status, 'unknownError');
		}
		try {
			const jsonResponse = JSON.parse(body);
			const validated = await handler.validator.validate(jsonResponse).catch((e) => {
				if (e instanceof yup.ValidationError) {
					console.error(e, 'Got: ' + body);
					throw new ValidationError(e.message);
				}
				throw e;
			});
			if (!handler.transformer) return handler.validator.cast(validated);
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

	public static getAllSongs(include?: SongInclude[]): Query<Song[]> {
		include ??= [];
		return {
			key: ['songs', include],
			exec: () =>
				API.fetch(
					{
						route: `/song?include=${include!.join(',')}`,
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
	public static getSong(songId: number, include?: SongInclude[]): Query<Song> {
		include ??= [];
		return {
			key: ['song', songId, include],
			exec: async () =>
				API.fetch(
					{
						route: `/song/${songId}?include=${include!.join(',')}`,
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
	public static getSongsByGenre(genreId: number, includes?: SongInclude[]): Query<Song[]> {
		includes ??= [];

		return {
			key: ['genre', genreId, 'songs', includes],
			exec: () =>
				API.fetch(
					{
						route: `/song?genreId=${genreId}&includes=${includes!.join(',')}`,
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

	public static getAllGenres(): Query<Genre[]> {
		return {
			key: ['genres'],
			exec: () =>
				API.fetch(
					{
						route: '/genre',
					},
					{ handler: PlageHandler(GenreHandler) }
				).then(({ data }) => data),
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

	public static getAllArtists(): Query<Artist[]> {
		return {
			key: ['artists'],
			exec: () =>
				API.fetch(
					{
						route: `/artist`,
					},
					{ handler: PlageHandler(ArtistHandler) }
				).then(({ data }) => data),
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
	public static getSongSuggestions(include?: SongInclude[]): Query<Song[]> {
		return API.getAllSongs(include);
	}

	/**
	 * Retrieve the authenticated user's play history
	 * * @returns an array of songs
	 */
	public static getUserPlayHistory(include?: SongInclude[]): Query<SongHistoryItem[]> {
		include ??= [];
		return {
			key: ['history', include],
			exec: () =>
				API.fetch(
					{
						route: `/history?include=${include!.join(',')}`,
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

	public static getLikedSongs(include?: SongInclude[]): Query<LikedSong[]> {
		include ??= [];
		return {
			key: ['liked songs', include],
			exec: () =>
				API.fetch(
					{
						route: `/auth/me/likes?include=${include!.join(',')}`,
					},
					{ handler: ListHandler(LikedSongHandler) }
				),
		};
	}

	public static async updateUserTotalScore(score: number): Promise<void> {
		await API.fetch({
			route: `/auth/me/score/${score}`,
			method: 'PATCH',
		});
	}

	public static getTopTwentyPlayers(): Query<User[]> {
		return {
			key: ['score'],
			exec: () =>
				API.fetch(
					{
						route: '/scores/top/20',
						method: 'GET',
					},
					{ handler: ListHandler(UserHandler) }
				),
		};
	}
	public static getSongCursorInfos(songId: number): Query<SongCursorInfos> {
		return {
			key: ['cursorInfos', songId],
			exec: () => {
				return API.fetch(
					{
						route: `/song/${songId}/assets/cursors`,
					},
					{ handler: SongCursorInfosHandler }
				);
			},
		};
	}

	public static getPartitionSvgUrl(songId: number): string {
		return `${API.baseUrl}/song/${songId}/assets/partition`;
	}

	public static getPartitionMelodyUrl(songId: number): string {
		// return 'https://cdn.discordapp.com/attachments/717080637038788731/1193948941914488862/Short1.mp3?ex=65ae929a&is=659c1d9a&hm=ea21e4b67f8f04388b67fe70e8de11e0110a1ac5c9b13714e21d921a08300992&';
		return `${API.baseUrl}/song/${songId}/assets/melody`;
	}
}
