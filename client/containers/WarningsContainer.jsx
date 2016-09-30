import React, { PropTypes, Component } from 'react';
import connectContainer from 'redux-static';

import { configurationStatusActions } from '../actions';
import { ConfigurationStatus } from './Config';

export default connectContainer(class WarningsContainer extends Component {

  static actionsToProps = {
    ...configurationStatusActions
  }

  static propTypes = {
    fetchConfigurationStatus: PropTypes.func.isRequired,
    onWarningAlert: PropTypes.func
  }

  componentDidMount() {
    this.props.fetchConfigurationStatus();
  }

  render() {
    return (<ConfigurationStatus />);
  }
});
