interface LocalSettings {
	deviceId: number,
    micVolume: number,
    colorScheme: 'light' | 'dark' | 'system',
    lang: 'fr' | 'en' | 'sp',
    difficulty: 'beg' | 'inter' | 'pro',
    colorBlind: boolean,
	customAds: boolean,
	dataCollection: boolean
}