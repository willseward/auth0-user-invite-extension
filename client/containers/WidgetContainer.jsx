import React, { PropTypes, Component } from 'react';
import connectContainer from 'redux-static';

import { connectionActions } from '../actions';

import { InvitationsContainer } from './';

export default connectContainer(class extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentTab: 'pending'
    }
  }

  static stateToProps = (state) => {
    return {
    }
  }

  static actionsToProps = {
    ...connectionActions
  }

  static propTypes = {
    fetchConnections: PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.fetchConnections();
  }

  changeCurrentTab() {
    const currentTab = 'pending' ? 'accepted' : 'pending';
    this.setState({
      currentTab: currentTab
    });
  }

  render() {

    return (
      <div>
        <div className="widget-title title-with-nav-bars">
          <ul className="nav nav-tabs">
            <li className="active">
              <a data-toggle="tab" href="#pending" aria-expanded="true" onClick={this.changeCurrentTab.bind(this)}>
                <span className="tab-title">
                  Pending users
                </span>
              </a>
            </li>
            <li>
              <a data-toggle="tab" href="#accepted" onClick={this.changeCurrentTab.bind(this)}>
                <span className="tab-title">
                  Accepted users
                </span>
              </a>
            </li>
          </ul>
        </div>
        <div id="content-area" className="tab-content">
          <div id="pending" className="tab-pane active">
            <InvitationsContainer filter="pending" currentTab={this.state.currentTab} />
          </div>
          <div id="accepted" className="tab-pane">
            <InvitationsContainer filter="accepted" currentTab={this.state.currentTab} />
          </div>
        </div>
      </div>
    );
  }
});
