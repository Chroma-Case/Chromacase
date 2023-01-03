import React from 'react';
// import { Provider } from 'react-redux';
// import { fireEvent, render, screen } from '@testing-library/react-native';
// import store from '../state/Store';
import AuthenticationView from '../views/AuthenticationView';
// import { en, fr } from '../i18n/Translations';
// import { useLanguage } from '../state/LanguageSlice';
import renderer from 'react-test-renderer'
import { NativeBaseProvider } from "native-base";
import Theme from '../Theme';
// import { setUserToken } from '../state/UserSlice';

describe('AuthenticationView Component', () => {

  jest.setTimeout(150000);
  const view = () => <NativeBaseProvider theme={Theme}><AuthenticationView/></NativeBaseProvider>;
  // beforeEach(() => render(view()));


  it('view should render', () => {
    const tree = renderer.create(view()).toJSON;
    expect(tree).toMatchSnapshot();
    // expect(screen).toBeDefined();
  });


  // it('should fail', () => {
  //   expect(AuthenticationView.)
  // });

  // it('should render forms', async () => {
  //   expect(await screen.findByDisplayValue('username')).toBeTruthy();
  // });
  // it('renders the submit button', () => {
  //   expect(screen.findAllByText('en.signinBtn')).toBeTruthy();
  // });
  // it('renders the forms', async () => {
  //   expect(screen.findAllByPlaceholderText)
  // })
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