// NOTE this InputText is not the original one

import React from 'react';
import classNames from 'classnames';

const InputText = (props) => {
  const { field, label, type, placeholder, validationErrors } = props;
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
};


InputText.propTypes = {
  field: React.PropTypes.object.isRequired,
  label: React.PropTypes.string.isRequired,
  type: React.PropTypes.string.isRequired,
  placeholder: React.PropTypes.string,
  validationErrors: React.PropTypes.array
};

export default InputText;
