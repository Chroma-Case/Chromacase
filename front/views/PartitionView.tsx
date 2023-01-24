import React from "react";
import { Box } from "native-base";
import API from "../API";
import PartitionVisualizer from "../components/PartitionVisualizer/PartitionVisualizer";

const PartitionView = () => {

	return (
		<Box style={{ padding: 10 }}>
			<PartitionVisualizer songId={1} />
		</Box>
	);
};

export default PartitionView;
