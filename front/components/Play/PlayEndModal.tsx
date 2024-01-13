import PopupCC from '../UI/PopupCC';
import { shouldEndAtom } from './PlayViewControlBar';
import { partitionStateAtom } from './PartitionMagic';
import ScoreModal from '../ScoreModal';
import { useAtom } from 'jotai';

export const PlayEndModal = () => {
	const [shouldEnd] = useAtom(shouldEndAtom);
	const [partitionState] = useAtom(partitionStateAtom);

	const isEnd = shouldEnd || partitionState === 'ended';
	return (
		<PopupCC isVisible={isEnd}>
			<ScoreModal
				songId={0}
				overallScore={0}
				precision={0}
				score={{
					max_score: 0,
					missed: 0,
					wrong: 0,
					good: 0,
					great: 0,
					perfect: 0,
					current_streak: 0,
					max_streak: 0,
				}}
			/>
		</PopupCC>
	);
};
