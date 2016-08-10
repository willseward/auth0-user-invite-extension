import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { Button, ButtonToolbar } from 'react-bootstrap';

export const fields = [ 'from', 'subject', 'redirectTo', /*'urlLifeTime',*/ 'message' ];

class InvitationEmailForm extends Component {
  render() {
    const {
      fields: { from, subject, redirectTo, /*urlLifeTime,*/ message },
      handleSubmit,
      resetForm,
      submitting
    } = this.props;

    return (
      <form className="form-horizontal" onSubmit={handleSubmit}>

        <div className="form-group">
          <label className="control-label col-xs-2">From</label>
          <div className="col-xs-10">
            <input className="form-control" type="text" placeholder="From field will just work if you configure smtp settings" {...from}/>
          </div>
        </div>

        <div className="form-group">
          <label className="control-label col-xs-2">Subject</label>
          <div className="col-xs-10">
            <input className="form-control" type="text"
            placeholder={(this.props.configuration && this.props.configuration.subject) ? this.props.configuration.subject : 'Subject'}
            {...subject}/>
          </div>
        </div>

        <div className="form-group">
          <label className="control-label col-xs-2">Redirect To</label>
          <div className="col-xs-10">
            <input className="form-control" type="text" placeholder="Redirect To" {...redirectTo}/>
          </div>
        </div>

        {/*<div className="form-group">
          <label>URL Lifetime</label>
          <div className="col-xs-10">
            <input className="form-control" type="number" placeholder="URL Lifetime" {...urlLifeTime}/>
          </div>
        </div> */}

        <div className="form-group">
          <label className="control-label col-xs-2">Message</label>
          <div className="col-xs-10">
            {(this.props.configuration && this.props.configuration.html) ? this.props.configuration.html : ''}
            <textarea className="form-control"
              {...message}
              value={message.value || ''}/>
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
  configuration: PropTypes.object
}

export default reduxForm({
  form: 'simple',
  fields
})(InvitationEmailForm)
