import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { Button, ButtonToolbar } from 'react-bootstrap';

export const fields = [ 'host', 'port', 'secure', 'user', 'pass' ];

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

  if (!values.pass) {
    errors.pass = 'Required';
  }

  return errors;
}

class EmailSettingsForm extends Component {
  render() {
    const {
      fields: { host, port, secure, user, pass },
      handleSubmit,
      resetForm,
      submitting
    } = this.props;

    return (
      <form className="form-horizontal" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="control-label col-xs-2">Host</label>
          <div className="col-xs-7">
            <input className="form-control" type="text" placeholder="your.smtp.host.com"
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
            <input className="form-control" type="number" placeholder="587"
            {...port}
            />
          </div>
          <div className="col-xs-3">
            {port.touched && port.error && <div>{port.error}</div>}
          </div>
        </div>

        <div className="form-group">
          <label className="control-label col-xs-2">Require TLS?</label>
          <div className="col-xs-7">
            <input type="checkbox" {...secure}/>
          </div>
          <div className="col-xs-3">
            {secure.touched && secure.error && <div>{secure.error}</div>}
          </div>
        </div>

        <div className="form-group">
          <label className="control-label col-xs-2">Auth User</label>
          <div className="col-xs-7">
            <input className="form-control" type="text" placeholder="SMTP username"
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
            <input className="form-control" type="password" placeholder="SMTP password"
            {...pass}
            />
          </div>
          <div className="col-xs-3">
            {pass.touched && pass.error && <div>{pass.error}</div>}
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
  submitting: PropTypes.bool.isRequired
}

function mapStateToProps(state) {
  // NOTE: we should not require acess to state.templateConfiguration here,
  // but currently there is no simpler way to do it with redux-form
  let emailConfig = state.emailConfiguration.toJS().emailSettings;
  return {
    initialValues: {
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure || false,
      user: (emailConfig.auth ? emailConfig.auth.user : emailConfig.auth),
      pass: (emailConfig.auth ? emailConfig.auth.pass: emailConfig.auth)
    }
  }
}

export default reduxForm({
  form: 'email settings',
  fields,
  validate
}, mapStateToProps)(EmailSettingsForm)
