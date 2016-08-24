import _ from 'lodash';
import Promise from 'bluebird';

import logger from '../lib/logger';

const defaultStorage = {
  templateConfig: {
    subject: 'Welcome to Auth0',
    html: '<p>Welcome {{ email }}!</p>\n<p>You were invited to join Auth0.</p>\n<p>Click <a href="{{ url }}">here</a> to set your password.</p>'
  }
};

/*
 * Read from Webtask storage.
 */
export const readStorage = (storageContext) => {
  if (!storageContext) {
    logger.debug('Unable to read storage. Context not available.');
    return Promise.resolve(defaultStorage);
  }

  return new Promise((resolve, reject) => {
    return storageContext.get((err, webtaskData) => {
      if (err) {
        return reject(err);
      }

      const data = webtaskData || defaultStorage;
      return resolve(data);
    });
  });
};

/*
 * Write to Webtask storage.
 */
export const writeStorage = (storageContext, data) => {
  if (!storageContext) {
    logger.debug('Unable to write storage. Context not available.');
    return Promise.resolve(data);
  }

  return new Promise((resolve, reject) => {
    return storageContext.set(data, { force: 1 }, (err) => {
      if (err) {
        return reject(err);
      }

      return resolve(data);
    });
  });
};

/*
 * Write template config to Webtask storage.
 */
export const writeTemplateConfig = (storageContext, templateConfig) => {
  return readStorage(storageContext).then(data => {
    data.templateConfig = templateConfig || {};
    return data;
  })
  .then(data => writeStorage(storageContext, data));
}
