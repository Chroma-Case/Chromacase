// create a simple phaser effect with a canvas that can be easily imported as a react component

import * as React from 'react';
import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { Asset, useAssets } from 'expo-asset';
import { use } from 'matter';

const b64data =
	'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAGKDAGaAAAFgUlEQVRYw7WXa2wUVRTH/20p7fZBW0p5iAplaUELCqEFlUCMYKwJKMYgaEwIUpQYNCIWRYgvQtTS6AeiKEqIQDBIAEFAEEm1DUVUoIqPVqhCC/IoammhC9vt/vywM7szu7NLLfHMl7n3nP/533vuPefMSHap8wNIoG57pxIYSErZDyCgB8qogTYUeKT+v2C+SlLanqA3v4EBwSdAasAI4CUUcA7wRsiBMbDIjQDQd4M0ogimtkrbMWSgAVzibUIouTIwfc4kJaVIkpT+PTxLiGplkHCo6Wq+uSOydlrYl3jD1xOSAQ5zdzcA1CJJK/ygOEk91kIhAMsQmeMDq9MRg7ojGExIINkrOAm8D4DHSg9QwiQApiDmeQzFWaDE2LUQ4DXjedimsAQaShgbqXj4NM4ISZpmVeTbdt6vGISrWtElfs76Fuig9+9hij7qFjbTs6GecEnxSdKa4DjbK0nFrzWFTI4yE/jVsvDsMaauP0JxX0ARviBgOg0A3GnZaVpO4N3llZRYYZrez8dhC/KRxrBVYSt37TPVgSh6GQN8FFxSQPLOqbsBSP3Wy2gLwJIRQcC91mPIOGyaTaTKARBxbllH7EtqZkJsgCRlvrTbF21JQiS3KN7pkFNH/BMOiJ+nq8vQTTNI8ChZnZabXJs7bxzf9zjAO/8kTLfNxynXwTpze6PlnG8/o16B+fzTfqCRgq1W62nXtYff1X1orjRiqzn2M8TgySlqAFjNuqDxFdIRKpWeag/Vo7zfJWXXei1ep3AaKDYDWypNvhLQnETk1+kWf/hC3iUrdGil0i3lAE8iRM/r1cpm3g0aNzAdgB8sACnvm8Bo0AuSLgLwKMeBQjosTEuCAJu0BSPgjsjo5WS0KyUM4Amqf6aO2cFRPUKU0cLAOhvgsgUAUM4u/PQz9lAGwC5/75eDgFlhAHuxKzNmynGtMwDtvMWOmIBahEjbYAACBWYCzY6A18kx3jI2WXolQJvRKMLqb6g5bbO0AnMPlbwSFdBrpwMA4FkOOwJ6mw08q/J8jChZnhtCR9HdfTo2IP6JyGQrfKbVGZBeETWdB723PwzQ/ZISr1IDchs9IcCtnasbWWMvCC3SNUhm2ophJ2raq9pyjycvjbju1yTje/604IzHllMXmH0256BGRBoPTipaO/jv4ktTPaNaC+rd02I5dqUsdTdUXiaGfOYbdKbPi2bnLkjLO3cszGJx+00fRLoemXlg1qkLVDOOxVyM6v4MM4kLlpQh6cObI22OIcatNh0nJj3X/8S2S3aTFhZwJ9/Z5raTZ71npZKUOWVxhPtDuBD5jZI7c+8DJ8/Giga7GcObzCMxMkFKJWlUYm6ztU0cYbihH7lccbv3cw9z+Tuq+yrG8gptNDGHBEcCSXGDjz7NDG6zWQyYLylhTyDSl1nK7VRYHLfxKmOpjCDcaH5dR5T1obPddekel9f95/BPs/ubwa+wB76acTzPRJ6hOWbYGnkEEb/wqlc96eu2CHAJ1cznLg5Fdf8lBQjxBqv87qbcx2MQJFd5HAjMyrSD0bxN6ABbWUiSQ9f4jQnNA7epjwNBSvWVGATmrX+M+xjjUGbLbHbtLLvU7w/dYf/0OrCV0ZTjjUEQ/WOxzJYh+QiRut5GkP6dz/jBms0kartA0ByWIekbbQQ9DnXYHG2gkIJOE7gc5jK32AgyavwOZ/A504N/AjG/px2entvtxf5Hoh5yByspZMN/JMjZbQ/RwRrf1W5RLZMY3Pkd7Ii8q5N71y9rae/CLbI/PY5qfKyk7ttvy13nj3aBIN6XslwZnW2TcX1KMlre8vk7RZB6QsVd7ccD3dUPXTwVhSCuI+lD80fi2iQhb1H+X5ssBEmn9KD+B7k54yut0XX/HfgvpUkmTvPggOsAAAAASUVORK5CYII=';

const getPianoScene = (partitionB64: string) => {
	class PianoScene extends Phaser.Scene {
		async preload() {
			// this.load.setBaseURL('http://labs.phaser.io');
			// this.load.setPath('content://assets/');
			// const imageData = await Asset.fromModule('./assets/raster-bw-64.png').downloadAsync();
			// this.load.image('raster', imageData.localUri);
		}

		create() {
			this.textures.addBase64('cursor', b64data);
			this.textures.addBase64('raster', partitionB64);

			// wait for the image to be loaded, then create the sprites
			this.textures.on('onload', () => {
				const raster = this.add.image(300, 400, 'raster');
				const group = this.add.group();

				group.createMultiple({ key: 'cursor', repeat: 8 });

				let ci = 0;
				const colors = [
					0xef658c, 0xff9a52, 0xffdf00, 0x31ef8c, 0x21dfff, 0x31aade, 0x5275de, 0x9c55ad,
					0xbd208c,
				];

				const _this = this;

				group.children.iterate((child) => {
					child.x = 100;
					child.y = 300;
					child.depth = 9 - ci;

					child.tint = colors[ci];

					ci++;

					_this.tweens.add({
						targets: child,
						x: 900,
						yoyo: true,
						repeat: -1,
						ease: 'Sine.easeInOut',
						duration: 1500,
						delay: 100 * ci,
					});
				});
			});
		}
	}
	return PianoScene;
};

type PianoCursorPosition = {
	// offset in pixels
	x: number;
	// timestamp in ms
	timing: number;
};

type PhaserCanvasProps = {
	partitionB64: string;
	cursorPositions: PianoCursorPosition[];
};

const PhaserCanvas = ({ partitionB64 }: PhaserCanvasProps) => {
	const [game, setGame] = React.useState<Phaser.Game | null>(null);

	useEffect(() => {
		const PianoScene = getPianoScene(partitionB64);

		const config = {
			type: Phaser.AUTO,
			parent: 'phaser-canvas',
			width: 1000,
			height: 900,
			scene: PianoScene,
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
