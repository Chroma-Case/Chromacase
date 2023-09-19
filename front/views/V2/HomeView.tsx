import { View, Image } from 'react-native';
import { Text } from 'native-base';
import React from 'react';

const bigSideRatio = 100;
const smallSideRatio = 61;

const HomeView = () => {
	return (
		<View
			style={{
				width: '100%',
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			<View
				style={{
					width: '100%',
                    aspectRatio: 16 / 9,
				}}
			>
				<View
					style={{
						alignSelf: 'stretch',
						alignItems: 'stretch',
						flexDirection: 'row',
						display: 'flex',
						gap: '0px',
					}}
				>
					<View
						style={{
							flexGrow: bigSideRatio,
						}}
					>
						<Image
							source={{
								uri: 'https://media.discordapp.net/attachments/717080637038788731/1153688155292180560/image_homeview1.png',
							}}
							style={{
								aspectRatio: 1,
							}}
						/>
					</View>
					<View
						style={{
							flexGrow: smallSideRatio,
							height: '100%',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'stretch',
							gap: '0px',
						}}
					>
						<View
							style={{
								flexGrow: bigSideRatio,
							}}
						>
							<Image
								source={{
									uri: 'https://media.discordapp.net/attachments/717080637038788731/1153688154923090093/image_homeview2.png',
								}}
								style={{
									aspectRatio: 1,
								}}
							/>
						</View>
						<View
							style={{
								flexGrow: smallSideRatio,
								width: '100%',
								display: 'flex',
								flexDirection: 'row-reverse',
								alignItems: 'stretch',
								gap: '0px',
							}}
						>
							<View
								style={{
									flexGrow: bigSideRatio,
								}}
							>
								<Image
									source={{
										uri: 'https://media.discordapp.net/attachments/717080637038788731/1153688154499457096/image_homeview3.png',
									}}
									style={{
										aspectRatio: 1,
									}}
								/>
							</View>
							<View
								style={{
									flexGrow: smallSideRatio,
									height: '100%',
									display: 'flex',
									flexDirection: 'column-reverse',
									alignItems: 'stretch',
									gap: '0px',
								}}
							>
								<View
									style={{
										flexGrow: bigSideRatio,
									}}
								>
									<Image
										source={{
											uri: 'https://media.discordapp.net/attachments/717080637038788731/1153688154109394985/image_homeview4.png',
										}}
										style={{
											aspectRatio: 1,
										}}
									/>
								</View>
								<View
									style={{
										width: '100%',
										flexGrow: smallSideRatio,
									}}
								>
									<Text>More</Text>
								</View>
							</View>
						</View>
					</View>
				</View>
			</View>
			<View
				style={{
					flexShrink: 0,
					flexGrow: 0,
					flexBasis: '15%',
					width: '100%',
				}}
			>
				<Text>Footer</Text>
			</View>
		</View>
	);
};

export default HomeView;
