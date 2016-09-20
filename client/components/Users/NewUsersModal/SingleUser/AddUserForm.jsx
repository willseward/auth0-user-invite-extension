import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { Button, ButtonToolbar } from 'react-bootstrap';

import { Error, Info, Success } from '../../../Messages';

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
    if (nextProps.formSubmitted && !nextProps.invitations.loading
      && !nextProps.invitations.error) {
      this.props.nextView();
    }
  }

  renderNextBtn() {

    return (
      <Button
        type="button"
        className="btn btn-primary" type="submit" disabled={this.props.submitting}>
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

  render() {
    const {
      fields: { email, selectedConnection },
      handleSubmit,
      handleResetForm,
      submitting,
      connection,
      formSubmitted,
      shouldResetForm,
      invitations
    } = this.props;

    return (
      <div className="modal-content">
        <div className="modal-header has-border">
          <Button type="button" data-dismiss="modal" className="close" onClick={this.clearAllFields}>
            <span aria-hidden="true">×</span><span className="sr-only">Close</span>
          </Button>
          <h4 id="myModalLabel" className="modal-title">Create User</h4>
        </div>

        <form className="form-horizontal" onSubmit={handleSubmit}>
          <div className="modal-body">

            <p className="text-center">Create an user with connection, email and username if needed.</p>
            <Error message={invitations.error ? invitations.error : ''}/>
            <Success message={(formSubmitted && !invitations.loading
            && !invitations.error) ? 'User Added.' : ''}/>

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
  handleResetForm: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  formSubmitted: PropTypes.bool.isRequired,
  shouldResetForm: PropTypes.bool.isRequired,
  nextView: PropTypes.func.isRequired,
  goBackView: PropTypes.func.isRequired
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
