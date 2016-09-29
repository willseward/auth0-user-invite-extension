import React, { PropTypes, Component } from 'react';
import { Button, Modal } from 'react-bootstrap';

import connectContainer from 'redux-static';

import { invitationsActions, importActions } from '../../../actions';

import NewUsers from './NewUsers';
import AddUserModal from './SingleUser/AddUserModal';
import UserAdded from './SingleUser/UserAdded';
import ImportCSVModal from './ImportCSV/ImportCSVModal';
import PreviewCSVModal from './ImportCSV/PreviewCSVModal';
import ImportedCSVModal from './ImportCSV/ImportedCSVModal';

export default connectContainer(class NewUsersModal extends Component {

  static defaultProps = {
    statusList: {
      CSV: [ 'INIT', 'IMPORT', 'PREVIEW', 'IMPORTED' ],
      SINGLE_USER: [ 'INIT', 'SINGLE_USER', 'USER_ADDED' ]
    }
  }

  static stateToProps = (state) => ({
    importReducer: state.importReducer,
    csvInvitations: state.csvInvitations
  });

  static actionsToProps = {
    ...invitationsActions,
    ...importActions
  }

  static propTypes = {
    clearImport: PropTypes.func.isRequired,
    clearCSVUsers: PropTypes.func.isRequired,
    clearImportUserError: PropTypes.func.isRequired,
    statusList: PropTypes.object.isRequired
  }

  componentWillMount() {
    this.setState({
      idx: 0,
      statusView: 'INIT',
      path: ''
    });
  }

  selectPath(path) {
    this.setState({
      path
    });
  }

  nextView() {
    if (!this.state.path) {
      return this.setState({
        statusView: 'INIT'
      });
    }

    const nIdx = this.state.idx + 1;

    this.setState({
      idx: nIdx,
      statusView: this.props.statusList[this.state.path][nIdx]
    });
  }

  goBackView() {
    if (!this.state.path) {
      return this.setState({
        statusView: 'INIT'
      });
    }

    const nIdx = this.state.idx - 1;

    this.setState({
      idx: nIdx,
      statusView: this.props.statusList[this.state.path][nIdx]
    });
  }

  clearCSVImportedData() {
    this.props.clearImport();
    this.props.clearCSVUsers();
  }

  tryAgain() {
    if (this.state.path === 'CSV') {
      this.clearCSVImportedData();
    } else {
      this.props.clearImportUserError();
    }

    this.setState({
      idx: 0,
      statusView: 'INIT',
      path: ''
    });
  }

  renderComponent() {
    const view = this.state.statusView;
    if (view === 'INIT') {
      return (
        <NewUsers
          path={this.state.path}
          nextView={this.nextView.bind(this)}
          tryAgain={this.tryAgain.bind(this)}
          selectPath={this.selectPath.bind(this)}
        />
      );
    } else if (view === 'SINGLE_USER') {
      return (
        <AddUserModal
          nextView={this.nextView.bind(this)}
          goBackView={this.goBackView.bind(this)}
          tryAgain={this.tryAgain.bind(this)}
        />
      );
    } else if (view === 'USER_ADDED') {
      return (
        <UserAdded tryAgain={this.tryAgain.bind(this)} />
      );
    } else if (view === 'IMPORT') {
      return (
        <ImportCSVModal
          nextView={this.nextView.bind(this)}
          goBackView={this.goBackView.bind(this)}
          tryAgain={this.tryAgain.bind(this)}
        />
      );
    } else if (view === 'PREVIEW') {
      return (
        <PreviewCSVModal
          nextView={this.nextView.bind(this)}
          goBackView={this.goBackView.bind(this)}
          tryAgain={this.tryAgain.bind(this)}
          clearCSVImportedData={this.clearCSVImportedData.bind(this)}
        />
      );
    }
    else if (view === 'IMPORTED') {
      return (
        <ImportedCSVModal tryAgain={this.tryAgain.bind(this)} />
      );
    }
    return (<div>No status view...</div>);
  }

  renderModalOpenBtn() {
    return (
      <Button type="button" data-toggle="modal" data-target="#modal-new-users" className="btn btn-success">
        New Users
        <Modal></Modal>
      </Button>
    );
  }

  render() {
    return (
      <div className="modal-container">
        {this.renderModalOpenBtn()}
        <div id="modal-new-users" tabIndex="-1" role="dialog" aria-hidden="true" className="modal">
          {this.renderComponent()}
        </div>
      </div>
    );
  }
});
