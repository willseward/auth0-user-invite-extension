import React, { PropTypes, Component } from 'react';
import { Modal, Button } from 'react-bootstrap';

import connectContainer from 'redux-static';
import { invitationsActions } from '../../actions';

import AddUserForm from './AddUserForm';
import Error from '../Messages/Error';
import Info from '../Messages/Info';
import Success from '../Messages/Success';

export default connectContainer(class extends Component {

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
    inviteUser: PropTypes.func.isRequired
  }

  handleSubmit(data) {

    this.props.inviteUser({
      email: data.email,
      connection: data.selectedConnection
    });

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


  renderAddUserBtn() {
    return (
      <Button type="button" bsSize="small" data-toggle="modal" data-target="#modal-add-user" className="btn btn-success">
        <i className="icon icon-budicon-473"></i> Add Single User
        <Modal></Modal>
      </Button>
    );
  }

  renderCloseModalFooter(invitationsError) {
    if (this.state.formSubmitted && !invitationsError) {
      return (
        <div className="modal-footer">
          <Button
            className="btn btn-default"
            data-dismiss="modal"
            onClick={this.clearAllFields}>
              Close
          </Button>
        </div>
      );
    }
  }

  render() {

    const invitations = this.props.invitations.toJS();

    return (
      <div className="modal-container">
        {this.renderAddUserBtn()}
        <div id="modal-add-user" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" className="modal">
          <div className="modal-backdrop"></div>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header has-border">
                <Button type="button" data-dismiss="modal" className="close" onClick={this.clearAllFields}>
                  <span aria-hidden="true">×</span><span className="sr-only">Close</span>
                </Button>
                <h4 id="myModalLabel" className="modal-title">Invite User</h4>
              </div>

              <Error message={invitations.error ? invitations.error : ''}/>
              <Success message={(this.state.formSubmitted && !invitations.loading
                && !invitations.error) ? 'User Added.' : ''}/>

              <AddUserForm
              onSubmit={this.handleSubmit.bind(this)}
              submitting={true}
              formSubmitted={this.state.formSubmitted}
              shouldResetForm={this.state.shouldResetForm}
              handleResetForm={this.handleResetForm.bind(this)}
              invitationsError={invitations.error} />

              {this.renderCloseModalFooter(invitations.error)}
            </div>
          </div>
        </div>
      </div>
    );
  }
});
