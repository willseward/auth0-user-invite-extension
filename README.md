# Auth0 User Invitations Extension

This extension makes it possible to invite users to your Auth0 account, either individually or in bulk.

## Running

### Local Development

First create a `Client` in your account with `read:connections` and `create/read/update:users` access to the Auth0 Management API. Then create a `config.json` file under `./server/` containing the following settings:

```json
{
  "EXTENSION_SECRET": "any-random-value-will-do",
  "AUTH0_DOMAIN": "YOUR_DOMAIN",
  "AUTH0_CLIENT_ID": "AUTH0_CLIENT_ID",
  "AUTH0_CLIENT_SECRET": "YOUR_CLIENT_SECRET",
  "SMTP_HOST": "SMTP_HOST",
  "SMTP_PORT": "SMTP_PORT",
  "SMTP_SECURE": "SMTP_SECURE",
  "SMTP_AUTH_USER": "SMTP_AUTH_USER",
  "SMTP_AUTH_PASS": "SMTP_AUTH_PASS"
}
```

To run the extension locally:

```bash
npm install
npm run serve:dev
```

After that you need to use something like `ngrok` to expose the extension (Auth0 needs to reach out to the extension for authentication):

```bash
./ngrok http 3000
```

Finally you can login to the extension using your Auth0 dashboard account:

```
https://YOU.ngrok.io/login
```

### Deployment

```
npm run build
```

### Configuration

SMTP email settings can be configured when the extension is installed. If not
specified it defaults to the nodemailer stub transport (i.e. no email will be
sent, but it won't error).

The invitation email template can be configured in the configuration page in
the UI.
