import React from 'react';
// import { Provider } from 'react-redux';
// import store from '../state/Store';
// import { fireEvent, render, screen } from '@testing-library/react-native';
import { NativeBaseProvider } from "native-base";
import Theme from '../Theme';

import HomeView from './HomeView';
// import { en, fr } from '../i18n/Translations';
import renderer from 'react-test-renderer'


describe('<HomeView />', () => {

  jest.setTimeout(150000);
  // const view = () => <NativeBaseProvider theme={Theme}><HomeView/></NativeBaseProvider>;
  // beforeEach(() => render(view()));

  // it('should render correctly', () => {
  //   expect(screen).toBeDefined();
  // })
  //const View = () => <NativeBaseProvider theme={Theme}><HomeView/></NativeBaseProvider>;

  it('Main View should render correctly', async () => {
    const tree = renderer.create(<NativeBaseProvider theme={Theme}><HomeView/></NativeBaseProvider>).toJSON;
    expect(tree).toMatchSnapshot();
  });


  // it('has should display the text in default language', async () => {
  //   expect((await screen.findAllByText(en.signoutBtn)).length).toBe(1);
  // });

  // it('has should display the text in the new language', async () => {
  //   fireEvent.press(screen.getByText('Change language'));
  //   expect(store.getState().language.value).toBe('fr');
  //   screen.update(view);
  //   expect((await screen.findAllByText(fr.signoutBtn)).length).toBe(1);
  // });
});
