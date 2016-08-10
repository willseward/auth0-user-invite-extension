import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ButtonToolbar } from 'react-bootstrap';

import { logout } from '../actions/auth';
import Header from '../components/Header';

import RequireAuthentication from './RequireAuthentication';
import { WidgetContainer } from './';
import AddUserModal from '../components/AddUserModal';
import CSVModal from '../components/CSVModal';

class App extends Component {
  render() {
    return (
      <div>
        <Header tenant={window.config.AUTH0_DOMAIN} onLogout={this.props.logout} />
        <div className="container">
          <div className="row">
            <section className="content-page current">
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
            </section>
          </div>
        </div>
      </div>
    );
  }
}

function select(state) {
  return {
    user: state.auth.get('user'),
    issuer: state.auth.get('issuer')
  };
}

export default RequireAuthentication(connect(select, { logout })(App));
