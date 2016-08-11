import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { Button, ButtonToolbar } from 'react-bootstrap';

export const fields = [ 'host', 'port', 'user', 'password' ];

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
          <div className="col-xs-10">
            <input className="form-control" type="text" placeholder="smtp.gmail.com" {...host}
            value={host.value || (this.props.emailSettings ? this.props.emailSettings.host : '')}/>
          </div>
        </div>

        <div className="form-group">
          <label className="control-label col-xs-2">Port</label>
          <div className="col-xs-10">
            <input className="form-control" type="number" placeholder="465" {...port}/>
          </div>
        </div>

        <div className="form-group">
          <label className="control-label col-xs-2">Auth User</label>
          <div className="col-xs-10">
            <input className="form-control" type="email" placeholder="user@gmail.com" {...user}/>
          </div>
        </div>

        <div className="form-group">
          <label className="control-label col-xs-2">Auth Password</label>
          <div className="col-xs-10">
            <input className="form-control" type="password" placeholder="your password" {...password}/>
          </div>
        </div>

        <div className="form-group">
          <ButtonToolbar>
            <Button className="btn btn-primary" type="submit" disabled={submitting}>
              {submitting ? <i/> : <i/>} Save
            </Button>
            <Button className="btn btn-default" type="button" disabled={submitting} onClick={resetForm}>
              Reset
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
  resetForm: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired
}

export default reduxForm({
  form: 'simple',
  fields
})(EmailSettingsForm)
