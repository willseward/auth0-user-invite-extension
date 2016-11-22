import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { reduxForm, Field, formValueSelector, isInvalid } from 'redux-form';
import { Button } from 'react-bootstrap';

import { InputText } from 'auth0-extension-ui';
import { Error } from '../../../../components/Messages';

const validate = values => {
  const errors = {};

  if (!values.selectedConnection) {
    errors.selectedConnection = [ 'Connection is required' ];
  }

  const connection = _.find(values.connection, (item) => item.name === values.selectedConnection);

  if (!connection || !connection.name) {
    errors.selectedConnection = [ 'Connection is required' ];
  }

  if (!values.username && connection && connection.requires_username) {
    errors.username = [ 'Username is required' ]; // may be required or not, depending on the connection
  }

  if (!values.email) {
    errors.email = [ 'Email is required' ];
  }

  return errors;
};

class AddUserForm extends Component {

  componentWillReceiveProps(nextProps) {
    if (nextProps.formSubmitted && !nextProps.invitations.loadingUser
      && !nextProps.invitations.inviteUserError) {
      this.props.resetForm(); // reset email and username properties
      this.props.nextView();
    }
  }

  clearAllFields() {
    this.props.resetForm();
    this.props.clearAllFields();
    this.props.tryAgain();
  }

  renderNextBtn(isInvalid) {
    return (
      <Button
        type="button"
        className="btn btn-primary" type="submit"
        disabled={isInvalid}
      >
        Create
      </Button>
    );
  }

  renderBackBtn() {
    return (
      <Button
        type="button"
        className="btn btn-transparent"
        onClick={this.props.goBackView}
      >
        Back
      </Button>
    );
  }

  renderUsernameField(connection, connectionField) {
    if (!connectionField) {
      return null;
    }

    const selectedConnection = _.find(connection, (item) => item.name === connectionField);
    if (!selectedConnection || !selectedConnection.requires_username) {
      return null;
    }

    return (
      <Field name="username" component={InputText} label="Username" type="text" />
    );
  }

  renderConnectionField(field) {
    const connection = field.connection;
    return (
      <div className="form-group">
        <label className="control-label col-xs-3" htmlFor={field.name}>{field.label}</label>
        <div className="col-xs-9">
          <select id="connection" className="form-control" {...field.input}>
            {connection ? connection.map(connectionOption => <option value={connectionOption.name} key={connectionOption.name}>{connectionOption.name}</option>) : ''}
          </select>
          {field.meta.touched && field.meta.error && <div>{field.meta.error}</div>}
          <p className="help-block">This is a logical identifier of the connection.</p>
        </div>
      </div>
    );
  }

  render() {
    const {
      handleSubmit,
      connection,
      invitations,
      hasSelectedConnection,
      isInvalid
    } = this.props;

    return (
      <div className="modal-content">
        <div className="modal-header has-border">
          <Button type="button" data-dismiss="modal" className="close" onClick={this.clearAllFields.bind(this)}>
            <span aria-hidden="true">×</span><span className="sr-only">Close</span>
          </Button>
          <h4 id="myModalLabel" className="modal-title">Create User</h4>
        </div>

        <form className="form-horizontal" onSubmit={handleSubmit}>
          <div className="modal-body">

            <p className="text-center">Create an user with connection, email and username if needed.</p>
            <Error message={invitations.inviteUserError ? invitations.inviteUserError : ''} />

            <Field name="selectedConnection" component={this.renderConnectionField} connection={connection} label="Connection" />

            <Field name="email" component={InputText} label="Email" type="email" />

            { this.renderUsernameField(connection, hasSelectedConnection) }

          </div>

          <div className="modal-footer">
            { this.renderBackBtn() } { this.renderNextBtn(isInvalid) }
          </div>
        </form>

      </div>
    );
  }


}

AddUserForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  formSubmitted: PropTypes.bool.isRequired,
  nextView: PropTypes.func.isRequired,
  goBackView: PropTypes.func.isRequired,
  clearAllFields: PropTypes.func.isRequired,
  tryAgain: PropTypes.func.isRequired,
  resetForm: PropTypes.func.isRequired,
  connection: PropTypes.array,
  invitations: PropTypes.object,
  hasSelectedConnection: PropTypes.string,
  isInvalid: PropTypes.bool
};


const reduxFormDecorator = reduxForm({
  form: 'addUser',
  validate
});

// Decorate with connect to read form values
const selector = formValueSelector('addUser');
const connectDecorator = connect(state => {
  const hasSelectedConnection = selector(state, 'selectedConnection');

  return {
    hasSelectedConnection,
    isInvalid: isInvalid('addUser')(state) // form has sync, async, or submission errors
  };
});

export default connectDecorator(reduxFormDecorator(AddUserForm));
