import React, { PropTypes, Component } from 'react';
import { Button } from 'react-bootstrap';
import connectContainer from 'redux-static';

import '../Modal.css';

export default connectContainer(class UserAdded extends Component {

  static propTypes = {
    tryAgain: PropTypes.func.isRequired
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
    return (
      <div>
        <div className="modal-backdrop" />
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header has-border">
              <Button type="button" data-dismiss="modal" className="close" onClick={this.props.tryAgain}>
                <span aria-hidden="true">×</span><span className="sr-only">Close</span>
              </Button>
              <h4 className="modal-title">User created!</h4>
            </div>
            <div className="modal-body">
              <div className="row col-xs-12">
                <p className="text-center">User created successfully! an email was sent to the address to finish the process.</p>
              </div>

              <div className="row">
                <div className="col-xs-12 form-group UserAdded-iconSection">
                  <i className="icon-budicon-470" />
                </div>
              </div>

            </div>
            <div className="modal-footer">
              { this.renderAddMoreUsersBtn() } { this.renderDoneBtn() }
            </div>
          </div>
        </div>
      </div>
    );
  }
});
