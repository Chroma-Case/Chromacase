/* eslint-disable @typescript-eslint/no-var-requires */
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { Audio } from 'expo-av';

const notes = ["a0", "a1", "a2", "a3", "a4", "a5", "a6", "a7", "ab1", "ab2", "ab3", "ab4", "ab5", "ab6", "ab7", "b0", "b1", "b2", "b3", "b4", "b5", "b6", "b7", "bb0", "bb1", "bb2", "bb3", "bb4", "bb5", "bb6", "bb7", "c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "db1", "db2", "db3", "db4", "db5", "db6", "db7", "e1", "e2", "e3", "e4", "e5", "e6", "e7", "eb1", "eb2", "eb3", "eb4", "eb5", "eb6", "eb7", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "g1", "g2", "g3", "g4", "g5", "g6", "g7", "gb1", "gb2", "gb3", "gb4", "gb5", "gb6", "gb7"] as const;

type Sounds = Record<typeof notes[number], Audio.Sound>;

const SoundContext = createContext<Sounds | null>(null);

const SoundContextProvider = (props: { children: ReactNode }) => {
	const [sounds, setSounds] = useState<Sounds | null>(null);
	
	useEffect(() => {
		Promise.all(
			notes.map((note) => Audio.Sound.createAsync(require(`../assets/${note}.mp3`)).then((sound) => [note, sound] as const))
		).then((res) => setSounds(res.reduce((prev, curr) => ({ ...prev, [curr[0]]: curr[1] }), {} as Sounds)))
	}, [])
	return <SoundContext.Provider value={sounds}>
		{props.children}
	</SoundContext.Provider>

}

const usePiano = () => {
	const context = useContext(SoundContext);
	return { sounds: context }
}

export { usePiano, SoundContextProvider };
