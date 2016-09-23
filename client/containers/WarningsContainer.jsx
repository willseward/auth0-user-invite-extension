import React, { PropTypes, Component } from 'react';
import connectContainer from 'redux-static';

import { configurationStatusActions } from '../actions';
import { ConfigurationStatus } from '../components/Config';

export default connectContainer(class WarningsContainer extends Component {

  static actionsToProps = {
    ...configurationStatusActions
  }

  static propTypes = {
    fetchConfigurationStatus: PropTypes.func.isRequired
  }

  componentDidMount() {
    this.props.fetchConfigurationStatus();
  }

  render() {
    return (<ConfigurationStatus />);
  }
});
