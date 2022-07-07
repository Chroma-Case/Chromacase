import React from 'react';
import TestRenderer from 'react-test-renderer';

import App from './App';

describe('<App />', () => {
  it('has 1 child', () => {
    const tree = TestRenderer.create(<App />).toJSON();
    expect(tree.children.length).toBe(10);
  });
});
