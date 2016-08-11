import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  template: { },
  emailSettings: { }
};

export const configuration = createReducer(fromJS(initialState), {
  [constants.FETCH_TEMPLATE_CONFIGURATION_PENDING]: (state) =>
    state.merge({
      ...initialState,
      loading: true
    }),
  [constants.FETCH_TEMPLATE_CONFIGURATION_REJECTED]: (state, action) =>
    state.merge({
      loading: true,
      error: `An error occured while loading the configuration: ${action.errorMessage}`
    }),
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
    const errorMessage = action.payload.data && action.payload.data.errors && 'Validation Error' || action.errorMessage;

    return state.merge({
      loading: false,
      error: `An error occured while saving the configuration: ${errorMessage}`
    });
  },
  [constants.SAVE_TEMPLATE_CONFIGURATION_FULFILLED]: (state, action) =>
    state.merge({
      loading: false,
      template: fromJS(action.payload.data)
    }),
  [constants.FETCH_EMAILSETTINGS_CONFIGURATION_PENDING]: (state) =>
    state.merge({
      ...initialState,
      loading: true
    }),
  [constants.FETCH_EMAILSETTINGS_CONFIGURATION_REJECTED]: (state, action) =>
    state.merge({
      loading: true,
      error: `An error occured while loading the configuration: ${action.errorMessage}`
    }),
  [constants.FETCH_EMAILSETTINGS_CONFIGURATION_FULFILLED]: (state, action) =>
    state.merge({
      loading: false,
      emailSettings: fromJS(action.payload.data)
    }),
  [constants.SAVE_EMAILSETTINGS_CONFIGURATION_PENDING]: (state) =>
    state.merge({
      loading: true
    }),
  [constants.SAVE_EMAILSETTINGS_CONFIGURATION_REJECTED]: (state, action) => {
    const errorMessage = action.payload.data && action.payload.data.errors && 'Validation Error' || action.errorMessage;

    return state.merge({
      loading: false,
      error: `An error occured while saving the configuration: ${errorMessage}`
    });
  },
  [constants.SAVE_EMAILSETTINGS_CONFIGURATION_FULFILLED]: (state, action) =>
    state.merge({
      loading: false,
      emailSettings: fromJS(action.payload.data)
    })
});
