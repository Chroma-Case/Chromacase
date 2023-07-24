// create a simple phaser effect with a canvas that can be easily imported as a react component

import * as React from 'react';
import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import useColorScheme from '../../hooks/colorScheme';
import { PartitionContext } from '../../views/PlayView';
import { on } from 'events';

let globalTimestamp = 0;
let globalStatus: 'playing' | 'paused' | 'stopped' = 'playing';

const getPianoScene = (
	partitionB64: string,
	cursorPositions: PianoCursorPosition[],
	onEndReached: () => void,
	colorScheme: 'light' | 'dark'
) => {
	class PianoScene extends Phaser.Scene {
		async preload() {}

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
				const cP = cursorPositions.findLast((cP, idx) => {
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
					const tw = {
						targets: this!.cursor,
						x: cP!.x,
						duration: transitionTime,
						ease: 'Sine.easeInOut',
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

export type PianoCursorPosition = {
	// offset in pixels
	x: number;
	// timestamp in ms
	timing: number;
	timestamp: number;
	notes: any[];
};

export type UpdateInfo = {
	currentTimestamp: number;
	status: 'playing' | 'paused' | 'stopped';
};

export type PhaserCanvasProps = {
	partitionB64: string;
	cursorPositions: PianoCursorPosition[];
	onEndReached: () => void;
};

const PhaserCanvas = ({
	partitionB64,
	cursorPositions,
	onEndReached,
}: PhaserCanvasProps) => {
	const colorScheme = useColorScheme();
	const { timestamp } = React.useContext(PartitionContext);
	const [game, setGame] = React.useState<Phaser.Game | null>(null);

	globalTimestamp = timestamp;
	useEffect(() => {
		const pianoScene = getPianoScene(partitionB64, cursorPositions, onEndReached, colorScheme);

		const config = {
			type: Phaser.AUTO,
			parent: 'phaser-canvas',
			width: 1000,
			height: 400,
			scene: pianoScene,
			scale: {
				mode: Phaser.Scale.FIT,
				autoCenter: Phaser.Scale.CENTER_BOTH,
			},
		};

		setGame(new Phaser.Game(config));
	}, []);

	return <div id="phaser-canvas"></div>;
};

export default PhaserCanvas;
