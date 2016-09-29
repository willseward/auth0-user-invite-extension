import React from 'react';

import { WidgetContainer, WarningsContainer } from './';
import { NewUsersModal } from './Users';

const App = () => (
  <div className="col-xs-12">
    <div className="row">
      <div className="col-xs-6 content-header">
        <ol className="breadcrumb">
          <li>
            <a href="https://manage.auth0.com/">Auth0 Dashboard</a>
          </li>
          <li>
            <a href="https://manage.auth0.com/#/extensions">Extensions</a>
          </li>
        </ol>
        <h1 className="pull-left" style={{ paddingTop: '10px' }}>User Invitations</h1>
      </div>

      <div className="col-xs-6">
        <div className="pull-right">
          <NewUsersModal />
        </div>
      </div>
    </div>
    <div className="row">
      <p className="col-xs-6 help-block">
        Here you will find all the users whether they accepted their invitations or not.
      </p>
    </div>
    <WarningsContainer />
    <WidgetContainer />
  </div>
);

export default App;
