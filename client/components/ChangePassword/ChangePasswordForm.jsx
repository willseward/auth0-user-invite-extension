import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { Button, ButtonToolbar } from 'react-bootstrap';

export const fields = [ 'password', 'retypePassword' ];

class ChangePasswordForm extends Component {
  render() {
    const {
      fields: { password, retypePassword },
      handleSubmit,
      resetForm,
      submitting
    } = this.props;

    return (
      <form className="form-horizontal" onSubmit={handleSubmit}>

        <div className="form-group">
          <label className="control-label col-xs-2">Password</label>
          <div className="col-xs-10">
            <input className="form-control" type="password" placeholder="your password" {...password} />
          </div>
        </div>

        <div className="form-group">
          <label className="control-label col-xs-2">Retype Password</label>
          <div className="col-xs-10">
            <input className="form-control" type="password" placeholder="retype password" {...retypePassword} />
          </div>
        </div>

        <div className="form-group">
          <ButtonToolbar>
            <Button className="btn btn-primary" type="submit" disabled={submitting}>
              {submitting ? <i/> : <i/>} Save
            </Button>
            {/*<Button className="btn btn-default" type="button" disabled={submitting} onClick={resetForm}>
              Reset
            </Button>*/}
          </ButtonToolbar>
        </div>
      </form>
    )
  }
}

ChangePasswordForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
}

export default reduxForm({
  form: 'simple',
  fields
})(ChangePasswordForm)
