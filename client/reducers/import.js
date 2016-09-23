import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  file: null,
  validationErrors: [ ]
};

export const importReducer = createReducer(fromJS(initialState), {
  [constants.DROPPED_FILE]: (state, action) =>
    state.merge({
      file: action.payload.file,
      validationErrors: [ ]
    }),
  [constants.IMPORT_USERS_VALIDATION_FAILED]: (state, action) =>
    state.merge({
      validationErrors: action.payload.validationErrors,
      file: action.payload.file
    }),
  [constants.CLEAR_IMPORT]: (state) =>
    state.merge({
      ...initialState
    })
});
