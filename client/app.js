import axios from 'axios';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { useRouterHistory, Router } from 'react-router';
import { createHistory } from 'history';

import { loadCredentials } from './actions/auth';
import routes from './routes';
import configureStore from './store/configureStore';
// Make axios aware of the base path.
axios.defaults.baseURL = window.config.BASE_URL;

// Make history aware of the base path.
const history = useRouterHistory(createHistory)({
  basename: window.config.BASE_PATH || ''
});

const store = configureStore();

// Fire first events.
store.dispatch(loadCredentials());

// Render application.
ReactDOM.render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>,
  document.getElementById('app')
);

// Show the developer tools.
// if (process.env.NODE_ENV !== 'production') {
//   const showDevTools = require('./showDevTools');
//   showDevTools(store);
// }
