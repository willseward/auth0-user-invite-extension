import React, { PropTypes, Component } from 'react';
import { Modal, Button } from 'react-bootstrap';

import connectContainer from 'redux-static';
import { invitationsActions } from '../actions';

export default connectContainer(class extends Component {

  constructor() {
    super();

    this.state = {
      email: '',
      selectedConnection: ''
    };

    this.changeEmail = this.changeEmail.bind(this);
    this.changeConnection = this.changeConnection.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  static stateToProps = (state) => {
    return {
      connection: state.connection
    }
  }

  static actionsToProps = {
    ...invitationsActions
  }

  static propTypes = {
    inviteUser: PropTypes.func.isRequired
  }

  changeEmail(ev) {
    this.setState({
      email: ev.target.value
    });
  }

  changeConnection(ev) {
    this.setState({
      selectedConnection: ev.target.value
    });
  }

  onClick() {

    if (!this.state.email.length || !this.state.selectedConnection.length) {
      // TODO show error
      return;
    }

    this.props.inviteUser({
      email: this.state.email,
      connection: this.state.selectedConnection
    });

    // reset values
    this.setState({
      email: '',
      selectedConnection: ''
    });
  }

  renderAddUserBtn() {
    return (
      <Button bsSize="small" data-toggle="modal" data-target="#modal-add-user" className="btn-success">
        <i className="icon icon-budicon-473"></i> Add Single User
        <Modal></Modal>
      </Button>
    )
  }

  render() {

    const { error, connection, loading } = this.props.connection.toJS();

    if (!connection || !connection.length) {
      return (<div>{this.renderAddUserBtn()}</div>);
    }

    let connectionOptions = connection.map((item) => {
      return <option key={item}>{item}</option>
    });

    return (
      <div className="modal-container">
        {this.renderAddUserBtn()}
        <div id="modal-add-user" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" className="modal">
          <div className="modal-backdrop"></div>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header has-border">
                <Button type="button" data-dismiss="modal" className="close">
                  <span aria-hidden="true">×</span><span className="sr-only">Close</span>
                </Button>
                <h4 id="myModalLabel" className="modal-title">Invite User</h4>
              </div>
              <form id="add-user-form">
                <div className="modal-body">
                  <div className="row">
                    <div className="col-xs-12 form-group">
                      <label htmlFor="email" className="control-label col-xs-3">Email</label>
                      <div className="col-xs-9">
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={this.state.email}
                          onChange={this.changeEmail}
                          className="input-block-level form-control"/>
                      </div>
                    </div>
                    <div className="col-xs-12 form-group">
                      <label htmlFor="connection" className="control-label col-xs-3">Connection</label>
                      <div className="col-xs-9">
                        <select className="form-control"
                          name="connection"
                          value={this.state.selectedConnection}
                          onChange={this.changeConnection}>
                          { connectionOptions }
                        </select>
                        <p className="help-block">This is a logical identifier of the connection.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                {/*  data-dismiss="modal" */}
                  <Button type="submit"
                    className="btn btn-primary"

                    value="validate"
                    onClick={this.onClick}>
                      Invite User
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

    );
  }
});
