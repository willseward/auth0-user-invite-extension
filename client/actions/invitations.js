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

export function clearImportUserError() {
  return {
    type: constants.CLEAR_IMPORT_USER_ERROR
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
              error: 'There was an error with the submitted file. Please check if you have some errors.'
            }
          });
        }

        usersData.data.map((user) => {
          if (user.email && user.email.length) {
            dispatch({
              type: constants.INVITE_USERS_PREVIEW,
              payload: {
                data: { user }
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
export function inviteUsers(invitations, connection, requiresUsername) {
  if (!connection) {
    return {
      type: constants.FORM_VALIDATION_FAILED,
      payload: {
        error: 'Please choose a connection.'
      }
    };
  }

  // remove username field if not required by this connection
  if (!requiresUsername) {
    invitations = invitations.map(item => {
      delete item.username;
      return item;
    })
  }

  return (dispatch) => {
    if (invitations) {
      dispatch({
        type: constants.SET_SELECTED_CONNECTION,
        payload: {
          selectedConnection: {
            connection,
            requiresUsername
          }
        }
      });

      invitations.map((user) => {
        if (user.email && user.email.length) {
          user.connection = connection;

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
    }
  };
}

export function clearCSVUsers() {
  return {
    type: constants.CLEAR_CSV_USERS
  };
}

export function validateCSVFields(invitations, connection, requiresUsername) {
  // confirm that all users have username field, else FORM_VALIDATION_FAILED
  if (requiresUsername) {
    const propertyUsernameNotFound = _.find(invitations, item => {
      return !item.hasOwnProperty('username') || item['username'] === '';
    });
    if (propertyUsernameNotFound) {
      return {
        type: constants.FORM_VALIDATION_FAILED,
        payload: {
          error: 'There is an error in your CSV because this connection requires username field. Select another connection or check if every row has a username and resend the file.'
        }
      };
    }
  }
  // clear validationErrors
  return {
    type: constants.CLEAR_FORM_VALIDATION_ERROR
  };
}
