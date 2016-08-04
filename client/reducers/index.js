import { combineReducers } from 'redux';

import { auth } from './auth';
import { invitations } from './invitations';

export default combineReducers({
  auth,
  invitations
});
