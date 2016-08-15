import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  emailSettings: { }
};

export const emailConfiguration = createReducer(fromJS(initialState), {
  [constants.FETCH_EMAIL_CONFIGURATION_PENDING]: (state) =>
    state.merge({
      ...initialState,
      loading: true
    }),
  [constants.FETCH_EMAIL_CONFIGURATION_REJECTED]: (state, action) => {
    const errorMessage = action.payload.response.data.error || action.errorMessage;
    let error;
    if(errorMessage.isJoi && typeof errorMessage.details === 'object') {
      error = errorMessage.details[0].message;
    } else if(errorMessage.message) {
      error = errorMessage.message;
    } else {
      error = errorMessage;
    }

    return state.merge({
      loading: true,
      error: `An error occured while loading the configuration: ${error}`
    });
  },
  [constants.FETCH_EMAIL_CONFIGURATION_FULFILLED]: (state, action) =>
    state.merge({
      loading: false,
      emailSettings: fromJS(action.payload.data)
    }),
  [constants.SAVE_EMAIL_CONFIGURATION_PENDING]: (state) =>
    state.merge({
      loading: true
    }),
  [constants.SAVE_EMAIL_CONFIGURATION_REJECTED]: (state, action) => {

    const errorMessage = action.payload.data && action.payload.data.error && 'Validation Error' || action.errorMessage;

    return state.merge({
      loading: false,
      error: `An error occured while saving the configuration: ${errorMessage}`
    });
  },
  [constants.SAVE_EMAIL_CONFIGURATION_FULFILLED]: (state, action) => {

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
        emailSettings: data,
        error: null
      });
    }
});
