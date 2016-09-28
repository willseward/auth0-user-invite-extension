import uuid from 'uuid';

import config from './config';
import logger from './logger';
import Email from './email';
import getChangePassURL from './get-change-password-url';

let email = null;

/*
 * List all users.
 */
function getUsers(options, callback) {
  const auth0Options = {
    sort: 'last_login:-1',
    q: `app_metadata.invite.status:${options.filter}`,
    per_page: options.perPage || 100,
    page: options.page || 0,
    include_totals: true,
    fields: 'user_id,name,email,app_metadata',
    search_engine: 'v2'
  };

  options.auth0.users.getAll(auth0Options, function onGetUsers(err, result) {
    if (err) {
      logger.debug('Error getting users:', err);
      return callback(err);
    }
    return callback(null, result);
  });
}

/*
 * Add a new user.
 */
function createUser(options, callback) {
  const token = uuid.v4();
  const auth0Options = {
    connection: options.connection,
    email: options.email,
    password: uuid.v4(), // required field
    app_metadata: {
      invite: {
        status: 'pending', // default status
        token
      }
    }
  };

  // optional value that depends on connection
  if (options.username) {
    auth0Options.username = options.username;
  }

  const changePasswordURL = getChangePassURL(config('NODE_ENV'), options.host, token);
  const transportOptions = {
    to: auth0Options.email
  };
  const templateData = {
    name: 'Auth0 Customer',
    email: auth0Options.email,
    url: changePasswordURL
  };

  let result = null;
  return options.auth0.users.create(auth0Options, function onCreateUser(err, user) {
    result = user;
    if (err) {
      logger.debug('Error creating user', err);
      return callback(err);
    }

    email.sendEmail(transportOptions, templateData, function (err, emailResult) {
      if (err) {
        logger.debug('Error sending email', err);
        // TODO should remove the added user using user_id ?
        return callback({ message: 'Error sending email. Please confirm that you have set your configurations.' });
      }
      return callback(null, result);
    });
  });
}

/*
 * Updates user "email_verified" field.
 */
const updateEmailVerified = (auth0, user, callback) => {
  return auth0.users.update({ id: user.user_id }, { email_verified: true },
    function (err, user) {
      if (err || !user) {
        logger.debug('There was a problem when updating the user email_verified field.', err);
        return callback(err);
      }
      return callback(null, user);
    });
}

const validateToken = (auth0, token, callback) => {
  const options = {
    sort: 'last_login:-1',
    q: `app_metadata.invite.token:${token}`,
    include_totals: false,
    fields: 'user_id,email,email_verified,app_metadata',
    search_engine: 'v2'
  };

  return auth0.users.get(options, function (err, users) {
    if (err || !users || !users.length || users.length !== 1) {
      logger.debug('Token is invalid or user was not found.');
      return callback({ message: err || 'Token is invalid or user was not found.' });
    }
    return callback(null, users[0]);
  });
}

/*
 * Validates user token.
 */
function validateUserToken(options, callback) {
  validateToken(options.auth0, options.token, function (err, user) {
    if (err || !user) {
      logger.debug('There was an error when validating the token.');
      return callback(err);
    }

    if (user.email_verified) {
      return callback(null, user);
    }

    updateEmailVerified(options.auth0, user, function (err, result) {
      if (err) {
        logger.debug('There was an error when updating field.');
        return callback(err);
      }
      return callback(null, result);
    });
  });
}

/*
 * Updates user with a new password. This also removes token and updates status.
 */
function savePassword(options, callback) {
  validateToken(options.auth0, options.token, function (err, user) {
    if (err || !user || user.user_id !== options.id) {
      logger.debug('There was an error when saving the user.');
      return callback(err);
    }

    return options.auth0.users.update(
      { id: options.id },
      {
        password: options.password,
        app_metadata: {
          invite: {
            status: 'accepted'
          }
        }
      }, function onUpdateUser(err, user) {
        if (err || !user) {
          logger.debug('There was an error when saving the user.');
          return callback(err);
        }
        return callback();
      });
  });
}

const configureEmail = (smtpConfig, templates) => {
  email = new Email(smtpConfig, templates);
};

module.exports = {
  getUsers,
  createUser,
  validateUserToken,
  savePassword,
  configureEmail
};
