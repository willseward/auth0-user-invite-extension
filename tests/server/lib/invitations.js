import { expect } from 'chai';

import invitations from '../../../server/lib/invitations';

describe('invitations', () => {
  describe('#inviteUser', () => {
    it('should not error if payload is an object with key "email"', (done) => {
      const payload = { email: 'janedoe@enterpriseco.com' };
      invitations.inviteUser(payload, (err, result) => {
        expect(err).to.not.be.ok;
        return done();
      });
    });

    it('should error if payload is an empty object', (done) => {
      invitations.inviteUser({}, (err, result) => {
        expect(err).to.be.ok;
        return done();
      });
    });

    it('should error if payload is an object without an "email" key', (done) => {
      invitations.inviteUser({ such: 'wow' }, (err, result) => {
        expect(err).not.to.be.null;
        return done();
      });
    });

    it('should error if payload is an array', (done) => {
      invitations.inviteUser([], (err, result) => {
        expect(err).not.to.be.null;
        return done();
      });
    });

    it('should error if payload is a number', (done) => {
      invitations.inviteUser(1, (err, result) => {
        expect(err).not.to.be.null;
        return done();
      });
    });

    it('should error if payload is a string', (done) => {
      invitations.inviteUser('wow', (err, result) => {
        expect(err).not.to.be.null;
        return done();
      });
    });
  });

  describe('#inviteUsers', () => {
    it('should not error if payload is a string of CSV', (done) => {
      const csv = [
        '"janedoe","janedoe@enterpriseco.com"',
        '"joebloggs","joebloggs@enterpriseco.com"'
      ].join('\n');
      invitations.inviteUsers({ csv: csv }, (err, result) => {
        expect(err).to.not.be.ok;
        return done();
      });
    });

    it('should error if payload is an object without a "csv" key', (done) => {
      invitations.inviteUser({ such: 'wow' }, (err, result) => {
        expect(err).not.to.be.null;
        return done();
      });
    });
  });

  describe('#getInvitations', () => {
    it('should return an array if no filter is set', (done) => {
      invitations.getInvitations({}, (err, result) => {
        expect(err).not.to.be.ok;
        expect(result).to.be.an('array');
        return done();
      });
    });

    it('should return an array if filter=invited', (done) => {
      invitations.getInvitations({ filter: 'invited' }, (err, result) => {
        expect(err).not.to.be.ok;
        expect(result).to.be.an('array');
        return done();
      });
    });

    it('should return an array if filter=accepted', (done) => {
      invitations.getInvitations({ filter: 'accepted' }, (err, result) => {
        expect(err).not.to.be.ok;
        expect(result).to.be.an('array');
        return done();
      });
    });

    it('should error if filter is invalid', (done) => {
      invitations.getInvitations({ filter: 'other' }, (err, result) => {
        expect(err).not.to.be.null;
        return done();
      });
    });
  });
});
