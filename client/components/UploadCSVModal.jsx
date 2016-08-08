import React, { PropTypes, Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import ImportDropFiles from './ImportDropFiles';

import connectContainer from 'redux-static';
import { invitationsActions, importActions } from '../actions';

export default connectContainer(class extends Component {

  constructor() {
    super();

    this.state = {
      csv: '',
      selectedConnection: ''
    };

    this.onDrop = this.onDrop.bind(this);
    this.changeConnection = this.changeConnection.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  static stateToProps = (state) => {
    return {
      connection: state.connection,
      file: state.importReducer.get('file')
    }
  }

  static actionsToProps = {
    ...invitationsActions,
    ...importActions
  }

  static propTypes = {
    inviteUsers: PropTypes.func.isRequired,
    handleFileDrop: PropTypes.func.isRequired
  }

  changeConnection(ev) {
    this.setState({
      selectedConnection: ev.target.value
    });
  }

  onClick() {

    if (!this.state.csv.length || !this.state.selectedConnection.length) {
      // TODO show error
      return;
    }

    this.props.inviteUsers({
      csv: this.state.csv,
      connection: this.state.selectedConnection
    });

    // reset values
    this.setState({
      csv: '',
      selectedConnection: [ ]
    });
  }

  onDrop(newFile) {
    this.props.handleFileDrop(newFile);
  }

  renderUploadCSVModal() {
    return (
      <Button bsSize="small" data-toggle="modal" data-target="#modal-upload-csv" className="btn-primary">
        <i className="icon icon-budicon-356"></i> Upload CSV
        <Modal></Modal>
      </Button>
    )
  }

  render() {

    const { error, connection, loading } = this.props.connection.toJS();

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
                      (!this.props.file) ?
                      <ImportDropFiles onDrop={this.onDrop} /> :
                      `File '${this.props.file.name}' added. Click 'Upload' to invite users.`
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
                </div>
                <div className="modal-footer">
                  <Button type="submit"
                    className="btn btn-primary"
                    data-dismiss="modal"
                    onClick={this.onClick}>
                      Upload
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
