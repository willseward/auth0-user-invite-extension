import React, { PropTypes, Component } from 'react';
import { Modal, Button } from 'react-bootstrap';

import connectContainer from 'redux-static';
import { invitationsActions } from '../../../../actions';

import AddUserForm from './AddUserForm';

export default connectContainer(class AddUserModal extends Component {

  constructor() {
    super();

    this.state = {
      formSubmitted: false,
      shouldResetForm: false
    };

    this.clearAllFields = this.clearAllFields.bind(this);
  }

  static stateToProps = (state) => {
    return {
      invitations: state.invitations
    }
  }

  static actionsToProps = {
    ...invitationsActions
  }

  static propTypes = {
    inviteUser: PropTypes.func.isRequired,
    nextView: PropTypes.func.isRequired,
    tryAgain: PropTypes.func.isRequired,
  }

  handleSubmit(data) {
    let connection;
    if (data.selectedConnection && typeof data.selectedConnection === 'string') {
      connection = JSON.parse(data.selectedConnection);
    }

    let user = {
      email: data.email,
      connection: connection && connection.name ? connection.name : null
    }
    
    if (connection && connection.requires_username) {
      user.username = data.username;
    }

    this.props.inviteUser(user);

    this.setState({
      formSubmitted: true
    });
  }

  clearAllFields() {
    // reset values
    this.setState({
      formSubmitted: false,
      shouldResetForm: true
    });
  }

  handleResetForm() {
    this.setState({
      shouldResetForm: false
    });
  }

  render() {
    const invitations = this.props.invitations.toJS();

    return (
      <div>
        <div className="modal-backdrop"></div>
        <div className="modal-dialog">
          <AddUserForm
          onSubmit={this.handleSubmit.bind(this)}
          submitting={true}
          formSubmitted={this.state.formSubmitted}
          shouldResetForm={this.state.shouldResetForm}
          handleResetForm={this.handleResetForm.bind(this)}
          invitations={invitations}
          goBackView={this.props.goBackView}
          nextView={this.props.nextView} />
        </div>
      </div>
    );
  }
});
