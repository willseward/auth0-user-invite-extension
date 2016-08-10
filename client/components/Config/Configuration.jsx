import React, { PropTypes, Component } from 'react';
import connectContainer from 'redux-static';

import { InvitationEmail } from './';

export default class Configuration extends Component {

  render() {

    return (
      <div>
        <div className="widget-title title-with-nav-bars">
          <ul className="nav nav-tabs">
            <li className="active">
              <a data-toggle="tab" href="#invitation-email" aria-expanded="true">
                <span className="tab-title">
                  Invitation Email Template
                </span>
              </a>
            </li>
          </ul>
        </div>
        <div id="content-area" className="tab-content">
          <div id="invitation-email" className="tab-pane active">
            <InvitationEmail />
          </div>
        </div>
      </div>
    );
  }
};
