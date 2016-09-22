import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  validationErrors: '',
  invitations: [ ],
  current: 0,
  failed: 0
};

/*
 * Auxiliary function to update invitations state.
 */
function updateInvitations(state, user) {
  return state.get('invitations').map((v) => {
    const vEmail = v.get('email');

    if (vEmail !== user.email) {
      return v;
    }

    return v.set('status', user.status);
  });
}

export const csvInvitations = createReducer(fromJS(initialState), {
  [constants.INVITE_USERS_PREVIEW]: (state, action) => {
    const { user } = action.payload.data;

    return state.merge({
      loading: false,
      invitations: [
        ...state.get('invitations'),
        user
      ]
    });
  },
  [constants.INVITE_USERS_REJECTED]: (state, action) => {
    const { data } = action.payload.response;
    const configData = JSON.parse(action.payload.config.data);

    const user = {
      email: configData.user.email,
      status: data.message
    };
    return state.merge({
      loading: false,
      invitations: updateInvitations(state, user),
      current: state.get('current') + 1,
      failed: state.get('failed') + 1
    });
  },
  [constants.INVITE_USERS_FULFILLED]: (state, action) => {
    const configData = JSON.parse(action.payload.config.data);

    const user = {
      email: configData.user.email,
      status: 'Invite sent.'
    };

    return state.merge({
      loading: false,
      invitations: updateInvitations(state, user),
      current: state.get('current') + 1,
    });
  },
  [constants.FORM_VALIDATION_FAILED]: (state, action) =>
    state.merge({
      loading: false,
      validationErrors: action.payload.error
    }),
  [constants.CLEAR_FORM_VALIDATION_ERROR]: (state, action) =>
    state.merge({
      loading: false,
      validationErrors: ''
    }),
  [constants.CLEAR_CSV_USERS]: (state) =>
    state.merge({
      ...initialState
    })
});
