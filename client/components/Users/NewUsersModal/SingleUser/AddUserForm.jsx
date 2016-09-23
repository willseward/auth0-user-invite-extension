import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { Button, ButtonToolbar } from 'react-bootstrap';

import { Error } from '../../../Messages';

export const fields = [ 'username', 'email', 'selectedConnection', 'connection' ];

const validate = values => {
  const errors = {}

  if (!values.selectedConnection) {
    errors.selectedConnection = 'Required';
  }

  var connection = _.find(values.connection, (item) => item.name === values.selectedConnection);

  if (!connection || !connection.name) {
    errors.selectedConnection = 'Required';
  }

  if (!values.username && connection && connection.requires_username) {
    errors.username = 'Required'; //may be required or not, depending on the connection
  }

  if (!values.email) {
    errors.email = 'Required';
  }

  return errors;
}

class AddUserForm extends Component {

  componentWillReceiveProps(nextProps) {
    if (nextProps.formSubmitted && !nextProps.invitations.loadingUser
      && !nextProps.invitations.error) {
      this.props.resetForm(); //reset email and username properties
      this.props.nextView();
    }
  }

  renderNextBtn() {
    return (
      <Button
        type="button"
        className="btn btn-primary" type="submit">
          Create
      </Button>
    );
  }

  renderBackBtn() {
    return (
      <Button
        type="button"
        className="btn btn-transparent"
        onClick={this.props.goBackView}>
          Back
      </Button>
    );
  }

  renderUsername(connection, connectionField, usernameField) {
    if (!connectionField || !connectionField.value) {
      return null;
    }

    let selectedConnection = _.find(connection, (item) => item.name === connectionField.value);
    if (!selectedConnection || !selectedConnection.requires_username) {
      return null;
    }

    return (
      <div className="form-group">
        <label className="control-label col-xs-2">Username</label>
        <div className="col-xs-10">
          <input className="form-control" type="text" {...usernameField} />
          {usernameField.touched && usernameField.error && <div>{usernameField.error}</div>}
        </div>
      </div>
    );
  }

  clearAllFields() {
    this.props.resetForm();
    this.props.clearAllFields();
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
            <Error message={invitations.error ? invitations.error : ''}/>

            { this.renderUsername(connection, selectedConnection, username) }

            <div className="form-group">
              <label className="control-label col-xs-2">Email</label>
              <div className="col-xs-10">
                <input className="form-control" type="email"
                {...email}
                />
                {email.touched && email.error && <div>{email.error}</div>}
              </div>
            </div>

            <div className="form-group">
              <label className="control-label col-xs-2">Connection</label>
              <div className="col-xs-10">
                <select className="form-control" {...selectedConnection}>
                  {connection ? connection.map(connectionOption => <option value={connectionOption.name} key={connectionOption.name}>{connectionOption.name}</option>) : ''}
                </select>

                {selectedConnection.touched && selectedConnection.error && <div>{selectedConnection.error}</div>}
                <p className="help-block">This is a logical identifier of the connection.</p>
              </div>
            </div>

          </div>

          <div className="modal-footer">
            { this.renderBackBtn() } { this.renderNextBtn() }
          </div>
        </form>

      </div>
    )
  }
}

AddUserForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  formSubmitted: PropTypes.bool.isRequired,
  nextView: PropTypes.func.isRequired,
  goBackView: PropTypes.func.isRequired,
  clearAllFields: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  var connection = state.connection.toJS().connection;

  return {
    connection: connection,
    initialValues: {
      selectedConnection: (connection && connection.length) ? connection[0].name : '',
      connection: connection // NOTE: we pass the connection here to be able to do the initial validation (see 'validate' function)
    }
  }
}

export default reduxForm({
  form: 'add user',
  fields,
  validate
}, mapStateToProps)(AddUserForm)
