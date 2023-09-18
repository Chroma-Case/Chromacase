import { useEffect, useRef, useState } from 'react';
import { Slider, Switch, Text, View } from 'native-base';

export const Metronome = ({ paused = false, bpm }: { paused?: boolean; bpm: number }) => {
	const ref = useRef<HTMLAudioElement | null>(null);
	const enabled = useRef<boolean>(false);
	const volume = useRef<number>(50);

	useEffect(() => {
		if (paused) return;
		const int = setInterval(() => {
			console.log(enabled.current, volume.current);
			if (!enabled.current) return;
			if (!ref.current) ref.current = new Audio('/assets/metronome.mp3');
			ref.current.volume = volume.current / 100;
			ref.current.play();
		}, 60000 / bpm);
		return () => clearInterval(int);
	}, [bpm, paused]);
	return (
		<View>
			<Text>Metronome Settings</Text>
			<Text>Enabled:</Text>
			<Switch value={enabled.current} onToggle={() => (enabled.current = !enabled.current)} />
			<Text>Volume:</Text>
			<Slider
				maxWidth={'500px'}
				value={volume.current}
				onChange={(x) => (volume.current = x)}
			>
				<Slider.Track>
					<Slider.FilledTrack />
				</Slider.Track>
				<Slider.Thumb />
			</Slider>
		</View>
	);
};
