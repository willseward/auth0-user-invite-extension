import React, { Component, PropTypes } from 'react';
import connectContainer from 'redux-static';

import { templateConfigurationActions } from '../../actions';
import { InvitationEmailForm } from './';
import { Error, Success } from '../Messages';

export default connectContainer(class InvitationEmail extends Component {

  constructor(props) {
    super(props);

    this.state = {
      formSubmitted: false,
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

  handleSubmit(data) {

    this.props.saveTemplateConfiguration(data);

    this.setState({
      formSubmitted: true
    });
  }

  render() {

    const { error, loading } = this.props.templateConfiguration.toJS();

    return (
      <div>
        <InvitationEmailForm
          onSubmit={this.handleSubmit.bind(this)}
          submitting={true}
        />
        {(this.state.formSubmitted && !loading && !error) ? <Success message={'Form Submitted.'} /> :
          <Error message={error ? error : '' } />}
      </div>
    )
  }
});
