import React, { Component, PropTypes } from 'react';
import connectContainer from 'redux-static';

import { configurationActions } from '../../actions';
import { InvitationEmailForm } from './';
import Error from '../Error';

export default connectContainer(class InvitationEmail extends Component {

  constructor(props) {
    super(props);

    this.state = {
      formSubmitted: false
    }
  }

  static stateToProps = (state) => {
    return {
      configuration: state.configuration
    }
  }

  static actionsToProps = {
    ...configurationActions
  }

  static propTypes = {
    fetchTemplateConfiguration: PropTypes.func.isRequired,
    saveTemplateConfiguration: PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.fetchTemplateConfiguration();
  }

  handleSubmit(data) {
    let defaultValues = this.props.configuration.toJS().template;
    let template = {
      from: data.from || defaultValues.from,
      subject: data.subject || defaultValues.subject,
      redirectTo: data.redirectTo || defaultValues.redirectTo,
      message: data.message || defaultValues.message
    };
    this.props.saveTemplateConfiguration(template);

    this.setState({
      formSubmitted: true
    });
  }

  render() {

    const { error, template, loading } = this.props.configuration.toJS();

    return (
      <div>
        <InvitationEmailForm
          template={template}
          onSubmit={this.handleSubmit.bind(this)}
          submitting={true}
        />
        {(this.state.formSubmitted && !loading && !error) ? 'Submited!' :
          <Error message={this.state.error ? this.state.error : '' } />}
      </div>
    )
  }
});
