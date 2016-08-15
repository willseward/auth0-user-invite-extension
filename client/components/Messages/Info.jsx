import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';

class Info extends Component {

  render() {
    if (!this.props.message) {
      return this.props.children || <div></div>;
    }

    return (
      <Alert bsStyle="info">
        <strong>Information: </strong> {this.props.message}
      </Alert>
   );
  }
}

Info.propTypes = {
  message: React.PropTypes.string
};

export default Info;
