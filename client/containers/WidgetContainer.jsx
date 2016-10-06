import React, { PropTypes, Component } from 'react';
import connectContainer from 'redux-static';

import { connectionActions } from '../actions';
import { InvitationsContainer } from './';

export default connectContainer(class WidgetContainer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentTab: 'pending'
    };
  }

  static actionsToProps = {
    ...connectionActions
  }

  static propTypes = {
    fetchConnections: PropTypes.func.isRequired
  }

  componentDidMount() {
    this.props.fetchConnections();
  }

  changeCurrentTab() {
    const currentTab = 'pending' ? 'accepted' : 'pending';
    this.setState({
      currentTab
    });
  }

  renderTabs(content) {
    return content.map(item => {
      return (<div id={item.filter} key={item.filter} className={item.classes}>
        <InvitationsContainer
          filter={item.filter}
          currentTab={this.state.currentTab}
          description={item.description}
          fields={item.fields}
        />
      </div>);
    });
  }

  render() {
    const tabs = [
      {
        filter: 'pending',
        classes: 'tab-pane active',
        description: 'Here you will find all the users you invited but have not accepted the invitation yet.',
        fields: [
          {
            header: 'Email',
            body: 'email'
          },
          {
            header: 'Date of invitation',
            body: 'date_of_invitation'
          }
        ]
      },
      {
        filter: 'accepted',
        classes: 'tab-pane',
        description: 'Here you will find all the users that already accepted your invitation.',
        fields: [
          {
            header: 'Email',
            body: 'email'
          },
          {
            header: 'Connection',
            body: 'connection'
          }
        ]
      }
    ];

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
          { this.renderTabs(tabs) }
        </div>
      </div>
    );
  }
});
