import axios from 'axios';
import * as constants from '../constants';

/*
 * Load email settings configuration data.
 */
export function fetchEmailSettingsConfiguration() {
  return {
    type: constants.FETCH_EMAIL_CONFIGURATION,
    payload: {
      promise: axios.get('/api/config/smtp', {
        responseType: 'json'
      })
    }
  };
}

/*
 * Save the email settings configuration.
 */
export function saveEmailSettingsConfiguration(config) {
  let data = {
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass
    }
  };

  return {
    type: constants.SAVE_EMAIL_CONFIGURATION,
    payload: {
      promise: axios({
        method: 'patch',
        url: '/api/config/smtp',
        data: data,
        responseType: 'json'
      })
    }
  };
}
