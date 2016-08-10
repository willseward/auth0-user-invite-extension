import { combineReducers } from 'redux';
import reduceReducers from 'reduce-reducers';

import { auth } from './auth';
import { invitations } from './invitations';
import { csvInvitations } from './csvInvitations';
import { connection } from './connection';
import { importReducer } from './import';
import { configuration } from './configuration';

export default combineReducers({
  auth,
  configuration,
  invitations,
  csvInvitations,
  connection,
  importReducer
});
