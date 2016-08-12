import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  validateTokenErrors: '',
  saveValidationErrors: '',
  user: ''
};

export const changePassword = createReducer(fromJS(initialState), {
  [constants.VALIDATE_USER_TOKEN_PENDING]: (state) =>
    state.merge({
      ...initialState,
      loading: true
    }),
  [constants.VALIDATE_USER_TOKEN_REJECTED]: (state, action) => {

    const errorMessage = action.payload.response.data.error || action.errorMessage;
    return state.merge({
      loading: true,
      validateTokenErrors: `An error occured while validating: ${errorMessage}`
    });
  },
  [constants.VALIDATE_USER_TOKEN_FULFILLED]: (state, action) => {
    return state.merge({
      loading: false,
      user: fromJS(action.payload.data)
    });
  },
  [constants.SAVE_PASSWORD_PENDING]: (state) =>
    state.merge({
      loading: true
    }),
  [constants.SAVE_PASSWORD_REJECTED]: (state, action) => {
    const errorMessage = action.payload.data && action.payload.data.error && 'Validation Error' || action.errorMessage;

    return state.merge({
      loading: false,
      error: `An error occured while saving: ${errorMessage}`
    });
  },
  [constants.SAVE_PASSWORD_FULFILLED]: (state, action) =>
    state.merge({
      loading: false
    }),
  [constants.SAVE_PASSWORD_VALIDATION_FAILED]: (state, action) =>
    state.merge({
      loading: false,
      saveValidationErrors: action.payload.error
    }),
});
