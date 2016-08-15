import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { Button, ButtonToolbar } from 'react-bootstrap';

export const fields = [ 'email', 'selectedConnection' ];

const validate = values => {
  const errors = {}
  if (!values.email) {
    errors.email = 'Required';
  }

  if (!values.selectedConnection) {
    errors.selectedConnection = 'Required';
  }

  return errors;
}

class AddUserForm extends Component {

  componentWillReceiveProps(nextProps) {
    if (nextProps.shouldResetForm) {
      this.props.resetForm(); //reset email property
      this.props.handleResetForm();
    }
  }

  render() {
    const {
      fields: { email, selectedConnection },
      handleSubmit,
      handleResetForm,
      submitting,
      connection,
      formSubmitted,
      shouldResetForm,
      invitationsError
    } = this.props;

    return (
      <div className="modal-body">
        <form className="form-horizontal" onSubmit={handleSubmit}>
          <p className="text-center">Add an email and select a connection to add a new user.</p>

          <div className="form-group">
            <label className="control-label col-xs-2">Email</label>
            <div className="col-xs-7">
              <input className="form-control" type="email"
              {...email}
              />
            </div>
            <div className="col-xs-3">
              {email.touched && email.error && <div>{email.error}</div>}
            </div>
          </div>

          <div className="form-group">
            <label className="control-label col-xs-2">Connection</label>
            <div className="col-xs-7">
              <select className="form-control" {...selectedConnection}>
                {connection ? connection.map(connectionOption => <option value={connectionOption} key={connectionOption}>{connectionOption}</option>) : ''}
              </select>
            </div>
            <div className="col-xs-3">
              {selectedConnection.touched && selectedConnection.error && <div>{selectedConnection.error}</div>}
            </div>
            <p className="help-block">This is a logical identifier of the connection.</p>
          </div>

          { (!formSubmitted || invitationsError) ?
          <div className="form-group">
            <ButtonToolbar>
              <Button className="btn btn-primary" type="submit" disabled={submitting}>
                {submitting ? <i/> : <i/>} Invite User
              </Button>
            </ButtonToolbar>
          </div> : ''}
        </form>
      </div>
    )
  }
}

AddUserForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleResetForm: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  formSubmitted: PropTypes.bool.isRequired,
  shouldResetForm: PropTypes.bool.isRequired,
  invitationsError: PropTypes.string
}

function mapStateToProps(state) {
  var connection = state.connection.toJS().connection;

  return {
    connection: connection,
    initialValues: {
      selectedConnection: (connection && connection.length) ? connection[0] : ''
    }
  }
}

export default reduxForm({
  form: 'add user',
  fields,
  validate
}, mapStateToProps)(AddUserForm)
