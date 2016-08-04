import moment from 'moment';
import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  invitations: { }
};

export const invitations = createReducer(fromJS(initialState), {
  [constants.FETCH_INVITATIONS_PENDING]: (state) =>
    state.merge({
      loading: true,
      invitations: { }
    }),
  [constants.FETCH_INVITATIONS_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occured while loading the user list: ${action.payload.data && action.payload.data.message || action.payload.statusText}`
    }),
  [constants.FETCH_INVITATIONS_FULFILLED]: (state, action) => {
    const { data } = action.payload;
    return state.merge({
      loading: false,
      invitations: fromJS(data)
    });
  }
});
