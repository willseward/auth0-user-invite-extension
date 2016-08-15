import { combineReducers } from 'redux';
import {reducer as formReducer} from 'redux-form';

import { auth } from './auth';
import { invitations } from './invitations';
import { csvInvitations } from './csvInvitations';
import { connection } from './connection';
import { importReducer } from './import';
import { templateConfiguration } from './templateConfiguration';
import { emailConfiguration } from './emailConfiguration';

export default combineReducers({
  auth,
  templateConfiguration,
  emailConfiguration,
  invitations,
  csvInvitations,
  connection,
  importReducer,
  form: formReducer
});
