import React, { PropTypes, Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import ImportDropFiles from './ImportDropFiles';
import { Error } from '../../../Messages';

import connectContainer from 'redux-static';
import { invitationsActions, importActions } from '../../../../actions';

export default connectContainer(class ImportCSVModal extends Component {

  constructor() {
    super();

    this.state = {
      error: ''
    }

    this.onDrop = this.onDrop.bind(this);
  }

  static stateToProps = (state) => {
    return {
      importReducer: state.importReducer,
      csvInvitations: state.csvInvitations
    }
  }

  static actionsToProps = {
    ...invitationsActions,
    ...importActions
  }

  static propTypes = {
    inviteUsersPreview: PropTypes.func.isRequired,
    handleFileDrop: PropTypes.func.isRequired,
    nextView: PropTypes.func.isRequired,
    tryAgain: PropTypes.func.isRequired,
  }

  componentWillReceiveProps() {
    // means that file was received
    if (this.state.error !== '') {
      this.setState({
        error: ''
      });
    }
  }

  onDrop(newFile) {
    this.props.handleFileDrop(newFile);
  }

  renderDropFilesArea(file) {
    if (!file) {
      return (<ImportDropFiles onDrop={this.onDrop} />);
    }
    else {
      return (
        <div>
          <p className="alert alert-info">
            File '{file.name}' added. Click 'Next' to preview users and select connection.
          </p>
        </div>
      );
    }
  }

  onSubmit(file) {
    if (!file) {
      return this.setState({
        error: 'File not uploaded.'
      });
    }

    this.props.inviteUsersPreview(file);
    this.props.nextView();
  }

  renderCancelBtn(file) {
    return (
      <Button
        type="button"
        className="btn btn-transparent"
        onClick={this.props.tryAgain}
        data-dismiss="modal">
          Cancel
      </Button>
    );
  }

  renderNextBtn(file) {
    return (
      <Button
        type="button"
        className="btn btn-primary"
        onClick={this.onSubmit.bind(this, file)}>
          Next
      </Button>
    );
  }

  renderBackBtn() {
    return (
      <Button
        type="button"
        className="btn btn-transparent"
        onClick={this.props.goBackView}>
          Back
      </Button>
    );
  }

  render() {

    const importReducer = this.props.importReducer.toJS();
    const [ importError, file, importLoading] = [
      importReducer.error,
      importReducer.file,
      importReducer.loading
    ];

    return (
      <div>
        <div className="modal-backdrop"></div>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header has-border">
              <Button type="button" data-dismiss="modal" className="close" onClick={this.props.tryAgain}>
                <span aria-hidden="true">×</span><span className="sr-only">Close</span>
              </Button>
              <h4 id="myModalLabel" className="modal-title">Import CSV</h4>
            </div>
            <div className="modal-body">

              <p className="text-center">Import a CSV file with all the data of your users.</p>
              <Error message={(this.state.error || importError) ? (this.state.error || importError) : '' } />

              <div className="row">
                <div className="col-xs-12 form-group">
                { this.renderDropFilesArea(file) }
                </div>
              </div>
            </div>
            <div className="modal-footer">
              { this.renderBackBtn() } { this.renderNextBtn(file) }
            </div>
          </div>
        </div>
      </div>
    );
  }
});
