import React from 'react';

import { Configuration } from './Config';
import { WarningsContainer } from './';

function ConfigurationContainer() {
  return (
    <div className="col-xs-12">
      <div className="row">
        <div className="col-xs-12 content-header">
          <ol className="breadcrumb">
            <li>
              <a href="https://manage.auth0.com/">Auth0 Dashboard</a>
            </li>
            <li>
              <a href="https://manage.auth0.com/#/extensions">Extensions</a>
            </li>
          </ol>
          <h1 className="pull-left" style={{ paddingTop: '10px' }}>Configuration</h1>
        </div>
      </div>
      <WarningsContainer />
      <Configuration />
    </div>
  );
}

export default ConfigurationContainer;
