import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import connectContainer from 'redux-static';
import classNames from 'classnames';
import './ConfigurationStatus.css';
import { Error } from '../../components/Messages';

export default connectContainer(class ConfigurationStatus extends Component {
  static propTypes = {
    configurationStatus: PropTypes.object.isRequired
  };

  static stateToProps = (state) => ({
    configurationStatus: state.configurationStatus
  })

  render() {
    const { error, status } = this.props.configurationStatus.toJS();

    if (error) {
      return (
        <Error message={error} />
      );
    }

    if (status && !status.hasData) {
      const buttonClasses = classNames({
        hidden: location.pathname === '/configuration'
      });

      return (
        <div className="row">
          <div className="col-xs-12 wrapper">
            <div className="alert alert-warning">
              <strong>Warning</strong> The extension still needs to be configured before it can enforce your authorization logic. <Link className={buttonClasses} to="/configuration">Go to Configuration</Link>
            </div>
          </div>
        </div>
      );
    }

    return null;
  }
});
