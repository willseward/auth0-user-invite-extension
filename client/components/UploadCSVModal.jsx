import React, { PropTypes, Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import ImportDropFiles from './ImportDropFiles';

import connectContainer from 'redux-static';
import { invitationsActions, importActions } from '../actions';

import CSVInvitationsTable from './CSVInvitationsTable';

export default connectContainer(class extends Component {

  constructor() {
    super();

    this.state = {
      selectedConnection: '',
      formSubmited: false
    };

    this.onDrop = this.onDrop.bind(this);
    this.changeConnection = this.changeConnection.bind(this);
    this.tryAgain = this.tryAgain.bind(this);
  }

  static stateToProps = (state) => {
    return {
      connection: state.connection,
      importReducer: state.importReducer,
      csvInvitations: state.csvInvitations
    }
  }

  static actionsToProps = {
    ...invitationsActions,
    ...importActions
  }

  static propTypes = {
    inviteUsers: PropTypes.func.isRequired,
    handleFileDrop: PropTypes.func.isRequired,
    clearImport: PropTypes.func.isRequired,
    clearCSVUsers: PropTypes.func.isRequired
  }

  changeConnection(ev) {
    this.setState({
      selectedConnection: ev.target.value
    });
  }

  onSubmit(file) {

    if (!file || !this.state.selectedConnection.length) {
      // TODO show error
      return;
    }

    this.props.inviteUsers(file, this.state.selectedConnection);

    this.setState({
      formSubmited: true
    });
  }

  onDrop(newFile) {
    this.props.handleFileDrop(newFile);
  }

  tryAgain() {
    this.props.clearImport();

    if (this.state.formSubmited) {
      this.setState({
        formSubmited: false
      });
      this.props.clearCSVUsers();
    }
  }

  renderUploadCSVModal() {
    return (
      <Button bsSize="small" data-toggle="modal" data-target="#modal-upload-csv" className="btn-primary">
        <i className="icon icon-budicon-356"></i> Upload CSV
        <Modal></Modal>
      </Button>
    );
  }

  renderDropFilesArea(file) {
    if (!file) {
      return (<ImportDropFiles onDrop={this.onDrop} />);
    }
    else {
      return (
        <div className="alert alert-info">
          File '{file.name}' added. Click 'Invite Users' to invite users to the specified connection.
        </div>
      );
    }
  }

  renderTryAgainBtn() {
    return (
      <Button type="button"
        className="btn btn-primary btn-xs"
        onClick={this.tryAgain}>
          Try Again
      </Button>
    );
  }

  renderImportError(validationErrors) {
    return (
      <div className="alert alert-danger">
        <strong>Error</strong> { validationErrors } {this.renderTryAgainBtn()}
      </div>
    );
  }

  renderSubmitBtn(file) {
    return (
      <Button
        type="button"
        className="btn btn-primary"
        onClick={this.onSubmit.bind(this, file)}>
          Invite Users
      </Button>
    );
  }

  renderSendAnotherBtn() {
    return (
      <Button
        type="button"
        className="btn btn-info"
        onClick={this.tryAgain}>
          Send Another File
      </Button>
    );
  }

  renderCloseBtn() {
    return (
      <Button
        type="button"
        className="btn btn-default"
        data-dismiss="modal"
        onClick={this.tryAgain}>
          Close
      </Button>
    );
  }

  render() {

    const { error, connection, loading } = this.props.connection.toJS();
    const importReducer = this.props.importReducer.toJS();
    const [ importError, file, importLoading, validationErrors] = [
      importReducer.error,
      importReducer.file,
      importReducer.loading,
      importReducer.validationErrors
    ];

    const csvInvitations = this.props.csvInvitations.toJS();

    if (!connection || !connection.length) {
      return (<div>{this.renderUploadCSVModal()}</div>);
    }

    let connectionOptions = connection.map((item) => {
      return <option key={item}>{item}</option>
    });

    return (
      <div className="modal-container">
        {this.renderUploadCSVModal()}
        <div id="modal-upload-csv" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" className="modal">
          <div className="modal-backdrop"></div>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header has-border">
                <Button type="button" data-dismiss="modal" className="close">
                  <span aria-hidden="true">×</span><span className="sr-only">Close</span>
                </Button>
                <h4 id="myModalLabel" className="modal-title">Upload CSV</h4>
              </div>
              <form id="upload-csv-form">
                <div className="modal-body">
                  <div className="row">
                    <div className="col-xs-12 form-group">
                    {
                      (importError) ?
                      this.renderImportError(validationErrors) : this.renderDropFilesArea(file)
                    }
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
                  <CSVInvitationsTable {...csvInvitations} />
                </div>
                <div className="modal-footer">
                  {!this.state.formSubmited ? this.renderSubmitBtn(file) :
                      <div>{this.renderSendAnotherBtn()} {this.renderCloseBtn()}</div>}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
