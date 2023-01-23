import {
	useTheme,
	Box,
	Image,
	PresenceTransition,
	Column,
	ZStack,
} from "native-base";
import { MotiView } from "moti";
import React from "react";

type ImgSlideViewProps = {
	sources: string[];
};

const SlideView = ({ sources }: ImgSlideViewProps) => {
	const [trsize, setCurrent] = React.useState(-1500);
	const [isPLaying, setPlaying] = React.useState(true);
	return (
		<ZStack>
			<Box overflow={"hidden"}>
				<MotiView
					from={{ translateX: 0 }}
					animate={{ translateX: [1000, 1000, 1500] }}
					// transition={{
					// 	translateX: {
					// 		type: "timing",
					// 		duration: 15000,
					// 	}
					// }}
				>
					<Column>
						{sources.map((source, index) => (
							<Image
								key={index}
								source={{ uri: source }}
								alt="image"
								resizeMode="cover"
								width={"100%"}
							/>
						))}
					</Column>
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
	);
};

export default SlideView;
