import { expect } from 'chai';

const getChangePassURL = require('../../../server/lib/get-change-password-url');

describe('getChangePasswordURL', () => {
  it('# produces the expected dev URL', (done) => {
    const url = getChangePassURL('dev', '381335de.ngrok.io', '5586ff87-5f7f-44fa-9a19-8b2b04a6bfb6');
    expect(url).to.equal('http://381335de.ngrok.io/changepassword/5586ff87-5f7f-44fa-9a19-8b2b04a6bfb6');
    done();
  });

  it('# produces the expected prod URL', (done) => {
    const url = getChangePassURL('production', '381335de.ngrok.io', '5586ff87-5f7f-44fa-9a19-8b2b04a6bfb6');
    expect(url).to.equal('https://381335de.ngrok.io/changepassword/5586ff87-5f7f-44fa-9a19-8b2b04a6bfb6');
    done();
  });
});
