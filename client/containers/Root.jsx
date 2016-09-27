import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { logout } from '../actions/auth';

import RequireAuthentication from './RequireAuthentication';
import Header from '../components/Header';

const Root = (props) => (
  <div>
    <Header tenant={window.config.AUTH0_DOMAIN} onLogout={props.logout} />
    <div className="container">
      <div className="row">
        <section className="content-page current">
          {props.children}
        </section>
      </div>
    </div>
  </div>
);

Root.propTypes = {
  logout: PropTypes.func
};

function select(state) {
  return {
    user: state.auth.get('user'),
    issuer: state.auth.get('issuer')
  };
}

export default RequireAuthentication(connect(select, { logout })(Root));
