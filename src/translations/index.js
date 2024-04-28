import i18n from 'i18next';
import React from 'react';
import {initReactI18next} from 'react-i18next';
import translationEN from './en.json';
import translationPT from './pt.json';
import { TranslationStore } from '../Stores/TranslationStore';

const initialState = TranslationStore.getState();

i18n
.use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: translationEN,
      },
      pt: {
        translation: translationPT,
      },
    },
    lng: initialState.language, 
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
    },
  });

  
TranslationStore.subscribe(
    (state) => {
      console.log("Changing language to:", state.language);
      i18n.changeLanguage(state.language);
    },
    (state) => state.language
  );
  
  export default i18n;