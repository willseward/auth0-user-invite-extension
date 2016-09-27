import React from 'react';

import { InvitationEmail } from './';

const Configuration = () =>
  (<div>
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
  </div>);

export default Configuration;
