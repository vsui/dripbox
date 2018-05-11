import 'babel-polyfill';

import React from 'react';
import { render } from 'react-dom';
import { ThemeProvider } from 'styled-components';

import App from './App';
import theme from './utils/theme';

render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>,
  document.getElementById('app'),
);

module.hot.accept();
