import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { Button } from 'react-bootstrap';

import { InputText } from '../../../../components/Dashboard';
import { Error } from '../../../../components/Messages';

export const fields = [ 'username', 'email', 'selectedConnection', 'connection' ];

const validate = values => {
  const errors = {};

  if (!values.selectedConnection) {
    errors.selectedConnection = [ 'Required' ];
  }

  const connection = _.find(values.connection, (item) => item.name === values.selectedConnection);

  if (!connection || !connection.name) {
    errors.selectedConnection = [ 'Required' ];
  }

  if (!values.username && connection && connection.requires_username) {
    errors.username = [ 'Required' ]; // may be required or not, depending on the connection
  }

  if (!values.email) {
    errors.email = [ 'Required' ];
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

  renderNextBtn(fieldsList) {
    return (
      <Button
        type="button"
        className="btn btn-primary" type="submit"
        disabled={_.some(fieldsList, item => item.error)}
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

  renderUsername(connection, connectionField, usernameField) {
    if (!connectionField || !connectionField.value) {
      return null;
    }

    const selectedConnection = _.find(connection, (item) => item.name === connectionField.value);
    if (!selectedConnection || !selectedConnection.requires_username) {
      return null;
    }

    return (
      <InputText field={usernameField} label="Username" type="text" fieldName={usernameField.name} touched={usernameField.touched} validationErrors={usernameField.error} />
    );
  }

  render() {
    const {
      fields: { username, email, selectedConnection },
      handleSubmit,
      connection,
      invitations
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

            { this.renderUsername(connection, selectedConnection, username) }

            <InputText field={email} label="Email" type="email" fieldName={email.name} touched={email.touched} validationErrors={email.error} />

            <div className="form-group">
              <label htmlFor="connection" className="control-label col-xs-3">Connection</label>
              <div className="col-xs-9">
                <select id="connection" className="form-control" {...selectedConnection}>
                  {connection ? connection.map(connectionOption => <option value={connectionOption.name} key={connectionOption.name}>{connectionOption.name}</option>) : ''}
                </select>

                {selectedConnection.touched && selectedConnection.error && <div>{selectedConnection.error[0]}</div>}
                <p className="help-block">This is a logical identifier of the connection.</p>
              </div>
            </div>

          </div>

          <div className="modal-footer">
            { this.renderBackBtn() } { this.renderNextBtn(this.props.fields) }
          </div>
        </form>

      </div>
    );
  }
}

AddUserForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  formSubmitted: PropTypes.bool.isRequired,
  nextView: PropTypes.func.isRequired,
  goBackView: PropTypes.func.isRequired,
  clearAllFields: PropTypes.func.isRequired,
  tryAgain: PropTypes.func.isRequired,
  resetForm: PropTypes.func.isRequired,
  connection: PropTypes.array,
  invitations: PropTypes.object
};

function mapStateToProps(state) {
  const connection = state.connection.toJS().connection;

  return {
    connection,
    initialValues: {
      selectedConnection: (connection && connection.length) ? connection[0].name : '',
      connection // NOTE: we pass the connection here to be able to do the initial validation (see 'validate' function)
    }
  };
}

export default reduxForm({
  form: 'add user',
  fields,
  validate
}, mapStateToProps)(AddUserForm);
