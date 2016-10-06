import React, { PropTypes, Component } from 'react';

import connectContainer from 'redux-static';
import { invitationsActions } from '../../../../actions';

import AddUserForm from './AddUserForm';

export default connectContainer(class AddUserModal extends Component {

  constructor() {
    super();

    this.state = {
      formSubmitted: false
    };
  }

  static stateToProps = (state) => ({
    invitations: state.invitations,
    connection: state.connection
  })

  static actionsToProps = {
    ...invitationsActions
  }

  static propTypes = {
    inviteUser: PropTypes.func.isRequired,
    nextView: PropTypes.func.isRequired,
    goBackView: PropTypes.func.isRequired,
    tryAgain: PropTypes.func.isRequired,
    invitations: PropTypes.object,
    connection: PropTypes.object
  }

  handleSubmit(data) {
    const connection = _.find(data.connection, (item) => item.name === data.selectedConnection);

    const user = {
      email: data.email,
      connection: connection && connection.name ? connection.name : null
    };

    if (connection && connection.requires_username) {
      user.username = data.username;
    }

    this.props.inviteUser(user);

    this.setState({
      formSubmitted: true
    });
  }

  clearAllFields() {
    if (this.state.formSubmitted) {
      this.setState({
        formSubmitted: false
      });
    }
  }

  render() {
    const invitations = this.props.invitations.toJS();
    const connection = this.props.connection.toJS().connection;
    const initialValues = {
      selectedConnection: (connection && connection.length) ? connection[0].name : '',
      connection // NOTE: we pass the connection here to be able to do the initial validation (see 'validate' function in form)
    }

    return (
      <div>
        <div className="modal-backdrop" />
        <div className="modal-dialog">
          <AddUserForm
            initialValues={initialValues}
            connection={connection}
            onSubmit={this.handleSubmit.bind(this)}
            formSubmitted={this.state.formSubmitted}
            invitations={invitations}
            goBackView={this.props.goBackView}
            nextView={this.props.nextView}
            clearAllFields={this.clearAllFields.bind(this)}
            tryAgain={this.props.tryAgain}
          />
        </div>
      </div>
    );
  }
});
