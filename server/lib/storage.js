import Promise from 'bluebird';

import logger from './logger';
import validations from './validations';

const defaultStorage = {
  templateConfig: {
    subject: 'Welcome to Auth0',
    html: '<p>Welcome {{ email }}!</p>\n<p>You were invited to join Auth0.</p>\n<p>Click <a href="{{ url }}">here</a> to set your password.</p>'
  }
};

/*
 * Read from Webtask storage.
 */
export const readStorage = (storage) => {

  return new Promise((resolve, reject) => {
    return storage.read()
      .then((data) => {
        if (data && Object.keys(data).length === 0) {
          return resolve(defaultStorage);
        }
        return resolve(data);
      })
      .catch((err) => {
        return reject(err);
      });
  });
};

/*
 * Write to Webtask storage.
 */
export const writeStorage = (storage, data) => {
  return new Promise((resolve, reject) => {
    return storage.write(data)
      .then(() => {
        return resolve();
      })
      .catch((err) => {
        return reject(err);
      });
  });
};

/*
 * Write template config to Webtask storage.
 */
export const writeTemplateConfig = (storage, templateConfig) => {
  return readStorage(storage).then(data => {
    data.templateConfig = templateConfig || {};
    return data;
  })
  .then(data => writeStorage(storage, data));
};

export const readConfigStatus = (storage) => {
  return readStorage(storage).then(data => {

    return new Promise((resolve, reject) => {
      validations.validateTemplateConfigSchema(data.templateConfig, (err, result) => {
        if (err) {
          return reject();
        }
        return resolve();
      });
    });
  })
  .then(() => ({ hasData: true }))
  .catch(() => ({ hasData: false }));
};
