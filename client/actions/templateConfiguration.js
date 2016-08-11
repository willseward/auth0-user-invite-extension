import axios from 'axios';
import * as constants from '../constants';

/*
 * Load email template configuration data.
 */
export function fetchTemplateConfiguration() {
  return {
    type: constants.FETCH_TEMPLATE_CONFIGURATION,
    payload: {
      promise: axios.get('/api/config/template', {
        responseType: 'json'
      })
    }
  };
}

/*
 * Save the email template configuration.
 */
export function saveTemplateConfiguration(config) {
  return {
    type: constants.SAVE_TEMPLATE_CONFIGURATION,
    payload: {
      promise: axios({
        method: 'patch',
        url: '/api/config/template',
        data: config,
        responseType: 'json'
      })
    }
  };
}
