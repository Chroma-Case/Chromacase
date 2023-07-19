import * as React from 'react';
import PartitionView from './PartitionView';
import PhaserCanvas from './PartitionVisualizer/PhaserCanvas';

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
	const [partitionB64, setPartitionB64] = React.useState<string | null>(null);

	return (
		<>
			{!partitionB64 && (
				<PartitionView
					file={file}
					onPartitionReady={(base64data) => {
						setPartitionB64(base64data);
						onPartitionReady();
					}}
					onEndReached={onEndReached}
					timestamp={timestamp}
				/>
			)}
			{partitionB64 && <PhaserCanvas partitionB64={partitionB64} cursorPositions={[]} />}
		</>
	);
};

export default PartitionCoord;