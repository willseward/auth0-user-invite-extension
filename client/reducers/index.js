import { combineReducers } from 'redux';

import { auth } from './auth';
import { invitations } from './invitations';
import { connection } from './connection';
import { importReducer } from './import';

export default combineReducers({
  auth,
  invitations,
  connection,
  importReducer
});
