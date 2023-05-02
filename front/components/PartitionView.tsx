// Inspired from OSMD example project
// https://github.com/opensheetmusicdisplay/react-opensheetmusicdisplay/blob/master/src/lib/OpenSheetMusicDisplay.jsx
import React, { useEffect, useState } from 'react';
import { CursorType, Fraction, OpenSheetMusicDisplay as OSMD, IOSMDOptions } from 'opensheetmusicdisplay';
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
	const [osmd, setOsmd] = useState<OSMD>();
	const colorScheme = useColorScheme();
	const dimensions = useWindowDimensions();
	const OSMD_DIV_ID = 'osmd-div';
	const options: IOSMDOptions = {
		darkMode: colorScheme == 'dark',
		drawComposer: false,
		drawCredits: false,
		drawLyrics: false,
		drawPartNames: false,
		followCursor: false,
		renderSingleHorizontalStaffline: true,
		cursorsOptions: [{ type: CursorType.Standard, color: 'green', alpha: 0.5, follow: false }],
		autoResize: false,
	}

	useEffect(() => {
		const _osmd = new OSMD(OSMD_DIV_ID, options);
		_osmd.load(props.file)
			.then(() => {
				_osmd.render();
				props.onPartitionReady();
				_osmd.cursor.show();
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
		let previousCursorPosition = -1;
		let currentCursorPosition = osmd.cursor.cursorElement.offsetLeft;
		while(osmd.cursor.NotesUnderCursor().at(0)!.getAbsoluteTimestamp().lt(currentTimestamp) && !osmd.cursor.iterator.EndReached) {
			previousCursorPosition = currentCursorPosition;
			osmd.cursor.next();
			osmd.cursor.show();
			currentCursorPosition = osmd.cursor.cursorElement.offsetLeft;
			document.getElementById(OSMD_DIV_ID).scrollBy(currentCursorPosition - previousCursorPosition, 0)
		}
	}, [props.timestamp]);

	return (<div id={OSMD_DIV_ID} style={{ width: '100%', overflow: 'hidden' }} />);
}

export default PartitionView;
