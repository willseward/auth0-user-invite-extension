import axios from 'axios';
import * as constants from '../constants';

/*
 * Load email settings configuration data.
 */
export function validateUserToken(token) {
  return {
    type: constants.VALIDATE_USER_TOKEN,
    payload: {
      promise: axios.put(`/api/changepassword?token=${token}`, {
        responseType: 'json'
      })
    }
  };
}

/*
 * Save the email settings configuration.
 */
export function savePassword(user, config, token) {

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

  let userData = {
    password: config.password,
    id: user.user_id,
    token: token // token from params and not token from user
  };

  return {
    type: constants.SAVE_PASSWORD,
    payload: {
      promise: axios({
        method: 'post',
        url: '/api/changepassword',
        data: {
          user: userData
        },
        responseType: 'json'
      })
    }
  };
}
