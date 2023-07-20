import * as React from 'react';
import PartitionView from './PartitionView';
import PhaserCanvas from './PartitionVisualizer/PhaserCanvas';
import { PianoCursorPosition } from './PartitionVisualizer/PhaserCanvas';

type PartitionCoordProps = {
	// The Buffer of the MusicXML file retreived from the API
	file: string;
	onPartitionReady: () => void;
	onEndReached: () => void;
	// Timestamp of the play session, in milisecond
	timestamp: number;
};

const PartitionCoord = ({
	file,
	onPartitionReady,
	onEndReached,
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
					onEndReached={onEndReached}
					timestamp={timestamp}
				/>
			)}
			{partitionData && (
				<PhaserCanvas
					partitionB64={partitionData?.[0]}
					cursorPositions={partitionData?.[1]}
				/>
			)}
		</>
	);
};

export default PartitionCoord;
