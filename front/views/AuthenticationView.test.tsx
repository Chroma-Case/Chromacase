import React from 'react';
import { Provider } from 'react-redux';
import TestRenderer from 'react-test-renderer';
import store from '../state/Store';

import AuthenticationView from '../views/AuthenticationView';

describe('<AuthenticationView />', () => {
	it('has 3 children', () => {
		const tree = TestRenderer.create(
			<Provider store={store}>
				<AuthenticationView />
			</Provider>
		).toJSON();
		expect(tree.children.length).toBe(3);
	});
});
