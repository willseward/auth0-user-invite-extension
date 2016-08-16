import users from '../../lib/users';

function getUsersHandler(req, res, next) {
  let options = {
    auth0: req.auth0,
    filter: req.query.filter,
    perPage: req.query.per_page,
    page: req.query.page
  };
  users.getUsers(options, function onGetUsers(err, result) {
    if (err) {
      return next(err);
    }
    return res.json(result);
  });
}

module.exports = {
  getUsersHandler: getUsersHandler
};
