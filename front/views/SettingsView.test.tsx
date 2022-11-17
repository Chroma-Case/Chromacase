import React from 'react';
import { Provider } from 'react-redux';
import TestRenderer from 'react-test-renderer';
import store from '../state/Store';

import { NativeBaseProvider } from "native-base";
import Theme from '../Theme';
import { fireEvent, render, screen } from '@testing-library/react-native';


import { MainView, PreferencesView } from './SettingsView'

describe('testing Setting\'s main view', () => {
  jest.setTimeout(150000);
  const MainView = () => <NativeBaseProvider theme={Theme}><MainView/></NativeBaseProvider>;
  const PreferencesView = () => <NativeBaseProvider theme={Theme}><PreferencesView/></NativeBaseProvider>;

  it('should render correctly', () => {
    let truc = render(MainView()).toJSON();
    expect(truc).toBeDefined();
  })
});