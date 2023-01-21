import {
	useTheme,
	Box,
	Image,
	PresenceTransition,
	Row,
	ZStack,
} from "native-base";
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
				<PresenceTransition
					visible={true}
					onTransitionComplete={(s) => {
						console.log(s);
						//setCurrent(trsize + 500);
						setPlaying(false);
					}}
					initial={{ translateX: 0 }}
					animate={{ translateX: trsize, transition: { duration: 1000 } }}
					exit={{ translateX: 1500, transition: { duration: 1500 } }}
				>
					<Row>
						{sources.map((source, index) => (
							<Image
								source={{ uri: source }}
								alt="image"
								resizeMode="cover"
								height={200}
								width={500}
							/>
						))}
					</Row>
				</PresenceTransition>
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
