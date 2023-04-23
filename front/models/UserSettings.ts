interface UserSettings {
    notifications: {
        pushNotif: boolean,
        emailNotif: boolean,
        trainNotif: boolean,
        newSongNotif: boolean
    },
    weeklyReport: boolean,
    leaderBoard: boolean,
    showActivity: boolean,
	recommendations: boolean
}

export default UserSettings