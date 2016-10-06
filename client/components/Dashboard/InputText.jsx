import React from 'react';
import classNames from 'classnames';

const InputText = field => {
  const classes = classNames({
    'form-group': true,
    'has-error': field.meta.touched && field.meta.error
  });
  return (
    <div className={classes}>
      <label htmlFor={field.name} className="control-label col-xs-3">{field.label}</label>
      <div className="col-xs-9">
        <input className="form-control" {...field.input} id={field.name} type={field.type} placeholder={field.placeholder} />
        {field.meta.touched &&
        field.meta.error &&
          <span className="help-block">{field.meta.error}</span>}
      </div>
    </div>
  );
};

export default InputText;
