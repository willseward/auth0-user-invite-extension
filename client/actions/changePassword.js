import axios from 'axios';
import * as constants from '../constants';

/*
 * Load email settings configuration data.
 */
export function validateUserToken() {
  return {
    type: constants.VALIDATE_USER_TOKEN,
    payload: {
      promise: axios.get('/api/changepassword', {
        responseType: 'json'
      })
    }
  };
}

/*
 * Save the email settings configuration.
 */
export function savePassword(config) {

  if (!config.password || !config.retypePassword) {
    return {
      type: constants.SAVE_PASSWORD_VALIDATION_FAILED,
      payload: {
        error: 'Please enter a password.'
      }
    };
  }

  if (config.password !== config.retypePassword) {
    return {
      type: constants.SAVE_PASSWORD_VALIDATION_FAILED,
      payload: {
        error: 'Passwords do not match.'
      }
    };
  }

  return {
    type: constants.SAVE_PASSWORD,
    payload: {
      promise: axios({
        method: 'post',
        url: '/api/changepassword',
        data: {
          password: config.password
        },
        responseType: 'json'
      })
    }
  };
}
