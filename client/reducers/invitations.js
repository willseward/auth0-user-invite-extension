import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  loadingUser: false, // new user creation
  error: null,
  invitations: { }
};

export const invitations = createReducer(fromJS(initialState), {
  [constants.FETCH_INVITATIONS_INIT]: (state, action) => {
    const { data } = action.payload;

    return state.mergeDeep({
      loading: {
        [data.filter]: true
      },
      invitations: {
        [data.filter]: [ ]
      }
    });
  },
  [constants.FETCH_INVITATIONS_REJECTED]: (state, action) => {
    const { data } = action.payload;
    return state.mergeDeep({
      loading: {
        [data.filter]: true
      },
      error: {
        [data.filter]: `An error occured while loading the user list: ${action.payload.data && action.payload.data.message || action.payload.statusText}`
      }
    });
  },
  [constants.FETCH_INVITATIONS_FULFILLED]: (state, action) => {
    const { data } = action.payload;

    return state.mergeDeep({
      loading: {
        [data.filter]: false
      },
      invitations: {
        [data.filter]: fromJS(data.result.users)
      }
    });
  },
  [constants.INVITE_USER_PENDING]: (state) =>
    state.merge({
      loadingUser: true,
      error: null
    }),
  [constants.INVITE_USER_REJECTED]: (state, action) => {
    const errorMessage = action.payload.response.data || action.errorMessage;
    let error;
    if (errorMessage.message || errorMessage.response) {
      error = errorMessage.message || errorMessage.response;
    } else {
      error = errorMessage;
    }

    return state.merge({
      loadingUser: false,
      error: `An error occured while inviting an user: ${error}`
    });
  },
  [constants.INVITE_USER_FULFILLED]: (state) =>
    state.merge({
      loadingUser: false
    }),
  [constants.CLEAR_IMPORT_USER_ERROR]: (state) =>
    state.merge({
      error: null
    })
});
