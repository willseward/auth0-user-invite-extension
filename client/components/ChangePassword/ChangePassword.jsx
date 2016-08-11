import React, { Component, PropTypes } from 'react';
import connectContainer from 'redux-static';

import { changePasswordActions } from '../../actions';
import { ChangePasswordForm } from './';
import Error from '../Error';

export default connectContainer(class ChangePassword extends Component {

  constructor(props) {
    super(props);

    this.state = {
      formSubmitted: false,
      tokenNotFoundError: ''
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

  componentDidMount() {
    if (!this.props.params || !this.props.params.token) {
      return this.setState({
        tokenNotFoundError: 'The URL is incorrect or not valid. Please check your email.'
      });
    }

    var token = this.props.params.token;
    this.props.validateUserToken(token);
  }

  handleSubmit(data) {
    var { user } = this.props.changePassword.toJS();
    this.props.savePassword(user, data, this.props.params.token);

    this.setState({
      formSubmitted: true
    });
  }

  render() {

    const { error, saveValidationErrors, validatetokenNotFoundErrors, template, loading } = this.props.changePassword.toJS();

    if (this.state.tokenNotFoundError || validatetokenNotFoundErrors) {
      return (<Error message={(this.state.tokenNotFoundError || validatetokenNotFoundErrors)} />);
    }

    return (
      <div>
        <p>Congratulations, you have been invited. Please set a new password for your account.</p>
        <ChangePasswordForm
          onSubmit={this.handleSubmit.bind(this)}
          submitting={true}
        />
        {(this.state.formSubmitted && !loading && !error && !saveValidationErrors) ? 'Submited!' :
        <Error message={(error || saveValidationErrors) ? (error || saveValidationErrors) : '' } />}
      </div>
    )
  }
});
