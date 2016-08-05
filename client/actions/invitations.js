import axios from 'axios';
import * as constants from '../constants';

/*
 * Load the invitations.
 */
export function fetchInvitations(filter) {
  return (dispatch) => {
    dispatch({
      type: constants.FETCH_INVITATIONS_INIT,
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

/*
 * Send an invitation to a user.
 */
export function inviteUser(user) {
  return {
    type: constants.INVITE_USER,
    payload: {
      promise: axios({
        method: 'post',
        url: '/api/invitations/user',
        data: { user },
        responseType: 'json'
      })
    }
  };
}
