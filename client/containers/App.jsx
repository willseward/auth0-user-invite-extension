import React, { Component } from 'react';
import { ButtonToolbar } from 'react-bootstrap';

import { WidgetContainer } from './';
import Header from '../components/Header';
import { AddUserModal, CSVModal } from '../components/Users';

class App extends Component {

  render() {
    return (
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
            <ButtonToolbar className="pull-right">
              <AddUserModal />
              <CSVModal />
            </ButtonToolbar>
          </div>
        </div>
        <WidgetContainer />
      </div>
    );
  }
}

export default App;
