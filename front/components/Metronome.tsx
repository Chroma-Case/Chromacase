import { useEffect, useRef } from 'react';

export const Metronome = ({ paused = false, bpm }: { paused?: boolean; bpm: number }) => {
	const ref = useRef<HTMLAudioElement | null>(null);
	useEffect(() => {
		const int = setInterval(() => {
			if (!ref.current) ref.current = new Audio("/assets/metronome.mp3");
			ref.current.play();
		}, 60000 / bpm);
		return () => clearInterval(int);
	}, []);
	return null;
};
