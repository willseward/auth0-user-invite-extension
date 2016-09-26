import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';

class Success extends Component {

  render() {
    if (!this.props.message) {
      return this.props.children || <div></div>;
    }

    return (
      <Alert bsStyle="success">
        <strong>Well done!</strong> {this.props.message}
      </Alert>
   );
  }
}

Success.propTypes = {
  message: React.PropTypes.string
};

export default Success;
