import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { Button, ButtonToolbar } from 'react-bootstrap';

export const fields = [ 'from', 'subject', 'redirectTo', 'message' ];

class InvitationEmailForm extends Component {

  render() {
    const {
      fields: { from, subject, redirectTo, message },
      handleSubmit,
      resetForm,
      submitting
    } = this.props;

    return (
      <form className="form-horizontal" onSubmit={handleSubmit}>

        <div className="form-group">
          <label className="control-label col-xs-2">From</label>
          <div className="col-xs-10">
            <input className="form-control" type="text"
            placeholder="From field will just work if you configure smtp settings"
            {...from}
            value={from.value || (this.props.template ? this.props.template.from : '')}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="control-label col-xs-2">Subject</label>
          <div className="col-xs-10">
            <input className="form-control" type="text"
            placeholder="Subject"
            {...subject}
            value={subject.value || (this.props.template ? this.props.template.subject: '')}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="control-label col-xs-2">Redirect To</label>
          <div className="col-xs-10">
            <input className="form-control" type="text"
            placeholder="Redirect To"
            {...redirectTo}
            value={redirectTo.value || (this.props.template ? this.props.template.redirectTo : '')}
            />
          </div>
        </div>

        {
          this.props.template ?
          <div className="form-group">
            <label className="control-label col-xs-2">Current Message</label>
            <div className="col-xs-10">
              <div style={{backgroundColor: '#f5f5f5'}}>
              {this.props.template.message}
              </div>
            </div>
          </div> : ''
        }

        <div className="form-group">
          <label className="control-label col-xs-2">Change Message</label>
          <div className="col-xs-10">
            <textarea className="form-control"
            value={message.value || ''}
            {...message}
            />
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

InvitationEmailForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  resetForm: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  template: PropTypes.object
}

export default reduxForm({
  form: 'simple',
  fields
})(InvitationEmailForm)
