import React from 'react';
import { Router, Route, IndexRoute } from 'react-router';

import * as containers from './containers';

export default (history) =>
  <Router history={history}>
    <Route path="/" component={containers.Root}>
      <IndexRoute component={containers.App} />
      <Route path="configuration" component={containers.ConfigurationContainer} />
      <Route path="changepassword/:token" component={containers.ChangePasswordContainer} />
    </Route>
  </Router>;
