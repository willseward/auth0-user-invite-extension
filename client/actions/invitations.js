import axios from 'axios';
import * as constants from '../constants';

/*
 * Load the invitations.
 */
export function fetchInvitations(filter) {
  return (dispatch) => {
    dispatch({
      type: constants.FETCH_INVITATIONS_INIT, // create constant
      payload: {
        data: {
          filter
        }
      }
    });

    dispatch({
      type: constants.FETCH_INVITATIONS,
      payload: {
        promise: axios.get(`/api/invitations?filter=${filter}`, {
          timeout: 5000,
          responseType: 'json'
        })
      }
    })
  };
}
