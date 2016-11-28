import React, { Component, PropTypes } from 'react';
import connectContainer from 'redux-static';

import { LoadingPanel, Error, Success } from 'auth0-extension-ui';
import { templateConfigurationActions } from '../../actions';
import { InvitationEmailForm } from './';

export default connectContainer(class InvitationEmail extends Component {

  constructor(props) {
    super(props);

    this.state = {
      formSubmitted: false
    };
  }

  static stateToProps = (state) => ({
    templateConfiguration: state.templateConfiguration
  })

  static actionsToProps = {
    ...templateConfigurationActions
  }

  static propTypes = {
    fetchTemplateConfiguration: PropTypes.func.isRequired,
    saveTemplateConfiguration: PropTypes.func.isRequired,
    templateConfiguration: PropTypes.object
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

  renderForm(error, template) {
    const initialValues = {
      from: template.from,
      subject: template.subject,
      html: template.html
    };
    if (!error) {
      return (<InvitationEmailForm initialValues={initialValues} onSubmit={this.handleSubmit.bind(this)} />);
    }
    return null;
  }

  render() {
    const { error, loading, template } = this.props.templateConfiguration.toJS();
    return (
      <div>
        <p className="help-block">This email will be sent whenever a user is invited.</p>
        <LoadingPanel show={loading} animationStyle={{ paddingTop: '5px', paddingBottom: '5px' }}>
          {(this.state.formSubmitted && !loading && !error) ? <Success message={'Form Submitted.'} /> : <Error message={error ? error : ''} />}
          {this.renderForm(error, template)}
        </LoadingPanel>
      </div>
    );
  }
});
