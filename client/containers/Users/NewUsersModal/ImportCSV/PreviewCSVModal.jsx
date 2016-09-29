import React, { PropTypes, Component } from 'react';
import { Button } from 'react-bootstrap';

import connectContainer from 'redux-static';
import { invitationsActions, importActions } from '../../../../actions';

import CSVInvitationsTable from './CSVInvitationsTable';
import { Error } from '../../../../components/Messages';

export default connectContainer(class PreviewCSVModal extends Component {

  constructor() {
    super();

    this.state = {
      selectedConnection: '',
      requiresUsername: false,
      error: ''
    };

    this.changeConnection = this.changeConnection.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // set selectedConnection default value as soon as we fetch connections
    if (this.state.selectedConnection === '' &&
      nextProps.connection.size) {
      const connection = nextProps.connection.toJS();
      if (connection && connection.connection &&
      connection.connection.length) {
        this.setState({
          selectedConnection: connection.connection[0].name,
          requiresUsername: connection.connection[0].requires_username
        });
      }
    }

    const { invitations } = nextProps.csvInvitations.toJS();
    if (this.state.selectedConnection !== '' && invitations.length) {
      this.props.validateCSVFields(invitations, this.state.selectedConnection, this.state.requiresUsername);
    }

    if (this.state.error !== '') {
      this.setState({
        error: ''
      });
    }
  }

  static stateToProps = (state) => ({
    connection: state.connection,
    importReducer: state.importReducer,
    csvInvitations: state.csvInvitations
  })

  static actionsToProps = {
    ...invitationsActions,
    ...importActions
  }

  static propTypes = {
    inviteUsers: PropTypes.func.isRequired,
    validateCSVFields: PropTypes.func.isRequired,
    nextView: PropTypes.func.isRequired,
    goBackView: PropTypes.func.isRequired,
    tryAgain: PropTypes.func.isRequired,
    clearCSVImportedData: PropTypes.func.isRequired,
    connection: PropTypes.object,
    csvInvitations: PropTypes.object
  }

  changeConnection(ev) {
    const connectionName = ev.target.value;
    const { connection } = this.props.connection.toJS();
    const selectedConn = connection.find((conn) => conn.name === connectionName);

    this.setState({
      selectedConnection: connectionName,
      requiresUsername: selectedConn ? selectedConn.requires_username : false
    }, function afterSetState() {
      const { invitations } = this.props.csvInvitations.toJS();
      this.props.validateCSVFields(invitations, this.state.selectedConnection, this.state.requiresUsername);
    });
  }

  onSubmit(csvInvitations) {
    if (!csvInvitations || !this.state.selectedConnection.length) {
      return this.setState({
        error: 'Invitations were not previewed or connection is not selected.'
      });
    }

    this.props.inviteUsers(csvInvitations.invitations, this.state.selectedConnection, this.state.requiresUsername);

    // go to the next view
    this.props.nextView();
  }

  goBack() {
    this.props.clearCSVImportedData(); // clears imported csv data
    this.props.goBackView();
  }

  renderCSVInvitationsTable(csvInvitations) {
    let fields = [ 'email', 'status' ];
    if (this.state.requiresUsername) {
      fields.unshift('username');
    }
    return (
      <CSVInvitationsTable {...csvInvitations} fields={fields} />
    );
  }


  renderBackBtn() {
    return (
      <Button
        type="button"
        className="btn btn-transparent"
        onClick={this.goBack.bind(this)}
      >
        Back
      </Button>
    );
  }

  renderNextBtn(csvInvitations) {
    return (
      <Button
        type="button"
        className="btn btn-primary"
        disabled={(this.state.error !== '' || (csvInvitations.validationErrors && csvInvitations.validationErrors.length > 0))}
        onClick={this.onSubmit.bind(this, csvInvitations)}
      >
        Import
      </Button>
    );
  }

  render() {
    const { connection } = this.props.connection.toJS();

    const csvInvitations = this.props.csvInvitations.toJS();

    if (!connection || !connection.length) {
      return (<div>No connection...</div>);
    }

    let connectionOptions = connection.map((item) => {
      return <option key={item.name}>{item.name}</option>;
    });

    return (
      <div>
        <div className="modal-backdrop" />
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header has-border">
              <Button type="button" data-dismiss="modal" className="close" onClick={this.props.tryAgain}>
                <span aria-hidden="true">×</span><span className="sr-only">Close</span>
              </Button>
              <h4 id="previewCSVModalLabel" className="modal-title">Preview CSV</h4>
            </div>
            <form id="preview-csv-form">
              <div className="modal-body">

                <p className="text-center">Import a CSV file with all the data of your users.</p>
                <Error message={(this.state.error || csvInvitations.validationErrors) ? (this.state.error || csvInvitations.validationErrors) : ''} />

                <div className="row">
                  <div className="col-xs-12 form-group">
                  { this.renderCSVInvitationsTable(csvInvitations) }
                  </div>
                  <div className="col-xs-12 form-group">
                    <label htmlFor="connection" className="control-label col-xs-2">Connection</label>
                    <div className="col-xs-10">

                      <select
                        className="form-control"
                        name="connection"
                        value={this.state.selectedConnection.name}
                        onChange={this.changeConnection}
                      >
                        { connectionOptions }
                      </select>
                      <p className="help-block">This is a logical identifier of the connection.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                { this.renderBackBtn() } { this.renderNextBtn(csvInvitations) }
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
});
