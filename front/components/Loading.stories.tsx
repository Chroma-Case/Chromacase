// @ts-expect-error Who does tests anyway?
import { ComponentStory, ComponentMeta } from '@storybook/react';
import Loading from './Loading';

export default {
	title: 'Loading',
	component: Loading,
} as ComponentMeta<typeof Loading>;

export const Default: ComponentStory<typeof Loading> = () => <Loading />;
