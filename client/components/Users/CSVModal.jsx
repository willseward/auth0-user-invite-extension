import React, { PropTypes, Component } from 'react';
import { Button, Modal } from 'react-bootstrap';

import connectContainer from 'redux-static';

import { invitationsActions, importActions } from '../../actions';

import ImportCSVModal from './ImportCSV/ImportCSVModal';
import PreviewCSVModal from './ImportCSV/PreviewCSVModal';
import ImportedCSVModal from './ImportCSV/ImportedCSVModal';

export default connectContainer(class CSVModal extends Component {

  constructor() {
    super();

    this.state = {
      idx: 0,
      statusView: 'IMPORT'
    };
  }

  static defaultProps = {
    statusList: ['IMPORT', 'PREVIEW', 'IMPORTED']
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
    clearImport: PropTypes.func.isRequired,
    clearCSVUsers: PropTypes.func.isRequired,
  }

  nextView() {
    var nIdx = this.state.idx + 1;

    this.setState({
      idx: nIdx,
      statusView: this.props.statusList[nIdx]
    });
  }

  goBackView() {
    var nIdx = this.state.idx - 1;

    this.setState({
      idx: nIdx,
      statusView: this.props.statusList[nIdx]
    });
  }

  tryAgain() {
    this.props.clearImport();

    this.setState({
      idx: 0,
      statusView: 'IMPORT'
    });
    this.props.clearCSVUsers();
  }

  renderComponent() {
    let view = this.state.statusView;
    if(view === 'IMPORT') {
      return (
        <ImportCSVModal
          nextView={this.nextView.bind(this)}
          tryAgain={this.tryAgain.bind(this)} />
      );
    }
    else if (view === 'PREVIEW') {
      return (
        <PreviewCSVModal
          nextView={this.nextView.bind(this)}
          goBackView={this.goBackView.bind(this)}
          tryAgain={this.tryAgain.bind(this)} />
      );
    }
    else if (view === 'IMPORTED') {
      return (
        <ImportedCSVModal
          tryAgain={this.tryAgain.bind(this)} />
      );
    }
    else {
      return (<div>No status view...</div>)
    }
  }

  renderImportCSVModalOpenBtn() {
    return (
      <Button type="button" bsSize="small" data-toggle="modal" data-target="#modal-import-csv" className="btn btn-primary">
        <i className="icon icon-budicon-356"></i> Import CSV
        <Modal></Modal>
      </Button>
    );
  }

  render() {

    return (
      <div className="modal-container">
        {this.renderImportCSVModalOpenBtn()}
        <div id="modal-import-csv" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" className="modal">
          {this.renderComponent()}
        </div>
      </div>
    );
  }
});
