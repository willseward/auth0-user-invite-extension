import { combineReducers } from 'redux';
import reduceReducers from 'reduce-reducers';
import {reducer as formReducer} from 'redux-form';

import { auth } from './auth';
import { invitations } from './invitations';
import { csvInvitations } from './csvInvitations';
import { connection } from './connection';
import { importReducer } from './import';
import { templateConfiguration } from './templateConfiguration';
import { emailConfiguration } from './emailConfiguration';
import { changePassword } from './changePassword';

export default combineReducers({
  auth,
  templateConfiguration,
  emailConfiguration,
  changePassword,
  invitations,
  csvInvitations,
  connection,
  importReducer,
  form: formReducer
});
