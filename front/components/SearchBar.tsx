import React, { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { HStack, Icon, Input, VStack, Button, ScrollView, Box, Menu } from "native-base";

export type SearchBarFilter = {
	name: string; //mandatory determines the label of the filter
	componentType: 'retrieved-list' | 'provided-list' | 'search-list'; //mandatory determines the type of selection of filter
	options?: any; //depends on the component type
	type: 'artist' | 'date' | 'genre' | 'album' | 'fav'; //mandatory
	icon?: string; //not mandatory, obsolete
	searchCallBack: any;
}

type RawSearchBarProps = {
	placeHolder: string;
	filters: SearchBarFilter[];
}

type SearchBarProps = {
	filters: SearchBarFilter[] //mandatory
	placeHolder: string; //mandatory
	variant?: string; //default primary
	compact?: boolean; //default false
	onChangeFilter: any;
	onChangeText: any;
}

const ProvidedFilterComponent = (props: SearchBarFilter) => {
	const [shouldOverlapWithTrigger] = React.useState(false);
	const [value, setValue] = React.useState(undefined);

	return (
		<Menu backgroundColor={'gray.300'} maxHeight={250} mt={1} w="160" shouldOverlapWithTrigger={shouldOverlapWithTrigger}
			placement={'bottom left'} trigger={triggerProps => {
				return <Button m={3} py={1} alignSelf="center" variant={"solid"} colorScheme={value ? 'primary' : 'gray'} {...triggerProps} endIcon={<Icon size="6" color="gray.400" as={<MaterialIcons name="keyboard-arrow-down" />}/>} >
					{value ? value : props.name}
				</Button>;
			}}>
			<Menu.Item onPress={() => setValue(undefined)} key="all">All</Menu.Item>
			{props.options.map((comp: any, index: any) => (
				<Menu.Item onPress={() => setValue(comp)} key={index}>{comp}</Menu.Item>
			))}
		</Menu>
	);
}

const RetrievedFilterComponent = (props: SearchBarFilter) => {
	const [shouldOverlapWithTrigger] = React.useState(false);
	const [value, setValue] = React.useState(undefined);

	return (
		<Menu backgroundColor={'gray.300'} maxHeight={250} mt={1} w="160" shouldOverlapWithTrigger={shouldOverlapWithTrigger}
			placement={'bottom left'} trigger={triggerProps => {
				return <Button m={3} py={1} alignSelf="center" variant={"solid"} colorScheme={value ? 'primary' : 'gray'} {...triggerProps} endIcon={<Icon size="6" color="gray.400" as={<MaterialIcons name="keyboard-arrow-down" />}/>} >
					{value ? value : props.name}
				</Button>;
			}}>
			<Menu.Item onPress={() => setValue(undefined)} key="all">All</Menu.Item>
			{props.options.map((comp: any, index: any) => (
				<Menu.Item onPress={() => setValue(comp)} key={index}>{comp}</Menu.Item>
			))}
		</Menu>
	);
}

const SearchFilterComponent = (props: SearchBarFilter) => {
	const [shouldOverlapWithTrigger] = React.useState(false);
	const [value, setValue] = React.useState('');
	const [search, setSearch] = React.useState([] as any[]);

	return (
		<Menu backgroundColor={'gray.300'} maxHeight={250} mt={1} minHeight={100} maxW="160" shouldOverlapWithTrigger={shouldOverlapWithTrigger} // @ts-ignore
			placement={'bottom left'} trigger={triggerProps => {
				return <Button m={3} py={1} alignSelf="center" variant={"solid"} colorScheme={value ? 'primary' : 'gray'} {...triggerProps} endIcon={<Icon size="6" color="gray.400" as={<MaterialIcons name="keyboard-arrow-down" />}/>}>
							{value ? value : props.name}
						</Button>;
			}}>
				<Input onChangeText={(text) => props.searchCallBack(text, (truc) => setSearch(truc))} mx={5} variant={"underlined"} placeholder={'Filter by ' + props.name}/>
				<Menu.Item onPress={() => setValue('')} key="all">All</Menu.Item>
				{search.map((comp: any, index) => (
					<Menu.Item key={index} onPress={() => setValue(comp.name)} >{comp.name}</Menu.Item>
				))}
		</Menu>
	);
}

const componentSelector = (comp: SearchBarFilter) => {
	if (comp.componentType === "provided-list") {
		return <ProvidedFilterComponent componentType={comp.componentType}
			name={comp.name}
			type={comp.type}
			options={comp.options}
			icon={comp.icon}
			searchCallBack={comp.searchCallBack}/>;
	} else if (comp.componentType === "retrieved-list") {
		// return <RetrievedFilterComponent componentType={comp.componentType}
		// 	name={comp.name}
		// 	type={comp.type}
		// 	options={comp.options}
		// 	icon={comp.icon}
		// 	searchCallBack={comp.searchCallBack}/>;
		return <Button m={3} py={1} alignSelf="center" variant={"solid"} colorScheme={"warning"} endIcon={<Icon size="6" color="gray.400" as={<MaterialIcons name="access-time" />}/>}>
					Comming soon
				</Button>;
	} else if (comp.componentType === "search-list") {
		return <SearchFilterComponent componentType={comp.componentType}
			name={comp.name}
			type={comp.type}
			options={comp.options}
			icon={comp.icon}
			searchCallBack={comp.searchCallBack}/>;
	} else {
		return <Button m={3} py={1} alignSelf="center" variant={"solid"} colorScheme={"warning"} endIcon={<Icon size="6" color="gray.400" as={<MaterialIcons name="access-time" />}/>}>
					Comming soon
				</Button>;
	}
}

const RawSearchBar = (props: RawSearchBarProps) => {

	return (
		<VStack w="100%" alignSelf="center" backgroundColor={'white'}>
			<VStack>
			<Input onChangeText={} variant={"underlined"} placeholder={props.placeHolder} width="100%" borderRadius="4" py="3" px="1" fontSize="14" InputLeftElement={<Icon m="2" ml="3" size="6" color="gray.400" as={<MaterialIcons name="search" />} />} />
			<HStack>
				<ScrollView horizontal={true}>
					{props.filters.map((comp: SearchBarFilter, index) => (
						<Box key={index}>
							{componentSelector(comp)}
						</Box>
					))}
				</ScrollView>
			</HStack>

			</VStack>
		</VStack>
	);
}

const SearchBar = (props: SearchBarProps) => {
	return (
		<RawSearchBar filters={props.filters} placeHolder={props.placeHolder}/>
	);
}

export default SearchBar