import React, { Component, PropTypes } from 'react';
import connectContainer from 'redux-static';

import { emailConfigurationActions } from '../../actions';
import { EmailSettingsForm } from './';
import Error from '../Error';

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
    let defaultValues = this.props.emailConfiguration.toJS().emailSettings;
    let emailSettings = {
      host: data.host || defaultValues.host,
      port: data.port || defaultValues.port,
      auth: {
        user: data.user || defaultValues.user,
        password: data.password || defaultValues.password
      }
    };
    this.props.saveEmailSettingsConfiguration(emailSettings);

    this.setState({
      formSubmitted: true
    });
  }

  render() {
    const { error, emailSettings, loading } = this.props.emailConfiguration.toJS();

    return (
      <div>
        <EmailSettingsForm
          emailSettings={emailSettings}
          onSubmit={this.handleSubmit.bind(this)}
          submitting={true}
        />
        {(this.state.formSubmitted && !loading && !error) ? 'Submited!' :
          <Error message={error ? error : '' } />}
      </div>
    )
  }
});
