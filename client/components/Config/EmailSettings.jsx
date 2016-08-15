import React, { Component, PropTypes } from 'react';
import connectContainer from 'redux-static';

import { emailConfigurationActions } from '../../actions';
import { EmailSettingsForm } from './';
import Error from '../Messages/Error';
import Info from '../Messages/Info';

export default connectContainer(class EmailSettings extends Component {

  constructor(props) {
    super(props);

    this.state = {
      formSubmitted: false
    }
  }

  static stateToProps = (state) => {
    return {
      emailConfiguration: state.emailConfiguration
    }
  }

  static actionsToProps = {
    ...emailConfigurationActions
  }

  static propTypes = {
    fetchEmailSettingsConfiguration: PropTypes.func.isRequired,
    saveEmailSettingsConfiguration: PropTypes.func.isRequired
  }

  componentDidMount() {
    this.props.fetchEmailSettingsConfiguration();
  }

  handleSubmit(data) {
    this.props.saveEmailSettingsConfiguration(data);

    this.setState({
      formSubmitted: true
    });
  }

  render() {
    const { error, loading } = this.props.emailConfiguration.toJS();

    return (
      <div>
        <EmailSettingsForm
          onSubmit={this.handleSubmit.bind(this)}
          submitting={true}
        />
        {(this.state.formSubmitted && !loading && !error) ? <Info message={'Form Submitted!'} /> :
          <Error message={error ? error : '' } />}
      </div>
    )
  }
});
