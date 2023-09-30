import { View } from 'react-native';
import { Center, ScrollView } from 'native-base';
import TabNavigationButton from './TabNavigationButton';
import { NaviTab } from './TabNavigation';

type TabNavigationPhoneProps = {
	tabs: NaviTab[];
	activeTabID: string;
	setActiveTabID: (id: string) => void;
	children?: React.ReactNode;
};

const TabNavigationPhone = (props: TabNavigationPhoneProps) => {
	return (
		<View
			style={{
				width: '100%',
				height: '100%',
				display: 'flex',
				flexDirection: 'column-reverse',
			}}
		>
			<View
				style={{
					padding: 16,
					height: 90,
					width: '100%',
				}}
			>
				<Center>
					<View
						style={{
							display: 'flex',
							padding: 8,
							justifyContent: 'space-evenly',
							flexDirection: 'row',
							alignItems: 'center',
							alignSelf: 'stretch',
							borderRadius: 8,
							backgroundColor: 'rgba(16, 16, 20, 0.5)',
						}}
					>
						{props.tabs.map((tab) => (
							<View key={'navigation-button-phone-' + tab.label}>
								<TabNavigationButton
									icon={tab.icon}
									label={tab.label}
									onPress={tab.onPress}
									onLongPress={tab.onLongPress}
									isActive={tab.id === props.activeTabID}
									isCollapsed={tab.id != props.activeTabID}
								/>
							</View>
						))}
					</View>
				</Center>
			</View>
			<ScrollView
				// @ts-expect-error Raw CSS
				style={{
					width: '100%',
					height: 'calc(100% - 90px)',
				}}
			>
				{props.children}
			</ScrollView>
		</View>
	);
};

export default TabNavigationPhone;
