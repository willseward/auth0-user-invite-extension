import React, { Component, PropTypes } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Button, ButtonToolbar } from 'react-bootstrap';
import Codemirror from '../../components/Editor';
import { InputText } from '../../components/Dashboard';

require('codemirror/mode/xml/xml');

const validate = values => {
  const errors = {};
  if (!values.from) {
    errors.from = [ 'Address is required' ];
  }

  if (!values.subject) {
    errors.subject = [ 'Subject is required' ];
  }

  if (!values.html) {
    errors.html = [ 'Message is required' ];
  }

  return errors;
};

class InvitationEmailForm extends Component {

  renderCodemirrorField(field) {
    const messageOptions = {
      mode: 'xml' // we only support html for now
    };

    return (
      <div className="form-group">
        <label className="control-label col-xs-3" htmlFor={field.name}>{field.label}</label>
        <div className="col-xs-9">
          <Codemirror
            {...field.input}
            options={messageOptions}
            id={field.name}
          />
          {field.meta.touched && field.meta.error && <div>{field.meta.error}</div>}
        </div>
      </div>
    );
  }

  render() {
    const { handleSubmit } = this.props;

    return (
      <form className="form-horizontal" onSubmit={handleSubmit}>

        <Field name="from" component={InputText} label="From" placeholder="Address from which you will send invitation emails" type="text" />
        <Field name="subject" component={InputText} label="Subject" placeholder="Subject" type="text" />
        <Field name="html" component={this.renderCodemirrorField} label="Current Message" />

        <div className="form-group">
          <div className="col-xs-offset-3 col-xs-9">
            <ButtonToolbar>
              <Button className="btn btn-primary" type="submit">
                Save
              </Button>
            </ButtonToolbar>
          </div>
        </div>
      </form>
    );
  }
}

InvitationEmailForm.propTypes = {
  initialValues: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired
};

export default reduxForm({
  form: 'invitationEmail',
  validate
})(InvitationEmailForm);
