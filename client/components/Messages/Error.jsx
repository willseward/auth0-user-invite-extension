import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';

class Error extends Component {

  render() {
    if (!this.props.message) {
      return this.props.children || <div></div>;
    }

    return (
      <Alert bsStyle="danger">
        <h4>Oh snap! You got an error!</h4>
        <p>{this.props.message}</p>
      </Alert>
   );
  }
}

Error.propTypes = {
  message: React.PropTypes.string
};

export default Error;
