import React, { Component, PropTypes } from 'react';
import connectContainer from 'redux-static';

import { changePasswordActions } from '../../actions';
import { ChangePasswordForm } from './';
import Error from '../Error';

export default connectContainer(class ChangePassword extends Component {

  constructor(props) {
    super(props);

    this.state = {
      formSubmitted: false
    }
  }

  static stateToProps = (state) => {
    return {
      changePassword: state.changePassword
    }
  }

  static actionsToProps = {
    ...changePasswordActions
  }

  static propTypes = {
    validateUserToken: PropTypes.func.isRequired,
    savePassword: PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.validateUserToken();
  }

  handleSubmit(data) {
    this.props.savePassword(data);

    this.setState({
      formSubmitted: true
    });
  }

  render() {

    const { error, validationErrors, template, loading } = this.props.changePassword.toJS();

    return (
      <div>
        <p>Congratulations, you have been invited. Please set a new password for your account.</p>
        <ChangePasswordForm
          onSubmit={this.handleSubmit.bind(this)}
          submitting={true}
        />
        {(this.state.formSubmitted && !loading && !error && !validationErrors) ? 'Submited!' :
        <Error message={(error || validationErrors) ? (error || validationErrors) : '' } />}
      </div>
    )
  }
});
