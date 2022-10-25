import React from 'react';
import { Provider } from 'react-redux';
import store from '../state/Store';
import { fireEvent, render, screen } from '@testing-library/react-native';

import HomeView from './HomeView';
import { en, fr } from '../i18n/Translations';

describe('<HomeView />', () => {
  const view = <Provider store={store}><HomeView /></Provider>;

  beforeEach(() => render(view));

  it('has should display the text in default language', async () => {
    expect((await screen.findAllByText(en.signoutBtn)).length).toBe(1);
  });

  it('has should display the text in the new language', async () => {
    fireEvent.press(screen.getByText('Change language'));
    expect(store.getState().language.value).toBe('fr');
    screen.update(view);
    expect((await screen.findAllByText(fr.signoutBtn)).length).toBe(1);
  });
});
