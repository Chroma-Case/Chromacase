import { useTheme, Box, Image, Row, Column, ZStack, Button } from "native-base";
import { MotiView, useDynamicAnimation } from "moti";
import { Easing } from "react-native-reanimated";
import React from "react";
import { count } from "console";

type ImgSlideViewProps = {
	sources: [url: string, width: number, height: number][];
	// number of pixels per second
	speed: number;
};

const range = (start: number, end: number, step: number) => {
	const arr = [];
	for (let i = start; i < end; i += step) {
		arr.push(i);
	}
	return arr;
};

const SlideView = ({ sources, speed }: ImgSlideViewProps) => {
	const [isPLaying, setPlaying] = React.useState(true);
	const totalWidth = sources.reduce((acc, [_, width]) => acc + width, 0);
	const computedDuration = (totalWidth / speed) * 1000;
	const animation = useDynamicAnimation(() => ({
		translateX: 0,
	}));

	let stepCount = 0;

	console.log("computedDuration", computedDuration);
	console.log("totalWidth", totalWidth);

	return (
		<Column>
			<ZStack>
				<Box overflow={"hidden"} maxWidth={750}>
					<MotiView
						state={animation}
						onDidAnimate={(
							styleProp,
							didAnimationFinish,
							maybeValue,
							{attemptedValue}
						) => {
							if (styleProp === "translateX" && didAnimationFinish) {
								console.log("attemptedValue", attemptedValue);
								stepCount++;
							}
						}}
					>
						<Row>
							{sources.map(([source, w, h], index) => (
								<Image
									key={index}
									source={{ uri: source }}
									alt="image"
									resizeMode="cover"
									height={h}
									width={w}
								/>
							))}
						</Row>
					</MotiView>
				</Box>
				<Box
					overflow={"hidden"}
					borderColor={"red.400"}
					borderWidth={10}
					width={300}
					height={200}
				/>
			</ZStack>
			<Button
				marginTop={500}
				onPress={() => {
					animation.animateTo({
						translateX: range(-totalWidth, 0, speed).reverse().slice(stepCount),
						transition: {
							type: "timing",
							easing: Easing.linear,
							duration: 1000,
						},
					});
				}}
			>
				Play
			</Button>
			<Button
				onPress={() => {
					console.log("pause", stepCount);
					animation.animateTo({});
				}}
			>
				Pause
			</Button>
			<Button
				onPress={() => {
					stepCount = 0;
					animation.animateTo({
						translateX: 0,
					});
				}}
			>
				Reset
			</Button>
		</Column>
	);
};

export default SlideView;
