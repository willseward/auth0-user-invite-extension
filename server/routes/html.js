import fs from 'fs';
import url from 'url';
import ejs from 'ejs';
import path from 'path';
import { urlHelpers } from 'auth0-extension-express-tools';

import config from '../lib/config';

export default () => {
  const template = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <title>Auth0 - User Invitations</title>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="shortcut icon" href="https://cdn.auth0.com/styleguide/4.8.10/lib/logos/img/favicon.png">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" type="text/css" href="https://cdn.auth0.com/styles/zocial.min.css">
    <link rel="stylesheet" type="text/css" href="https://cdn.auth0.com/manage/v0.3.1715/css/index.min.css">
    <link rel="stylesheet" type="text/css" href="https://cdn.auth0.com/styleguide/4.8.10/index.css">
    <% if (assets.style) { %><link rel="stylesheet" type="text/css" href="/app/<%= assets.style %>"><% } %>
    <% if (assets.version) { %><link rel="stylesheet" type="text/css" href="//cdn.auth0.com/extensions/auth0-user-invite-extension/assets/auth0-user-invite-extension.ui.<%= assets.version %>.css"><% } %>
  </head>
  <body class="a0-extension">
    <div id="app"></div>
    <script type="text/javascript" src="//cdn.auth0.com/js/lock-9.0.min.js"></script>
    <script type="text/javascript" src="//cdn.auth0.com/manage/v0.3.1715/js/bundle.js"></script>
    <script type="text/javascript">window.config = <%- JSON.stringify(config) %>;</script>
    <% if (assets.vendors) { %><script type="text/javascript" src="/app/<%= assets.vendors %>"></script><% } %>
    <% if (assets.app) { %><script type="text/javascript" src="/app/<%= assets.app %>"></script><% } %>
    <% if (assets.version) { %>
    <script type="text/javascript" src="//cdn.auth0.com/extensions/auth0-user-invite-extension/assets/auth0-user-invite-extension.ui.vendors.<%= assets.version %>.js"></script>
    <script type="text/javascript" src="//cdn.auth0.com/extensions/auth0-user-invite-extension/assets/auth0-user-invite-extension.ui.<%= assets.version %>.js"></script>
    <% } %>
  </body>
  </html>
  `;

  return (req, res) => {
    const settings = {
      AUTH0_DOMAIN: config('AUTH0_DOMAIN'),
      BASE_URL: urlHelpers.getBaseUrl(req),
      BASE_PATH: urlHelpers.getBasePath(req)
    };

    // Render from CDN.
    const clientVersion = config('CLIENT_VERSION');
    if (clientVersion) {
      return res.send(ejs.render(template, {
        config: settings,
        assets: { version: clientVersion }
      }));
    }

    // Render locally.
    return fs.readFile(path.join(__dirname, '../../dist/manifest.json'), 'utf8', (err, data) => {
      const locals = {
        config: settings,
        assets: {
          app: 'bundle.js'
        }
      };

      if (!err && data) {
        locals.assets = JSON.parse(data);
      }

      // Render the HTML page.
      res.send(ejs.render(template, locals));
    });
  };
};
