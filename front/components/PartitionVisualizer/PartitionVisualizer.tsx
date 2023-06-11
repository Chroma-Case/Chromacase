import { useTheme, Box, Center } from "native-base";
import React from "react";
import { useQuery } from "react-query";
import LoadingComponent, { LoadingView } from "../Loading";
import SlideView from "./SlideView";
import API from "../../API";

type PartitionVisualizerProps = {
	songId: number;
};

const PartitionVisualizer = ({ songId }: PartitionVisualizerProps) => {
	return <></>;
};

export default PartitionVisualizer;
