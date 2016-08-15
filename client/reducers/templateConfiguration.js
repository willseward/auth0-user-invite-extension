import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  template: { }
};

export const templateConfiguration = createReducer(fromJS(initialState), {
  [constants.FETCH_TEMPLATE_CONFIGURATION_PENDING]: (state) =>
    state.merge({
      ...initialState,
      loading: true
    }),
  [constants.FETCH_TEMPLATE_CONFIGURATION_REJECTED]: (state, action) => {
    const errorMessage = action.payload.response.data.error || action.errorMessage;
    return state.merge({
      loading: true,
      error: `An error occured while loading the configuration: ${errorMessage}`
    });
  },
  [constants.FETCH_TEMPLATE_CONFIGURATION_FULFILLED]: (state, action) =>
    state.merge({
      loading: false,
      template: fromJS(action.payload.data)
    }),
  [constants.SAVE_TEMPLATE_CONFIGURATION_PENDING]: (state) =>
    state.merge({
      loading: true
    }),
  [constants.SAVE_TEMPLATE_CONFIGURATION_REJECTED]: (state, action) => {
    const errorMessage = action.payload.data && action.payload.data.error && 'Validation Error' || action.errorMessage;

    return state.merge({
      loading: false,
      error: `An error occured while saving the configuration: ${errorMessage}`
    });
  },
  [constants.SAVE_TEMPLATE_CONFIGURATION_FULFILLED]: (state, action) => {
    let data = {};
    if (action.payload.config && action.payload.config.data) {
      data = JSON.parse(action.payload.config.data);
    } else {
      return state.merge({
        loading: false,
        error: null
      })
    }

    return state.merge({
      loading: false,
      template: data,
      error: null
    })
  }
});
