import {
	useTheme,
	Box,
	Image,
	Row,
	Column,
	ZStack,
	Button,
	Icon,
} from "native-base";
import { MotiView, useDynamicAnimation } from "moti";
import { abs, Easing } from "react-native-reanimated";
import React from "react";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";

type ImgSlideViewProps = {
	sources: [url: string, width: number, height: number][];
	// number of pixels per second
	speed: number;
	// percentage of the partition
	startAt: number | null;
};

const range = (start: number, end: number, step: number) => {
	const arr = [];
	for (let i = start; i < end; i += step) {
		arr.push(i);
	}
	return arr;
};

const SlideView = ({ sources, speed, startAt }: ImgSlideViewProps) => {
	const totalWidth = sources.reduce((acc, [_, width]) => acc + width, 0);
	const stepSize = speed / 2;
	const stepDuration = 1000 / 2;
	const animation = useDynamicAnimation(() => ({
		translateX: 0,
	}));

	let stepCount = 0;

	if (startAt) {
		const nbPixelsToSkip = totalWidth * startAt;
		animation.animateTo({
			translateX: -nbPixelsToSkip,
			transition: {
				type: "timing",
				delay: 0,
				easing: Easing.linear,
			},
		});
		stepCount = Math.floor(nbPixelsToSkip / stepSize);
	}

	const jumpAt = (value: number, absolute: boolean) => {
		if (absolute && value < 0) value = 0;
		if (value > totalWidth) value = totalWidth;
		if (!absolute) {
			stepCount += Math.floor(value / stepSize);
		} else {
			stepCount = Math.floor(value / stepSize);
		}
		if (stepCount < 0) stepCount = 0;
		animation.animateTo({
			translateX: -(stepCount * stepSize),
		});
	};

	return (
		<Column>
			<Box overflow={"hidden"}>
				<MotiView
					state={animation}
					onDidAnimate={(
						styleProp,
						didAnimationFinish,
						_maybeValue,
						{ attemptedValue }
					) => {
						if (styleProp === "translateX" && didAnimationFinish) {
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
								resizeMode="contain"
								height={h}
								width={w}
							/>
						))}
					</Row>
				</MotiView>
			</Box>
			<Button.Group margin={3}>
				<Button
					leftIcon={<Icon as={FontAwesome5} name="play" size="sm" />}
					onPress={() => {
						animation.animateTo({
							translateX: range(-totalWidth, 0, stepSize)
								.reverse()
								.slice(stepCount),
							transition: {
								type: "timing",
								easing: Easing.linear,
								duration: stepDuration,
							},
						});
					}}
				/>
				<Button
					leftIcon={<Icon as={FontAwesome5} name="pause" size="sm" />}
					onPress={() => {
						animation.animateTo({});
					}}
				/>
				<Button
					leftIcon={
						<Icon as={MaterialCommunityIcons} name="rewind-10" size="sm" />
					}
					onPress={() => jumpAt(-200, false)}
				/>
				<Button
					leftIcon={
						<Icon
							as={MaterialCommunityIcons}
							name="fast-forward-10"
							size="sm"
						/>
					}
					onPress={() => jumpAt(200, false)}
				/>
				<Button
					leftIcon={<Icon as={FontAwesome5} name="stop" size="sm" />}
					onPress={() => {
						stepCount = 0;
						animation.animateTo({
							translateX: 0,
						});
					}}
				/>
			</Button.Group>
		</Column>
	);
};

export default SlideView;