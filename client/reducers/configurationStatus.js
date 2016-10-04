import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  status: { hasData: true }
};

export const configurationStatus = createReducer(fromJS(initialState), {
  [constants.FETCH_CONFIGURATION_STATUS]: (state) =>
    state.merge({
      ...initialState,
      loading: true
    }),
  [constants.FETCH_CONFIGURATION_STATUS_REJECTED]: (state, action) =>
    state.merge({
      loading: true,
      error: `An error occured while loading the configuration status: ${action.errorMessage}`
    }),
  [constants.FETCH_CONFIGURATION_STATUS_FULFILLED]: (state, action) =>
    state.merge({
      loading: false,
      status: fromJS(action.payload.data.result)
    })
});
