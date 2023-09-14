import { NoteTiming, PianoCanvasMsg, PianoScoreInfo } from '../../models/PianoGame';

const handleNoteTimingMsg = (
	noteTiming: NoteTiming,
	emitter: Phaser.GameObjects.Particles.ParticleEmitter
) => {
	if (noteTiming === NoteTiming.Perfect) {
		// gold
		emitter.particleTint = 0xffd700;
		emitter.start(20);
	} else if (noteTiming === NoteTiming.Great) {
		emitter.particleTint = 0x00ffff;
		emitter.start(10);
	} else if (noteTiming === NoteTiming.Good) {
		// orange/brown
		emitter.particleTint = 0xffa500;
		emitter.start(5);
	} else if (noteTiming === NoteTiming.Missed) {
		emitter.particleTint = 0xff0000;
		emitter.start(5);
	} else if (noteTiming === NoteTiming.Wrong) {
		// maybe add some other effect
	}
};

const handleScoreMsg = (score: PianoScoreInfo, statusText: Phaser.GameObjects.Text) => {
	statusText.setText(`Score: ${score.score} Streak: ${score.streak}`);
};

const findAndRemove = <T>(arr: Array<T>, predicate: (el: T) => boolean): T | undefined => {
	const idx = arr.findIndex(predicate);
	if (idx === -1) {
		return undefined;
	}
	return arr.splice(idx, 1)[0];
};

export const handlePianoGameMsg = (
	msgs: Array<PianoCanvasMsg>,
	emitter: Phaser.GameObjects.Particles.ParticleEmitter | undefined,
	statusText: Phaser.GameObjects.Text | undefined
) => {
	// this is temporary way of hanlding messages it works ok but is laggy when
	// pressing a lot of keys in a short time I will be using phaser events in the future I think
	const msg = findAndRemove(msgs, (msg) => {
		if (emitter && msg.type === 'noteTiming') {
			return true;
		} else if (statusText && msg.type === 'scoreInfo') {
			return true;
		}
		return false;
	});
	if (msg) {
		if (msg.type === 'noteTiming') {
			handleNoteTimingMsg(msg.data as NoteTiming, emitter!);
		} else if (msg.type === 'scoreInfo') {
			handleScoreMsg(msg.data as PianoScoreInfo, statusText!);
		}
	}
};
