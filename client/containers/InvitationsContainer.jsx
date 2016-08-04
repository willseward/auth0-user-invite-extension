import React, { PropTypes, Component } from 'react';
import { Button, ButtonToolbar } from 'react-bootstrap';
import connectContainer from 'redux-static';

import { invitationsActions } from '../actions';

import { Error, LoadingPanel } from '../components/Dashboard';
import InvitationsTable from '../components/InvitationsTable';

export default connectContainer(class extends Component {
  static stateToProps = (state) => ({
    invitations: state.invitations
  });

  static actionsToProps = {
    ...invitationsActions
  }

  static propTypes = {
    invitations: PropTypes.object.isRequired,
    fetchInvitations: PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.fetchInvitations();
  }

  render() {
    const { error, invitations, loading } = this.props.invitations.toJS();

    return (
      <div>
        <LoadingPanel show={loading} animationStyle={{ paddingTop: '5px', paddingBottom: '5px' }}>
          <div className="row">
            <div className="col-xs-12">
              <ButtonToolbar className="pull-right">
                <Button bsSize="small" className="btn-success">
                  <i className="icon icon-budicon-473"></i> Add Single User
                </Button>
                <Button bsSize="small" className="btn-primary">
                  <i className="icon icon-budicon-356"></i> Upload CSV
                </Button>
              </ButtonToolbar>
            </div>
            <div className="col-xs-12">
              <Error message={error} />
              <InvitationsTable error={error} invitations={invitations} />
            </div>
          </div>
        </LoadingPanel>
      </div>
    );
  }
});
