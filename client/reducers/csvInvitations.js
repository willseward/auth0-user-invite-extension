import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  validationErrors: '',
  invitations: [ ],
};

export const csvInvitations = createReducer(fromJS(initialState), {
  [constants.INVITE_USERS_REJECTED]: (state, action) => {
    const { data } = action.payload;
    const configData = JSON.parse(action.payload.config.data);

    let user = {
      email: configData.user.email,
      status: data.error.message
    };

    return state.merge({
      loading: false,
      invitations: [
        ...state.get('invitations'),
        user
      ]
    });
  },
  [constants.INVITE_USERS_FULFILLED]: (state, action) => {
    const { data } = action.payload;
    const configData = JSON.parse(action.payload.config.data);

    let user = {
      email: configData.user.email,
      status: "Invite sent."
    };

    return state.merge({
      loading: false,
      invitations: [
        ...state.get('invitations'),
        user
      ]
    });
  },
  [constants.FORM_VALIDATION_FAILED]: (state, action) =>
    state.merge({
      loading: false,
      validationErrors: action.payload.error,
      error: 'Validation error'
    }),
  [constants.CLEAR_CSV_USERS]: (state, action) =>
    state.merge({
      ...initialState
    })
});
