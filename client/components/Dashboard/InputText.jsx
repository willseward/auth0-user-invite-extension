// NOTE this InputText is not the original one

import React, { Component } from 'react';
import classNames from 'classnames';

class InputText extends Component {

  render() {
    const { field, fieldName, label, type, placeholder, validationErrors } = this.props;
    const classes = classNames({
      'form-group': true,
      'has-error': field.touched && validationErrors && validationErrors.length
    });

    return (
      <div className={classes}>
        <label className="control-label col-xs-3">{label}</label>
        <div className="col-xs-9">
          <input className="form-control"  type={type} placeholder={placeholder} {...field} />
          { field.touched && validationErrors && validationErrors.length && <div className="help-block">{ validationErrors[0] }</div> }
        </div>
      </div>
    );
  }
}

InputText.propTypes = {
  field: React.PropTypes.object.isRequired,
  fieldName: React.PropTypes.string.isRequired,
  label: React.PropTypes.string.isRequired,
  type: React.PropTypes.string.isRequired,
  placeholder: React.PropTypes.string,
  validationErrors: React.PropTypes.object
};

export default InputText;
