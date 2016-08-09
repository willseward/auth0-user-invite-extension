import axios from 'axios';
import * as constants from '../constants';
import Papa from 'papaparse';

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

/*
 * Auxiliary function to turn CSV data into an array that has the list of users
 * with respective fields (email, username, etc.)
 */
function processCSVData(csvContent) {
  return Papa.parse(csvContent, {
    delimiter: ',',
    header: true
  });
}

/*
 * Import a list of users to a specific connection.
 */
export function inviteUsers(file, connectionId) { //connection or connectionId?!
  // let jobIndex = -1;

  const formData = new FormData();
  formData.connection_id = connectionId;

  if (file.status === 'queued') {
    formData.userFile = file;
  }

  if (!formData.connection_id) {
    return {
      type: constants.FORM_VALIDATION_FAILED,
      payload: {
        error: 'Please choose a connection.'
      }
    };
  }

  if (!formData.userFile) {
    if (files.size) {
      return { type: 'NOOP' };
    }

    return {
      type: constants.FORM_VALIDATION_FAILED,
      payload: {
        error: 'Please add at least one file.'
      }
    };
  }

  return (dispatch) => {
    if (formData.userFile) {
      const fileReader = new FileReader();
      fileReader.addEventListener('load', (event) => {
        var usersData = processCSVData(event.currentTarget.result);

        if (usersData.errors.length) {
          return dispatch({
            type: constants.FORM_VALIDATION_FAILED,
            payload: {
              error: 'There was an error with the submited file. Please check if you have some errors.' //usersData.errors
            }
          });
        };

        usersData.data.map((user) => {

          if (user.email && user.email.length) {
            var user = {
              email: user.email,
              connection: connectionId
            }

            dispatch({
              type: constants.INVITE_USERS,
              payload: {
                promise: axios({
                  method: 'post',
                  url: '/api/invitations/user',
                  data: { user },
                  responseType: 'json'
                })
              }
            });
          }
        });

      });
      fileReader.readAsText(formData.userFile);
    }
  };
}

export function clearCSVUsers() {
  return {
    type: constants.CLEAR_CSV_USERS
  };
}
