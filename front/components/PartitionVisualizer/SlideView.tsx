import {
	useTheme,
	Box,
	Image,
	PresenceTransition,
	Row,
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
			<Box overflow={"hidden"} maxWidth={750} paddingLeft={250}>
				<MotiView
					from={{ translateX: 0 }}
					animate={{ translateX: -1000 }}
					transition={{
						translateX: {
							delay: 1000,
						}
					}}
				>
					<Row>
						{sources.map((source, index) => (
							<Image
								key={index}
								source={{ uri: source }}
								alt="image"
								resizeMode="cover"
								height={200}
								width={500}
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
	);
};

export default SlideView;
