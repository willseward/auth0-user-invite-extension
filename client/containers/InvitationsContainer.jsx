import React, { PropTypes, Component } from 'react';
import connectContainer from 'redux-static';
import { Button } from 'react-bootstrap';

import { invitationsActions } from '../actions';

import { LoadingPanel } from '../components/Dashboard';
import { InvitationsTable } from '../components/Users';
import { Error } from '../components/Messages';

export default connectContainer(class InvitationsContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activated: false
    };
  }

  static stateToProps = (state) => {
    return {
      invitations: state.invitations
    };
  }

  static actionsToProps = {
    ...invitationsActions
  }

  static propTypes = {
    filter: PropTypes.string.isRequired,
    invitations: PropTypes.object.isRequired,
    fetchInvitations: PropTypes.func.isRequired
  }

  componentDidMount() {
    if (this.props.currentTab === this.props.filter) {
      this.props.fetchInvitations(this.props.filter);
      this.setState({
        activated: true
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    // will fetch results if we change from one tab to another
    if (!this.state.activated && nextProps.currentTab === this.props.filter) {
      this.props.fetchInvitations(this.props.filter);
      this.setState({
        activated: true
      });
    } else if (this.state.activated && nextProps.currentTab !== this.props.filter) {
      this.setState({
        activated: false
      });
    }
  }

  refresh() {
    this.props.fetchInvitations(this.props.filter);
  }

  render() {
    const { error, invitations, loading } = this.props.invitations.toJS();
    return (
      <div className="row">
        <div className="col-xs-12">
          <LoadingPanel show={loading[this.props.filter]} animationStyle={{ paddingTop: '5px', paddingBottom: '5px' }}>
            <Button type="button" className="pull-right" onClick={this.refresh.bind(this)}>Refresh</Button>
            <Error message={(error && error[this.props.filter]) ? error[this.props.filter] : ''} />
            <InvitationsTable invitations={invitations[this.props.filter]} />
          </LoadingPanel>
        </div>
      </div>
    );
  }
});
