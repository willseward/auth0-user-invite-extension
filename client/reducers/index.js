import { combineReducers } from 'redux';

import { auth } from './auth';
import { invitations } from './invitations';
import { connection } from './connection';

export default combineReducers({
  auth,
  invitations,
  connection
});
