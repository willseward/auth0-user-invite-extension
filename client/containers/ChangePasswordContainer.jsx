import React, { Component } from 'react';

import { ChangePassword } from '../components/ChangePassword';

class ConfigurationContainer extends Component {

  render() {
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
            <h1 className="pull-left" style={{ paddingTop: '10px' }}>Change Password</h1>
          </div>
        </div>
        <ChangePassword />
      </div>
    );
  }
};

export default ConfigurationContainer;
