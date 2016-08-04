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
  [constants.FETCH_INVITATIONS_INIT]: (state, action) => {
    var { data } = action.payload;

    return state.mergeDeep({
      loading: {
        [data.filter]: true
      },
      invitations: {
        [data.filter]: [ ]
      }
    })
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
    })
  },
  [constants.FETCH_INVITATIONS_FULFILLED]: (state, action) => {
    const { data } = action.payload;

    return state.mergeDeep({
      loading: {
        [data.filter]: false
      },
      invitations: {
        [data.filter]: fromJS(data.result)
      }
    });

  }
});
