/*
 * Invitations.
 */

// Fetch.
export const FETCH_INVITATIONS = 'FETCH_INVITATIONS';
export const FETCH_INVITATIONS_INIT = 'FETCH_INVITATIONS_INIT';
export const FETCH_INVITATIONS_REJECTED = 'FETCH_INVITATIONS_REJECTED';
export const FETCH_INVITATIONS_FULFILLED = 'FETCH_INVITATIONS_FULFILLED';

// Invite User.
export const INVITE_USER = 'INVITE_USER';
export const INVITE_USER_PENDING = 'INVITE_USER_PENDING';
export const INVITE_USER_REJECTED = 'INVITE_USER_REJECTED';
export const INVITE_USER_FULFILLED = 'INVITE_USER_FULFILLED';
export const CLEAR_INVITE_USER_ERROR = 'CLEAR_INVITE_USER_ERROR';

// Invite Users (save state from CSV invited users).
export const INVITE_USERS = 'INVITE_USERS';
export const INVITE_USERS_REJECTED = 'INVITE_USERS_REJECTED';
export const INVITE_USERS_FULFILLED = 'INVITE_USERS_FULFILLED';
export const INVITE_USERS_PREVIEW = 'INVITE_USERS_PREVIEW';
export const CLEAR_CSV_USERS = 'CLEAR_CSV_USERS';
export const SET_SELECTED_CONNECTION = 'SET_SELECTED_CONNECTION';

/*
 * Import.
 */
export const CLEAR_IMPORT = 'CLEAR_IMPORT';
export const DROPPED_FILE = 'DROPPED_FILE';

export const IMPORT_USERS_VALIDATION_FAILED = 'IMPORT_USERS_VALIDATION_FAILED';
export const FORM_VALIDATION_FAILED = 'FORM_VALIDATION_FAILED';
export const CLEAR_FORM_VALIDATION_ERROR = 'CLEAR_FORM_VALIDATION_ERROR';
export const MAX_CSV_RECORDS_ERROR = 'MAX_CSV_RECORDS_ERROR'; 

// Connections.
export const FETCH_CONNECTIONS = 'FETCH_CONNECTIONS';
export const FETCH_CONNECTIONS_PENDING = 'FETCH_CONNECTIONS_PENDING';
export const FETCH_CONNECTIONS_REJECTED = 'FETCH_CONNECTIONS_REJECTED';
export const FETCH_CONNECTIONS_FULFILLED = 'FETCH_CONNECTIONS_FULFILLED';

/*
 * Template Configuration.
 */

// Fetch.
export const FETCH_TEMPLATE_CONFIGURATION = 'FETCH_TEMPLATE_CONFIGURATION';
export const FETCH_TEMPLATE_CONFIGURATION_PENDING = 'FETCH_TEMPLATE_CONFIGURATION_PENDING';
export const FETCH_TEMPLATE_CONFIGURATION_REJECTED = 'FETCH_TEMPLATE_CONFIGURATION_REJECTED';
export const FETCH_TEMPLATE_CONFIGURATION_FULFILLED = 'FETCH_TEMPLATE_CONFIGURATION_FULFILLED';

// Save.
export const SAVE_TEMPLATE_CONFIGURATION = 'SAVE_TEMPLATE_CONFIGURATION';
export const SAVE_TEMPLATE_CONFIGURATION_PENDING = 'SAVE_TEMPLATE_CONFIGURATION_PENDING';
export const SAVE_TEMPLATE_CONFIGURATION_REJECTED = 'SAVE_TEMPLATE_CONFIGURATION_REJECTED';
export const SAVE_TEMPLATE_CONFIGURATION_FULFILLED = 'SAVE_TEMPLATE_CONFIGURATION_FULFILLED';

/*
 * Configuration Status.
 */

// Fetch.
export const FETCH_CONFIGURATION_STATUS = 'FETCH_CONFIGURATION_STATUS';
export const FETCH_CONFIGURATION_STATUS_REJECTED = 'FETCH_CONFIGURATION_STATUS_REJECTED';
export const FETCH_CONFIGURATION_STATUS_FULFILLED = 'FETCH_CONFIGURATION_STATUS_FULFILLED';

/*
 * Change Password.
 */

// Fetch.
export const VALIDATE_USER_TOKEN = 'VALIDATE_USER_TOKEN';
export const VALIDATE_USER_TOKEN_PENDING = 'VALIDATE_USER_TOKEN_PENDING';
export const VALIDATE_USER_TOKEN_REJECTED = 'VALIDATE_USER_TOKEN_REJECTED';
export const VALIDATE_USER_TOKEN_FULFILLED = 'VALIDATE_USER_TOKEN_FULFILLED';

// Save.
export const SAVE_PASSWORD = 'SAVE_PASSWORD';
export const SAVE_PASSWORD_PENDING = 'SAVE_PASSWORD_PENDING';
export const SAVE_PASSWORD_REJECTED = 'SAVE_PASSWORD_REJECTED';
export const SAVE_PASSWORD_FULFILLED = 'SAVE_PASSWORD_FULFILLED';

/*
 * Auth.
 */

// Token.
export const LOADED_TOKEN = 'LOADED_TOKEN';
export const RECIEVED_TOKEN = 'RECIEVED_TOKEN';

// Login.
export const SHOW_LOGIN = 'SHOW_LOGIN';
export const REDIRECT_LOGIN = 'REDIRECT_LOGIN';
export const LOGIN_PENDING = 'LOGIN_PENDING';
export const LOGIN_FAILED = 'LOGIN_FAILED';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';

// Logout.
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
