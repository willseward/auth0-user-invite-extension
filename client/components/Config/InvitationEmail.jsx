import React, { Component, PropTypes } from 'react';
import connectContainer from 'redux-static';

import { configurationActions } from '../../actions';
import { InvitationEmailForm } from './';

export default connectContainer(class InvitationEmail extends Component {

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
    this.props.saveTemplateConfiguration(data);
  }

  resetForm() {
    console.log('resetForm');
  }

  render() {

    const { error, configuration, loading } = this.props.configuration.toJS();
    
    return (
      <div>
        <InvitationEmailForm
          configuration={configuration}
          onSubmit={this.handleSubmit.bind(this)}
          resetForm={this.resetForm.bind(this)}
          submitting={true}
        />
      </div>
    )
  }
});
