// create a simple phaser effect with a canvas that can be easily imported as a react component

import * as React from 'react';
import { useEffect, useContext } from 'react';
import { Dimensions } from 'react-native';
import Phaser from 'phaser';
import useColorScheme from '../../hooks/colorScheme';
import { RootState, useSelector } from '../../state/Store';
import { setSoundPlayer as setSPStore } from '../../state/SoundPlayerSlice';
import { useDispatch } from 'react-redux';
import { SplendidGrandPiano, CacheStorage } from 'smplr';
import { handlePianoGameMsg } from './PianoGameUpdateFunctions';
import { PianoCC } from '../../views/PlayView';
import { PianoCanvasMsg, PianoCursorNote, PianoCursorPosition } from '../../models/PianoGame';

let globalTimestamp = 0;
let globalPressedKeys: Map<number, number> = new Map();
// the messages are consummed from the end and new messages should be added at the end
let globalMessages: Array<PianoCanvasMsg> = [];
const globalStatus: 'playing' | 'paused' | 'stopped' = 'playing';

const isValidSoundPlayer = (soundPlayer: SplendidGrandPiano | undefined) => {
	return soundPlayer && soundPlayer.loaded;
};

const min = (a: number, b: number) => (a < b ? a : b);
const max = (a: number, b: number) => (a > b ? a : b);

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
		private emitter!: Phaser.GameObjects.Particles.ParticleEmitter;
		private nbTextureToload!: number;
		create() {
			this.textures.addBase64(
				'star',
				'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEQAAAApCAYAAACMeY82AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDE0IDc5LjE1Njc5NywgMjAxNC8wOC8yMC0wOTo1MzowMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjYyNzNEOEU4NzUxMzExRTRCN0ZCODQ1QUJCREFFQzA4IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjYyNzNEOEU5NzUxMzExRTRCN0ZCODQ1QUJCREFFQzA4Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NjI3M0Q4RTY3NTEzMTFFNEI3RkI4NDVBQkJEQUVDMDgiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NjI3M0Q4RTc3NTEzMTFFNEI3RkI4NDVBQkJEQUVDMDgiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4vDiTDAAAB4UlEQVR42uxagY2DMAw0VRdghayQFVghs3SF/1XaEdoVGIGswAj5OK0rkwfalx5wiY2smAik+OrYFxcAAWLABFQJazmAykCOEhZRx0sBYdLHS0VFk6omVU2qOwRktS1jwYY5QKSAslqEtNBWM0lVt4xUQERUmdrWSV+VZi27xVYZU1OimYyOmJTRDB58VVyE5BUJQYhJGZYGYzMH87nuqwuoRSRVdLyB5hcoWIZxjs9P2buT3LkI0PP+BKcQriEp2jjnwO0XjDFwUDFRouNXF5HoQlK0iwKDVw10/GzPdzBIoo1zBApF1prb57iUw/zQxkdkpY1rwNhoOQMDkhpt62wqw+ZisMTiOwNQqLu2VMWpxhggOcBbe/zwlTvKqTfZxDyJYyAAfEyPTTF2/1AcWj8Ye39fU98+geHlebBuvv4xX8Zal5WoCEGnvn1y/na5JQdz55aOkM3knRyS5xwpbcZ/BSG//2uVWTrB6uFOAjHjoT9GzIojZzlYdJaRQNcPW0cMby3OtRl32w950PbU2yAAiGPk22qL0rp4hOSlEkFAfvGi6RwenCXsLkLGfuUcDGKf/J2tIkTGv/9t/xaQxQDCzyPFJdU1AYns5kO3jKAPZhQQPctohHweIJK+D/kRYAAaWClvtE6otAAAAABJRU5ErkJggg=='
			);
			this.textures.addBase64('partition', partitionB64);
			this.cursorPositionsIdx = -1;
			// this is to prevent multiple initialisation of the scene
			this.nbTextureToload = 2;

			this.cameras.main.setBackgroundColor(colorScheme === 'light' ? '#FFFFFF' : '#000000');
			this.textures.on('onload', () => {
				this.nbTextureToload--;
				if (this.nbTextureToload > 0) return;
				this.partition = this.add.image(0, 0, 'partition').setOrigin(0, 0);
				this.cameras.main.setBounds(0, 0, this.partition.width, this.partition.height);
				console.log('canvas', this.partition.width, this.partition.height);

				const dims = this.partition.getBounds();
				// base ref normal cursor is 350px by 30px
				this.cursor = this.add
					.rectangle(0, 0, dims.height * 30 / 276, dims.height, 0x31ef8c, 0.5)
					.setOrigin(0, 0);
				this.cameras.main.startFollow(this.cursor, true, 0.05, 0.05);

				this.emitter = this.add.particles(0, 0, 'star', {
					lifespan: 700,
					duration: 100,
					follow: this.cursor,
					speed: { min: 10, max: 20 },
					scale: { start: 0, end: 0.4 },
					// rotate: { start: 0, end: 360 },
					emitZone: { type: 'edge', source: this.cursor.getBounds(), quantity: 50 },

					emitting: false,
				});
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
					if (globalPressedKeys.size > 0) {
						this.cursor.fillAlpha = 0.9;
					} else if (this.cursor) {
						this.cursor.fillAlpha = 0.5;
					}

					if (globalMessages.length > 0) {
						handlePianoGameMsg(globalMessages, this.emitter, undefined);
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

export type PhaserCanvasProps = {
	partitionDims: [number, number];
	partitionB64: string;
	cursorPositions: PianoCursorPosition[];
	onEndReached: () => void;
	onPause: () => void;
	onResume: () => void;
};

const PhaserCanvas = ({
	partitionDims,
	partitionB64,
	cursorPositions,
	onEndReached,
}: PhaserCanvasProps) => {
	const colorScheme = useColorScheme();
	const dispatch = useDispatch();
	const pianoCC = useContext(PianoCC);
	const soundPlayer = useSelector((state: RootState) => state.soundPlayer.soundPlayer);
	const [game, setGame] = React.useState<Phaser.Game | null>(null);

	globalTimestamp = pianoCC.timestamp;
	globalPressedKeys = pianoCC.pressedKeys;
	globalMessages = pianoCC.messages;

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
		const { width, height } = Dimensions.get('window');

		class UIScene extends Phaser.Scene {
			private statusTextValue: string;
			private statusText!: Phaser.GameObjects.Text;
			constructor() {
				super({ key: 'UIScene', active: true });

				this.statusTextValue = 'Score: 0 Streak: 0';
			}

			create() {
				this.statusText = this.add.text(
					this.cameras.main.width - 300,
					10,
					this.statusTextValue,
					{
						fontFamily: 'Arial',
						fontSize: 25,
						color: '#3A784B',
					}
				);
			}

			override update() {
				if (globalMessages.length > 0) {
					handlePianoGameMsg(globalMessages, undefined, this.statusText);
				}
			}
		}

		const config = {
			type: Phaser.AUTO,
			parent: 'phaser-canvas',
			width: max(width * 0.9, 850),
			height: min(max(height * 0.7, 400), partitionDims[1]),
			scene: [pianoScene, UIScene],
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
