import React, { PropTypes, Component } from 'react';
import { Button, ProgressBar } from 'react-bootstrap';
import connectContainer from 'redux-static';

import '../Modal.css';
import CSVInvitationsTable from './CSVInvitationsTable';

export default connectContainer(class ImportedCSVModal extends Component {

  static stateToProps = (state) => ({
    csvInvitations: state.csvInvitations
  })

  static propTypes = {
    tryAgain: PropTypes.func.isRequired,
    csvInvitations: PropTypes.object
  }

  renderAddMoreUsersBtn() {
    return (
      <Button
        type="button"
        className="btn btn-transparent"
        onClick={this.props.tryAgain}
      >
        Add More Users
      </Button>
    );
  }

  renderDoneBtn() {
    return (
      <Button
        type="button"
        className="btn btn-primary"
        data-dismiss="modal"
        onClick={this.props.tryAgain}
      >
        Done
      </Button>
    );
  }

  render() {
    const csvInvitations = this.props.csvInvitations.toJS();

    let percentage = 0;
    const invitationsLength = csvInvitations.invitations.length;
    if (invitationsLength) {
      percentage = Math.round((csvInvitations.current / invitationsLength) * 100);
    }

    return (
      <div>
        <div className="modal-backdrop" />
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header has-border">
              <Button type="button" data-dismiss="modal" className="close" onClick={this.props.tryAgain}>
                <span aria-hidden="true">×</span><span className="sr-only">Close</span>
              </Button>
              <h4 id="importedCSVModalLabel" className="modal-title">CSV Imported!</h4>
            </div>
            <form id="imported-csv-form">
              <div className="modal-body">
                <div className="row col-xs-12">
                  <p className="text-center">CSV file imported. Successfully invited users will receive an email with a link to join.</p>
                  <p className="text-center">{csvInvitations.current === invitationsLength ? `There were ${csvInvitations.current - csvInvitations.failed} successfully imported users and ${csvInvitations.failed} that failed.` : '' }</p>
                </div>

                <div className="row">
                  <div className="col-xs-12 form-group">
                    <ProgressBar
                      active={percentage !== 100}
                      now={percentage}
                      label={`${csvInvitations.current} of ${invitationsLength}`}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-xs-12 form-group">
                    <CSVInvitationsTable {...csvInvitations} fields={[ 'email', 'status' ]} />
                  </div>
                </div>

              </div>
              <div className="modal-footer">
                { this.renderAddMoreUsersBtn() } { this.renderDoneBtn() }
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
});
