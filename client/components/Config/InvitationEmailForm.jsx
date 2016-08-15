import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { Button, ButtonToolbar } from 'react-bootstrap';
import Codemirror from 'react-codemirror';
require('codemirror/mode/xml/xml');

export const fields = [ 'from', 'subject', 'redirectTo' ];

const validate = values => {
  const errors = {}
  if (!values.from) {
    errors.from = 'Required';
  }

  if (!values.subject) {
    errors.subject = 'Required';
  }

  if (!values.redirectTo) {
    errors.redirectTo = 'Required';
  }

  return errors;
}

class InvitationEmailForm extends Component {

  render() {
    const {
      fields: { from, subject, redirectTo },
      handleSubmit,
      resetForm,
      submitting
    } = this.props;

    var messageOptions = {
      lineNumbers: true,
      mode: 'xml' //we only support html for now
    };

    return (
      <form className="form-horizontal" onSubmit={handleSubmit}>

        <div className="form-group">
          <label className="control-label col-xs-2">From</label>
          <div className="col-xs-5">
            <input className="form-control" type="text"
            placeholder="From field will just work if you configure smtp settings"
            {...from}
            value={from.value || (this.props.template ? this.props.template.from : '')}
            />
          </div>
          <div className="col-xs-5">
            {from.touched && from.error && <div>{from.error}</div>}
          </div>
        </div>

        <div className="form-group">
          <label className="control-label col-xs-2">Subject</label>
          <div className="col-xs-5">
            <input className="form-control" type="text"
            placeholder="Subject"
            {...subject}
            value={subject.value || (this.props.template ? this.props.template.subject: '')}
            />
          </div>
          <div className="col-xs-5">
            {subject.touched && subject.error && <div>{subject.error}</div>}
          </div>
        </div>

        <div className="form-group">
          <label className="control-label col-xs-2">Redirect To</label>
          <div className="col-xs-5">
            <input className="form-control" type="text"
            placeholder="Redirect To"
            {...redirectTo}
            value={redirectTo.value || (this.props.template ? this.props.template.redirectTo : '')}
            />
          </div>
          <div className="col-xs-5">
            {redirectTo.touched && redirectTo.error && <div>{redirectTo.error}</div>}
          </div>
        </div>

        {
          this.props.template ?
          <div className="form-group">
            <label className="control-label col-xs-2">Current Message</label>
            <div className="col-xs-10">
              <Codemirror value={this.props.message}
              onChange={this.props.updateMessage}
              options={messageOptions} />
            </div>
          </div> : ''
        }

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

InvitationEmailForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  template: PropTypes.object
}

export default reduxForm({
  form: 'simple',
  fields,
  validate
})(InvitationEmailForm)
