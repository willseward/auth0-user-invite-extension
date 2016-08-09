import axios from 'axios';
import Papa from 'papaparse';
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
    });
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


export function inviteUsersPreview(file) {
  const formData = new FormData();

  if (file.status === 'queued') {
    formData.userFile = file;
  }

  if (!formData.userFile) {
    if (file.size) {
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
        const usersData = processCSVData(event.currentTarget.result);

        if (usersData.errors.length) {
          return dispatch({
            type: constants.FORM_VALIDATION_FAILED,
            payload: {
              error: 'There was an error with the submited file. Please check if you have some errors.'
            }
          });
        }

        usersData.data.map((user) => {
          if (user.email && user.email.length) {
            const userData = {
              email: user.email
            };

            dispatch({
              type: constants.INVITE_USERS_PREVIEW,
              payload: {
                data: { userData }
              }
            });
          }
        });
      });
      fileReader.readAsText(formData.userFile);
    }
  };
}


/*
 * Import a list of users to a specific connection.
 */
export function inviteUsers(csvInvitations, connection) {
  if (!connection) {
    return {
      type: constants.FORM_VALIDATION_FAILED,
      payload: {
        error: 'Please choose a connection.'
      }
    };
  }

  return (dispatch) => {
    if (csvInvitations) {
      csvInvitations.invitations.map((user) => {
        if (user.email && user.email.length) {
          const userData = {
            email: user.email,
            connection
          };

          dispatch({
            type: constants.INVITE_USERS,
            payload: {
              promise: axios({
                method: 'post',
                url: '/api/invitations/user',
                data: { userData },
                responseType: 'json'
              })
            }
          });
        }
      });
    }
  };
}

export function clearCSVUsers() {
  return {
    type: constants.CLEAR_CSV_USERS
  };
}
