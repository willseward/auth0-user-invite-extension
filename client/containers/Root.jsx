import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import { logout } from '../actions/auth';

import RequireAuthentication from './RequireAuthentication';
import Header from '../components/Header';

class App extends Component {
  static propTypes = {
    logout: PropTypes.func
  };

  render() {
    return (
      <div>
        <Header tenant={window.config.AUTH0_DOMAIN} onLogout={this.props.logout}/>
        <div className="container">
          <div className="row">
            <section className="content-page current">
              {this.props.children}
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
