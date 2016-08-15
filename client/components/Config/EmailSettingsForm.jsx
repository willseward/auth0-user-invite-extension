import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { Button, ButtonToolbar } from 'react-bootstrap';

export const fields = [ 'host', 'port', 'user', 'password' ];

const validate = values => {
  const errors = {}
  if (!values.host) {
    errors.host = 'Required';
  }

  if (!values.port) {
    errors.port = 'Required';
  }

  if (!values.user) {
    errors.user = 'Required';
  }

  if (!values.password) {
    errors.password = 'Required';
  }

  return errors;
}

class EmailSettingsForm extends Component {
  render() {
    const {
      fields: { host, port, user, password },
      handleSubmit,
      resetForm,
      submitting
    } = this.props;

    return (
      <form className="form-horizontal" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="control-label col-xs-2">Host</label>
          <div className="col-xs-7">
            <input className="form-control" type="text" placeholder="smtp.gmail.com"
            {...host}
            />
          </div>
          <div className="col-xs-3">
            {host.touched && host.error && <div>{host.error}</div>}
          </div>
        </div>

        <div className="form-group">
          <label className="control-label col-xs-2">Port</label>
          <div className="col-xs-7">
            <input className="form-control" type="number" placeholder="465"
            {...port}
            />
          </div>
          <div className="col-xs-3">
            {port.touched && port.error && <div>{port.error}</div>}
          </div>
        </div>

        <div className="form-group">
          <label className="control-label col-xs-2">Auth User</label>
          <div className="col-xs-7">
            <input className="form-control" type="email" placeholder="user@gmail.com"
            {...user}
            />
          </div>
          <div className="col-xs-3">
            {user.touched && user.error && <div>{user.error}</div>}
          </div>
        </div>

        <div className="form-group">
          <label className="control-label col-xs-2">Auth Password</label>
          <div className="col-xs-7">
            <input className="form-control" type="password" placeholder="your password"
            {...password}
            />
          </div>
          <div className="col-xs-3">
            {password.touched && password.error && <div>{password.error}</div>}
          </div>
        </div>

        <div className="form-group">
          <ButtonToolbar>
            <Button className="btn btn-primary" type="submit" disabled={submitting}>
              {submitting ? <i/> : <i/>} Save
            </Button>
          </ButtonToolbar>
        </div>
      </form>
    )
  }
}

EmailSettingsForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  emailSettings: PropTypes.object
}

function mapStateToProps(state) {
  // NOTE: we should not require acess to state.templateConfiguration here,
  // but currently there is no simpler way to do it with redux-form
  let emailConfig = state.emailConfiguration.toJS().emailSettings;
  return {
    initialValues: {
      host: emailConfig.host,
      port: emailConfig.port,
      user: (emailConfig.auth ? emailConfig.auth.user : emailConfig.auth),
      password: (emailConfig.auth ? emailConfig.auth.password: emailConfig.auth)
    }
  }
}

export default reduxForm({
  form: 'email settings',
  fields,
  validate
}, mapStateToProps)(EmailSettingsForm)
