import { NoteTiming, PianoCanvasMsg } from '../../models/PianoGame';

const handleNoteTimingMsg = (
	noteTiming: NoteTiming,
	emitter: Phaser.GameObjects.Particles.ParticleEmitter
) => {
	if (noteTiming === NoteTiming.Perfect) {
		emitter.particleTint = 0x00ff00;
		emitter.start(10);
	} else if (noteTiming === NoteTiming.Great) {
		emitter.particleTint = 0x00ffff;
		emitter.start(5);
	} else if (noteTiming === NoteTiming.Good) {
		emitter.particleTint = 0xffff00;
		emitter.start(3);
	} else if (noteTiming === NoteTiming.Missed) {
		emitter.particleTint = 0xff0000;
		emitter.start(1);
	} else if (noteTiming === NoteTiming.Wrong) {
		// maybe add some other effect
	}
};

export const handlePianoGameMsg = (
	msgs: Array<PianoCanvasMsg>,
	emitter: Phaser.GameObjects.Particles.ParticleEmitter
) => {
	const msg = msgs.shift();
	if (msg) {
		if (msg.type === 'noteTiming') {
			handleNoteTimingMsg(msg.data as NoteTiming, emitter);
		}
	}
};
