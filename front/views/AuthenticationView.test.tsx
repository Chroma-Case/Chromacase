import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, render, screen } from '@testing-library/react-native';
import store from '../state/Store';
import AuthenticationView from '../views/AuthenticationView';
import { en, fr } from '../i18n/Translations';
import { useLanguage } from '../state/LanguageSlice';
import renderer from 'react-test-renderer'
import { NativeBaseProvider } from "native-base";
import Theme from '../Theme';

describe('AuthenticationView Component', () => {

  jest.setTimeout(150000);
  const view = () => <NativeBaseProvider theme={Theme}><AuthenticationView/></NativeBaseProvider>;

  it('should render correctly', () => {
    let truc = render(view()).toJSON();
    expect(truc).toBeDefined();
  })
  // const view = () => <Provider store={store}><AuthenticationView /></Provider>;
  
  // beforeEach(() => render(view()));

  // it('has should display the text in default language', async () => {
  //   expect((await screen.findAllByText(en.signinBtn)).length).toBe(true);
  // });

  // it('has should display the text in the new language', async () => {
  //   store.dispatch(useLanguage('fr'));
  //   screen.update(view());
  //   expect("(await screen.findAllByText(fr.signinBtn)").toBe(true);
  // });
});