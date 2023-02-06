import React from 'react';
import { Provider } from 'react-redux';
import TestRenderer from 'react-test-renderer';
import store from '../state/Store';

import HomeView from '../views/HomeView';

describe('<HomeView />', () => {
  it('has 2 children', () => {
    const tree = TestRenderer.create(<Provider store={store}><HomeView /></Provider>).toJSON();
    expect(tree.children.length).toBe(2);
  });
});
