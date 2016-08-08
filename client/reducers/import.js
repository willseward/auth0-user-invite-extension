import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  file: null,
  error: null,
  validationErrors: [ ],
  // connectionId: null,
  // currentJob: null,
  // currentJobIndex: -1
};

export const importReducer = createReducer(fromJS(initialState), {
  [constants.DROPPED_FILE]: (state, action) =>
  state.merge({
    loading: false,
    file: action.payload.file
  }),
  [constants.IMPORT_USERS_VALIDATION_FAILED]: (state, action) =>
    state.merge({
      loading: false,
      validationErrors: action.payload.validationErrors,
      file: action.payload.file,
      error: 'Validation error'
    })
});
