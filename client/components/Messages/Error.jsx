import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';

class Error extends Component {

  render() {
    if (!this.props.message) {
      return this.props.children || <div></div>;
    }

    return (
      <Alert bsStyle="danger">
        <strong>Error: </strong> {this.props.message}
      </Alert>
   );
  }
}

Error.propTypes = {
  message: React.PropTypes.string
};

export default Error;
