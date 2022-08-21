import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, render, screen } from '@testing-library/react-native';
import store from '../state/Store';
import AuthenticationView from '../views/AuthenticationView';
import { en, fr } from '../i18n/Translations';
import { useLanguage } from '../state/LanguageSlice';

describe('<AuthenticationView />', () => {
  const view = () => <Provider store={store}><AuthenticationView /></Provider>;
  
  beforeEach(() => render(view()));

  it('has should display the text in default language', async () => {
    expect((await screen.findAllByText(en.signinBtn)).length).toBe(1);
  });

  it('has should display the text in the new language', async () => {
    store.dispatch(useLanguage('fr'));
    screen.update(view());
    expect((await screen.findAllByText(fr.signinBtn)).length).toBe(1);
  });
});