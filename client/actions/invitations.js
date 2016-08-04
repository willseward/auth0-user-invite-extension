import axios from 'axios';
import * as constants from '../constants';

/*
 * Load the invitations.
 */
export function fetchInvitations() {
  return {
    type: constants.FETCH_INVITATIONS,
    payload: {
      promise: axios.get('/api/invitations', {
        timeout: 5000,
        responseType: 'json'
      })
    }
  };
}
