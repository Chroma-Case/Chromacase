import React from 'react';
// import { Provider } from 'react-redux';
// import TestRenderer from 'react-test-renderer';
// import store from '../state/Store';

import { Button, NativeBaseProvider } from "native-base";
import Theme from '../Theme';
// import { fireEvent, render, screen } from '@testing-library/react-native';
import renderer from 'react-test-renderer'

// import { MainView, PreferencesView } from './SettingsView'

describe('testing Setting\'s main view', () => {
  jest.setTimeout(150000);
  const MainView = () => <NativeBaseProvider theme={Theme}><MainView/></NativeBaseProvider>;
  const PreferencesView = () => <NativeBaseProvider theme={Theme}><PreferencesView/></NativeBaseProvider>;

  it('Main View should render correctly', async () => {
    const tree = renderer.create(MainView()).toJSON;
    expect(tree).toMatchSnapshot();
  });

  it('Preference View should render correctly', async () => {
    const tree = renderer.create(PreferencesView()).toJSON;
    expect(tree).toMatchSnapshot();
  })

  // it('Preference View should render correctly', async() => {
  //   render(PreferencesView());
  //   expect(screen.findAllByText('en.backBtn')).toBeTruthy();
  // })
});