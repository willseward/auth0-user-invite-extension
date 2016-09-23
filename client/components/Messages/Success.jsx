import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';

class Success extends Component {

  render() {
    if (!this.props.message) {
      return this.props.children || <div></div>;
    }

    return (
      <Alert bsStyle="success">
        <h4>Well done!</h4>
        <p>{this.props.message}</p>
      </Alert>
   );
  }
}

Success.propTypes = {
  message: React.PropTypes.string
};

export default Success;
