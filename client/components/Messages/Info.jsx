import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';

class Info extends Component {

  render() {
    if (!this.props.message) {
      return this.props.children || <div></div>;
    }

    return (
      <Alert bsStyle="info">
        <h4>Heads up!</h4>
        <p>{this.props.message}</p>
      </Alert>
   );
  }
}

Info.propTypes = {
  message: React.PropTypes.string
};

export default Info;
