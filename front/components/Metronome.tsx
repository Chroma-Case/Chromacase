/* eslint-disable @typescript-eslint/no-var-requires */
import { useEffect, useRef } from 'react';
import { Slider, Switch, Text, View } from 'native-base';
import { Audio } from 'expo-av';

export const Metronome = ({ paused = false, bpm }: { paused?: boolean; bpm: number }) => {
	const audio = useRef<Audio.Sound | null>(null);
	const enabled = useRef<boolean>(false);
	const volume = useRef<number>(50);

	useEffect(() => {
		if (!enabled) {
			return;
		} else if (!audio.current) {
			Audio.Sound.createAsync(require('../assets/metronome.mp3'))
			.then((a) => {
				audio.current = a.sound;
			})
		}
		return () => {
			audio.current?.unloadAsync();
		}
	}, [enabled]);
	useEffect(() => {
		if (paused) return;
		const int = setInterval(() => {
			if (!enabled.current) return;
			if (!audio.current) return;
			audio.current?.playAsync();
		}, 60000 / bpm);
		return () => clearInterval(int);
	}, [bpm, paused]);

	useEffect(() => {
		audio.current?.setVolumeAsync(volume.current / 100);
	}, [volume.current]);
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
