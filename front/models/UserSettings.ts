interface UserSettings {
    preferences: {
        deviceId: number,
        micVolume: number,
        theme: 'light' | 'dark' | 'system',
        lang: 'fr' | 'en' | 'sp',
        difficulty: 'beg' | 'inter' | 'pro',
        colorBlind: boolean
    },
    notifications: {
        pushNotif: boolean,
        emailNotif: boolean,
        trainNotif: boolean,
        newSongNotif: boolean
    },
    privacy: {
        dataCollection: boolean,
        customAdd: boolean,
        recommendation: boolean
    }
}

export default UserSettings