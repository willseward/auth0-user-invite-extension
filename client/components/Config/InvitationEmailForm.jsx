import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { Button, ButtonToolbar } from 'react-bootstrap';
import Codemirror from '../Editor';
require('codemirror/mode/xml/xml');

export const fields = [ 'from', 'subject', 'html' ];

const validate = values => {
  const errors = {}
  if (!values.from) {
    errors.from = 'Required';
  }

  if (!values.subject) {
    errors.subject = 'Required';
  }

  if (!values.html) {
    errors.html = 'Required';
  }

  return errors;
}

class InvitationEmailForm extends Component {

  render() {
    const {
      fields: { from, subject, html },
      handleSubmit,
      submitting
    } = this.props;

    var messageOptions = {
      mode: 'xml' //we only support html for now
    };

    return (
      <form className="form-horizontal" onSubmit={handleSubmit}>

        <div className="form-group">
          <label className="control-label col-xs-2">From</label>
          <div className="col-xs-10">
            <input className="form-control" type="email"
            placeholder="Your email"
            {...from}
            />
            {from.touched && from.error && <div>{from.error}</div>}
          </div>
        </div>

        <div className="form-group">
          <label className="control-label col-xs-2">Subject</label>
          <div className="col-xs-10">
            <input className="form-control" type="text"
            placeholder="Subject"
            {...subject}
            />
            {subject.touched && subject.error && <div>{subject.error}</div>}
          </div>
        </div>

        <div className="form-group">
          <label className="control-label col-xs-2">Current Message</label>
          <div className="col-xs-10">
            <Codemirror {...html}
            options={messageOptions} />
            {html.touched && html.error && <div>{html.error}</div>}
          </div>
        </div>

        <div className="form-group">
          <div className="col-xs-offset-2 col-xs-10">
            <ButtonToolbar>
              <Button className="btn btn-primary" type="submit" disabled={submitting}>
                Save
              </Button>
            </ButtonToolbar>
          </div>
        </div>
      </form>
    )
  }
}

InvitationEmailForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired
}

function mapStateToProps(state) {
  // NOTE: we should not require acess to state.templateConfiguration here,
  // but currently there is no simpler way to do it with redux-form
  let template = state.templateConfiguration.toJS().template;

  return {
    initialValues: {
      from: template.from,
      subject: template.subject,
      html: template.html
    }
  }
}

export default reduxForm({
  form: 'invitation email',
  fields,
  validate
}, mapStateToProps)(InvitationEmailForm)
