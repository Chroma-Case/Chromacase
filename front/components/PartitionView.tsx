// Inspired from OSMD example project
// https://github.com/opensheetmusicdisplay/react-opensheetmusicdisplay/blob/master/src/lib/OpenSheetMusicDisplay.jsx
import React, { useEffect, useState } from 'react';
import { CursorType, Fraction, OpenSheetMusicDisplay as OSMD } from 'opensheetmusicdisplay';
import useColorScheme from '../hooks/colorScheme';
import { useWindowDimensions } from 'react-native';

type PartitionViewProps = {
	// The Buffer of the MusicXML file retreived from the API
	file: string;
	onPartitionReady: () => void;
	// Timestamp of the play session, in milisecond 
	timestamp: number;
}

const PartitionView = (props: PartitionViewProps) => {
	const WINDOW_SIZE = 4;
	const [osmd, setOsmd] = useState<OSMD>();
	const colorScheme = useColorScheme();
	const [currentWindowIndex, setCurrentWindowIndex] = useState(0);
	const dimensions = useWindowDimensions();
	const options = {
		darkMode: colorScheme == 'dark',
		drawComposer: false,
		drawCredits: false,
		drawLyrics: false,
		drawPartNames: false,
		// followCursor: true,
		cursorsOptions: [{ type: CursorType.Standard, color: 'green', alpha: 0.5, follow: true }],
		drawFromMeasureNumber: 1,
		drawUpToMeasureNumber: WINDOW_SIZE,
		stretchLastSystemLine: true,
		autoResize: false,
	}

	useEffect(() => {
		const _osmd = new OSMD('TROLOLOLOLOL', options);
		_osmd.load(props.file)
			.then(() => {
				_osmd.render();
				props.onPartitionReady();
				_osmd.cursor.show();
				console.log(_osmd.Sheet.DefaultStartTempoInBpm)		
			});
		setOsmd(_osmd);
	}, []);
	
	// Re-render manually (otherwise done by 'autoResize' option), to fix disappearing cursor
	useEffect(() => {
		if (osmd) {
			osmd.render();
			osmd.cursor.show();
		}
	}, [dimensions])


	useEffect(() => {
		if (!osmd) {
			return;
		}
		const currentTimestamp = new Fraction(props.timestamp, 1000, undefined, true);
		const currentMeasure = osmd.Sheet.getSourceMeasureFromTimeStamp(currentTimestamp);
		const cursorMeasure = osmd.cursor.NotesUnderCursor().at(0)!.SourceMeasure;
		const cursorMeasuresWindowIndex = new Fraction(cursorMeasure.measureListIndex, WINDOW_SIZE).WholeValue;
		const currentMeasuresWindowIndex = new Fraction(currentMeasure.measureListIndex, WINDOW_SIZE).WholeValue;
		// Move Measure Draw
		if (currentMeasuresWindowIndex != currentWindowIndex) {
			const nextFourMeasuresIndex = currentMeasure.measureListIndex + 1;
			console.log('Next Window Start Index', nextFourMeasuresIndex)
			osmd.setOptions({
				drawFromMeasureNumber: nextFourMeasuresIndex,
				drawUpToMeasureNumber: nextFourMeasuresIndex + WINDOW_SIZE - 1,
			});
			osmd.cursor.hide();
			osmd.render();
			osmd.cursor.resetIterator();
			osmd.cursor.show();
			setCurrentWindowIndex((idx) => idx + 1);
			// Update
		} else {
			while(osmd.cursor.NotesUnderCursor().at(0)!.getAbsoluteTimestamp().lt(currentTimestamp) && !osmd.cursor.iterator.EndReached) {
				osmd.cursor.next();
				osmd.cursor.show();
			}
		}
	}, [props.timestamp]);

	return (<div id="TROLOLOLOLOL" />);
}

export default PartitionView;
