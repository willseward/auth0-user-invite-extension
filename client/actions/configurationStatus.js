import axios from 'axios';

import * as constants from '../constants';

/*
 * Fetch the configuration status
 */
export function fetchConfigurationStatus() {
  return {
    type: constants.FETCH_CONFIGURATION_STATUS,
    payload: {
      promise: axios.get('/api/config/status', {
        responseType: 'json'
      })
    }
  };
}
