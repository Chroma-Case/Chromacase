import * as React from 'react';
import PartitionView from './PartitionView';
import PhaserCanvas from './PartitionVisualizer/PhaserCanvas';
import { PianoCursorPosition } from '../models/PianoGame';

type PartitionCoordProps = {
	// The Buffer of the MusicXML file retreived from the API
	file: string;
	onPartitionReady: () => void;
	onEndReached: () => void;
	onResume: () => void;
	onPause: () => void;
};

const PartitionCoord = ({
	file,
	onPartitionReady,
	onEndReached,
	onPause,
	onResume,
}: PartitionCoordProps) => {
	const [partitionData, setPartitionData] = React.useState<
		[[number, number], string, PianoCursorPosition[]] | null
	>(null);

	return (
		<>
			{!partitionData && (
				<PartitionView
					file={file}
					onPartitionReady={(dims, base64data, a) => {
						setPartitionData([dims, base64data, a]);
						onPartitionReady();
					}}
					onEndReached={() => {
						console.log('osmd end reached');
					}}
					timestamp={0}
				/>
			)}
			{partitionData && (
				<PhaserCanvas
					partitionDims={partitionData?.[0]}
					partitionB64={partitionData?.[1]}
					cursorPositions={partitionData?.[2]}
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
