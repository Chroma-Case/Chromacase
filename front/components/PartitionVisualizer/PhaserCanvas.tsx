// create a simple phaser effect with a canvas that can be easily imported as a react component

import * as React from 'react';
import { useEffect } from 'react';
import Phaser from 'phaser';
import useColorScheme from '../../hooks/colorScheme';
import { RootState, useSelector } from '../../state/Store';
import { setSoundPlayer as setSPStore } from '../../state/SoundPlayerSlice';
import { useDispatch } from 'react-redux';
import { SplendidGrandPiano, CacheStorage } from 'smplr';
import { Note } from 'opensheetmusicdisplay';

let globalTimestamp = 0;
const globalStatus: 'playing' | 'paused' | 'stopped' = 'playing';

const isValidSoundPlayer = (soundPlayer: SplendidGrandPiano | undefined) => {
	return soundPlayer && soundPlayer.loaded;
};

const myFindLast = <T,>(a: T[], p: (_: T, _2: number) => boolean) => {
	for (let i = a.length - 1; i >= 0; i--) {
		if (p(a[i]!, i)) {
			return a[i];
		}
	}
	return undefined;
};

const playNotes = (notes: PianoCursorNote[], soundPlayer: SplendidGrandPiano) => {
	notes.forEach(({ note, duration }) => {
		const fixedKey =
			note.ParentVoiceEntry.ParentVoice.Parent.SubInstruments.at(0)?.fixedKey ?? 0;
		const midiNumber = note.halfTone - fixedKey * 12;
		const gain = note.ParentVoiceEntry.ParentVoice.Volume;
		soundPlayer.start({ note: midiNumber, duration, velocity: gain * 127 });
	});
};

const getPianoScene = (
	partitionB64: string,
	cursorPositions: PianoCursorPosition[],
	onEndReached: () => void,
	soundPlayer: SplendidGrandPiano,
	colorScheme: 'light' | 'dark'
) => {
	class PianoScene extends Phaser.Scene {
		async preload() {}
		private cursorPositionsIdx = -1;
		private partition!: Phaser.GameObjects.Image;
		private cursor!: Phaser.GameObjects.Rectangle;
		create() {
			this.textures.addBase64('partition', partitionB64);
			this.cursorPositionsIdx = -1;

			this.cameras.main.setBackgroundColor(colorScheme === 'light' ? '#FFFFFF' : '#000000');
			this.textures.on('onload', () => {
				this.partition = this.add.image(0, 0, 'partition').setOrigin(0, 0);
				this.cameras.main.setBounds(0, 0, this.partition.width, this.partition.height);

				this.cursor = this.add.rectangle(0, 0, 30, 350, 0x31ef8c, 0.5).setOrigin(0, 0);
				this.cameras.main.startFollow(this.cursor, true, 0.05, 0.05);
			});
		}

		override update() {
			const currentTimestamp = globalTimestamp;
			const status = globalStatus;

			if (status === 'playing') {
				const transitionTime = 75;
				const cP = myFindLast(cursorPositions, (cP: { timestamp: number }, idx: number) => {
					if (
						cP.timestamp < currentTimestamp + transitionTime &&
						idx > this.cursorPositionsIdx
					) {
						this.cursorPositionsIdx = idx;
						return true;
					}
					return false;
				});
				if (cP) {
					playNotes(cP.notes, soundPlayer);
					const tw = {
						targets: this!.cursor,
						x: cP!.x,
						duration: transitionTime,
						ease: 'Sine.easeInOut',
						onComplete: undefined as (() => void) | undefined,
					};
					if (this.cursorPositionsIdx === cursorPositions.length - 1) {
						tw.onComplete = () => {
							onEndReached();
						};
					}
					this.tweens.add(tw);
				}
			}
		}
	}
	return PianoScene;
};

type PianoCursorNote = {
	note: Note;
	duration: number;
};

export type PianoCursorPosition = {
	// offset in pixels
	x: number;
	// timestamp in ms
	timing: number;
	timestamp: number;
	notes: PianoCursorNote[];
};

export type UpdateInfo = {
	currentTimestamp: number;
	status: 'playing' | 'paused' | 'stopped';
};

export type PhaserCanvasProps = {
	partitionB64: string;
	cursorPositions: PianoCursorPosition[];
	onEndReached: () => void;
	onPause: () => void;
	onResume: () => void;
	// Timestamp of the play session, in milisecond
	timestamp: number;
};

const PhaserCanvas = ({
	partitionB64,
	cursorPositions,
	onEndReached,
	timestamp,
}: PhaserCanvasProps) => {
	const colorScheme = useColorScheme();
	const dispatch = useDispatch();
	const soundPlayer = useSelector((state: RootState) => state.soundPlayer.soundPlayer);
	const [game, setGame] = React.useState<Phaser.Game | null>(null);

	globalTimestamp = timestamp;

	useEffect(() => {
		if (isValidSoundPlayer(soundPlayer)) {
			return;
		}
		new SplendidGrandPiano(new AudioContext(), {
			storage: new CacheStorage(),
		})
			.loaded()
			.then((sp) => {
				dispatch(setSPStore(sp));
			});
	}, []);

	useEffect(() => {
		if (!isValidSoundPlayer(soundPlayer) || !soundPlayer) return;
		const pianoScene = getPianoScene(
			partitionB64,
			cursorPositions,
			onEndReached,
			soundPlayer,
			colorScheme
		);

		const config = {
			type: Phaser.AUTO,
			parent: 'phaser-canvas',
			width: 1000,
			height: 400,
			scene: pianoScene,
			scale: {
				mode: Phaser.Scale.FIT,
				autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
			},
		};

		setGame(new Phaser.Game(config));
		return () => {
			if (game) {
				// currently the condition is always false
				game.destroy(true);
			}
		};
	}, [soundPlayer]);

	return <div id="phaser-canvas"></div>;
};

export default PhaserCanvas;
