import React, { PropTypes, Component } from 'react';
import { Button, ButtonToolbar } from 'react-bootstrap';
import connectContainer from 'redux-static';

import { invitationsActions } from '../actions';

import { Error, LoadingPanel } from '../components/Dashboard';
import InvitationsTable from '../components/InvitationsTable';
import AddUserModal from '../components/AddUserModal';
import CSVModal from '../components/CSVModal';

export default connectContainer(class extends Component {

  static stateToProps = (state) => {
    return {
      invitations: state.invitations
    }
  }

  static actionsToProps = {
    ...invitationsActions
  }

  static propTypes = {
    filter: PropTypes.string.isRequired,
    invitations: PropTypes.object.isRequired,
    fetchInvitations: PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.fetchInvitations(this.props.filter);
  }

  render() {
    const { error, invitations, loading } = this.props.invitations.toJS();
    return (
      <div>
        <LoadingPanel show={loading[this.props.filter]} animationStyle={{ paddingTop: '5px', paddingBottom: '5px' }}>
          <div className="row">
            <div className="col-xs-12">
              <ButtonToolbar className="pull-right">
                <AddUserModal />
                <CSVModal />
              </ButtonToolbar>
            </div>
            <div className="col-xs-12">
              <Error message={(error && error[this.props.filter]) ? error[this.props.filter] : '' } />
              <InvitationsTable invitations={invitations[this.props.filter]}/>
            </div>
          </div>
        </LoadingPanel>
      </div>
    );
  }
});
