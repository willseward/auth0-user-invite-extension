import _ from 'lodash';
import Promise from 'bluebird';

import logger from '../lib/logger';

const defaultStorage = {
  templateConfig: {
    subject: 'Definetely not spam!',
    message: '<em>Hello <strong>{{ name }}</strong>.<h1>{{ message }}</h1>'
  },
  smtpConfig: {}
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
    storageContext.get((err, webtaskData) => {
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
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    storageContext.set(data, { force: 1 }, (err) => {
      if (err) {
        return reject(err);
      }

      return resolve();
    });
  });
};

/*
 * Write template config to Webtask storage.
 */
export const writeTemplateConfig = (storageContext, templateConfig) =>
  readStorage(storageContext).then(data => {
    data.smtpConfig = data.smtpConfig || {};
    data.templateConfig = templateConfig || {};
    return data;
  })
  .then(data => writeStorage(storageContext, data));

/*
 * Write smtp config to Webtask storage.
 */
export const writeSMTPConfig = (storageContext, smtpConfig) =>
  readStorage(storageContext).then(data => {
    data.templateConfig = data.templateConfig || {};
    data.smtpConfig = smtpConfig || {};
    return data;
  })
  .then(data => writeStorage(storageContext, data));
