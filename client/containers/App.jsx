import React, { Component } from 'react';
import { connect } from 'react-redux';

import { logout } from '../actions/auth';
import Header from '../components/Header';

import RequireAuthentication from './RequireAuthentication';
import { InvitationsContainer } from './';

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
                  <div className="col-xs-12 content-header">
                    <ol className="breadcrumb">
                      <li>
                        <a href="https://manage.auth0.com/">Auth0 Dashboard</a>
                      </li>
                      <li>
                        <a href="https://manage.auth0.com/#/extensions">Extensions</a>
                      </li>
                    </ol>
                    <h1 className="pull-left" style={{ paddingTop: '10px' }}>User Invitations</h1></div>
                </div>
                <div className="widget-title title-with-nav-bars">
                  <ul className="nav nav-tabs">
                    <li className="active">
                      <a data-toggle="tab" href="#pending" aria-expanded="true">
                        <span className="tab-title">
                          Pending users
                        </span>
                      </a>
                    </li>
                    <li>
                      <a data-toggle="tab" href="#accepted">
                        <span className="tab-title">
                          Accepted users
                        </span>
                      </a>
                    </li>
                  </ul>
                </div>
                <div id="content-area" className="tab-content">
                  <div id="pending" className="tab-pane active">
                    <InvitationsContainer filter="pending"/>
                  </div>
                  <div id="accepted" className="tab-pane">
                    <InvitationsContainer filter="accepted"/>
                  </div>
                </div>
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
