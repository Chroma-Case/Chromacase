import * as React from 'react';
import PartitionView from './PartitionView';
import PhaserCanvas from './PartitionVisualizer/PhaserCanvas';
import { PianoCursorPosition } from './PartitionVisualizer/PhaserCanvas';

type PartitionCoordProps = {
	// The Buffer of the MusicXML file retreived from the API
	file: string;
	onPartitionReady: () => void;
	onEndReached: () => void;
	onResume: () => void;
	onPause: () => void;
	// Timestamp of the play session, in milisecond
	timestamp: number;
};

const PartitionCoord = ({
	file,
	onPartitionReady,
	onEndReached,
	onPause,
	onResume,
	timestamp,
}: PartitionCoordProps) => {
	const [partitionData, setPartitionData] = React.useState<
		[string, PianoCursorPosition[]] | null
	>(null);

	return (
		<>
			{!partitionData && (
				<PartitionView
					file={file}
					onPartitionReady={(base64data, a) => {
						setPartitionData([base64data, a]);
						onPartitionReady();
					}}
					onEndReached={() => {
						console.log('osmd end reached');
					}}
					timestamp={timestamp}
				/>
			)}
			{partitionData && (
				<PhaserCanvas
					partitionB64={partitionData?.[0]}
					cursorPositions={partitionData?.[1]}
					timestamp={timestamp}
					onPause={onPause}
					onResume={onResume}
					onEndReached={() => {
						onEndReached();
					}}
				/>
			)}
		</>
	);
};

export default PartitionCoord;
