import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import "bootstrap/dist/css/bootstrap.min.css";
import i18n from './translations';
import {I18nextProvider} from 'react-i18next';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  </BrowserRouter>
);