import React, { Component, PropTypes } from 'react';
import connectContainer from 'redux-static';

import { templateConfigurationActions } from '../../actions';
import { InvitationEmailForm } from './';
import Error from '../Messages/Error';
import Info from '../Messages/Info';

export default connectContainer(class InvitationEmail extends Component {

  constructor(props) {
    super(props);

    this.state = {
      formSubmitted: false,
      message: ''
    }
  }

  static stateToProps = (state) => {
    return {
      templateConfiguration: state.templateConfiguration
    }
  }

  static actionsToProps = {
    ...templateConfigurationActions
  }

  static propTypes = {
    fetchTemplateConfiguration: PropTypes.func.isRequired,
    saveTemplateConfiguration: PropTypes.func.isRequired
  }

  componentDidMount() {
    this.props.fetchTemplateConfiguration();
  }

  componentWillReceiveProps(nextProps) {
    // init message
    if (this.state.message === '') {
      const { template } = nextProps.templateConfiguration.toJS();
      if(template && typeof template.message !== 'undefined') {
        this.setState({
          message: template.message
        });
      }
    }
  }

  updateMessage(newMessage) {
    this.setState({
      message: newMessage
    });
  }

  handleSubmit(data) {
    let defaultValues = this.props.templateConfiguration.toJS().template;
    let template = {
      from: data.from || defaultValues.from,
      subject: data.subject || defaultValues.subject,
      redirectTo: data.redirectTo || defaultValues.redirectTo,
      message: this.state.message || defaultValues.message
    };

    this.props.saveTemplateConfiguration(template);

    this.setState({
      formSubmitted: true
    });
  }

  render() {

    const { error, template, loading } = this.props.templateConfiguration.toJS();

    return (
      <div>
        <InvitationEmailForm
          template={template}
          onSubmit={this.handleSubmit.bind(this)}
          submitting={true}
          message={this.state.message}
          updateMessage={this.updateMessage.bind(this)}
        />
        {(this.state.formSubmitted && !loading && !error) ? <Info message={'Form Submitted!'} /> :
          <Error message={error ? error : '' } />}
      </div>
    )
  }
});
