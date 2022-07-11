import React from 'react';
import TestRenderer from 'react-test-renderer';

import { AppContent } from './App';

describe('<AppContent />', () => {
  it('has 1 child', () => {
    const tree = TestRenderer.create(<AppContent />).toJSON();
    expect(tree.children.length).toBe(10);
  });
});
