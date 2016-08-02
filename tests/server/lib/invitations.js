import { expect } from 'chai';

import invitations from '../../../server/lib/invitations';

describe('invitations', () => {
  describe('#inviteUser', () => {
    it.skip('should error if payload is an object', (done) => {
      invitations.inviteUser({}, (err, result) => {
        expect(err).not.to.be.null;
        return done();
      });
    });

    it.skip('should error if payload is an array', (done) => {
      invitations.inviteUser([], (err, result) => {
        expect(err).not.to.be.null;
        return done();
      });
    });

    it.skip('should error if payload is a number', (done) => {
      invitations.inviteUser(1, (err, result) => {
        expect(err).not.to.be.null;
        return done();
      });
    });

    it.skip('should not error if payload is a string', (done) => {
      invitations.inviteUser('wow', (err, result) => {
        expect(err).to.be.null;
        return done();
      });
    });
  });

  describe('#inviteUsers', () => {
    it.skip('should error if payload isn\'t a string', (done) => {
    });
  });

  describe('#getInvitations', () => {
    it('should return an array if no filter is set', (done) => {
      invitations.getInvitations({}, (err, result) => {
        expect(result).to.be.an('array');
        return done();
      });
    });

    it('should return an array if filter=invited', (done) => {
      invitations.getInvitations({ filter: 'invited' }, (err, result) => {
        expect(result).to.be.an('array');
        return done();
      });
    });

    it('should return an array if filter=accepted', (done) => {
      invitations.getInvitations({ filter: 'accepted' }, (err, result) => {
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
