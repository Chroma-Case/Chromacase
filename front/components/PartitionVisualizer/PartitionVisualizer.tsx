import { useTheme, Box, Center } from "native-base";
import React from "react";
import { useQuery } from "react-query";
import LoadingComponent from "../Loading";
import SlideView from "./SlideView";
import API from "../../API";

type PartitionVisualizerProps = {
	songId: number;
};

const PartitionVisualizer = ({ songId }: PartitionVisualizerProps) => {
	

	if (!partitionRessources.data) {
		return (
			<Center style={{ flexGrow: 1 }}>
				<LoadingComponent />
			</Center>
		);
	}
	return (
		
	);
};

export default PartitionVisualizer;
