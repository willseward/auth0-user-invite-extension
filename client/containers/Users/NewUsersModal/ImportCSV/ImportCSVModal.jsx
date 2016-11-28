import React, { PropTypes, Component } from 'react';
import { Button } from 'react-bootstrap';
import connectContainer from 'redux-static';

import { DragAndDrop, Error } from 'auth0-extension-ui';
import { invitationsActions, importActions } from '../../../../actions';

export default connectContainer(class ImportCSVModal extends Component {

  constructor() {
    super();

    this.onDrop = this.onDrop.bind(this);
  }

  static stateToProps = (state) => ({
    importReducer: state.importReducer,
    csvInvitations: state.csvInvitations
  })

  static actionsToProps = {
    ...invitationsActions,
    ...importActions
  }

  static propTypes = {
    inviteUsersPreview: PropTypes.func.isRequired,
    handleFileDrop: PropTypes.func.isRequired,
    nextView: PropTypes.func.isRequired,
    goBackView: PropTypes.func.isRequired,
    tryAgain: PropTypes.func.isRequired,
    importReducer: PropTypes.object
  }

  componentWillReceiveProps(nextProps) {
    // means that a file was uploaded

    const { file, validationErrors } = nextProps.importReducer.toJS();
    if (file && !validationErrors.length) {
      this.props.inviteUsersPreview(file);
      this.props.nextView();
    }
  }

  onDrop(newFile) {
    this.props.handleFileDrop(newFile);
  }

  renderDropFilesArea() {
    return (<DragAndDrop onDrop={this.onDrop} />);
  }

  renderCancelBtn() {
    return (
      <Button
        type="button"
        className="btn btn-transparent"
        onClick={this.props.tryAgain}
        data-dismiss="modal"
      >
        Cancel
      </Button>
    );
  }

  renderNextBtn(file, validationErrors) {
    return (
      <Button
        type="button"
        className="btn btn-primary"
        disabled={validationErrors.length ? true : false}
      >
          Next
      </Button>
    );
  }

  renderBackBtn() {
    return (
      <Button
        type="button"
        className="btn btn-transparent"
        onClick={this.props.goBackView}
      >
          Back
      </Button>
    );
  }

  render() {
    const { file, validationErrors } = this.props.importReducer.toJS();
    return (
      <div>
        <div className="modal-backdrop" />
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header has-border">
              <Button type="button" data-dismiss="modal" className="close" onClick={this.props.tryAgain}>
                <span aria-hidden="true">×</span><span className="sr-only">Close</span>
              </Button>
              <h4 id="myModalLabel" className="modal-title">Import CSV</h4>
            </div>
            <div className="modal-body">

              <p className="text-center">Import a CSV file with all the data of your users. Note that you can only add {process.env.MAX_CSV_RECORDS} records.</p>
              <Error message={validationErrors.length ? validationErrors : ''} />

              <div className="row">
                <div className="col-xs-12 form-group">
                { this.renderDropFilesArea() }
                </div>
              </div>
            </div>
            <div className="modal-footer">
              { this.renderBackBtn() } { this.renderNextBtn(file, validationErrors) }
            </div>
          </div>
        </div>
      </div>
    );
  }
});
