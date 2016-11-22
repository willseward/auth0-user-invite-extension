import React, { Component, PropTypes } from 'react';

import './InvitationsTable.css';
import { Table, TableBody, TableTextCell, TableHeader, TableColumn, TableRow } from 'auth0-extension-ui';

export default class InvitationsTable extends Component {

  static propTypes = {
    invitations: PropTypes.array,
    fields: PropTypes.array.isRequired
  };

  renderHeader() {
    return this.props.fields.map(field => (
      <TableColumn key={field.header} width="{1 / this.props.fields.length}%">{field.header}</TableColumn>
    ));
  }

  renderBody(invitations) {
    return invitations.map((invitation, index) => (
      <TableRow key={index}>
        { this.props.fields.map(field => <TableTextCell key={field.body + index}>{invitation[field.body]}</TableTextCell>) }
      </TableRow>
    ));
  }

  render() {
    const { invitations } = this.props;

    if (!invitations || !invitations.length) {
      return null;
    }

    return (
      <div className="invitationstable-header">
        <Table>
          <TableHeader>
            { this.renderHeader() }
          </TableHeader>
          <TableBody>
            { this.renderBody(invitations) }
          </TableBody>
        </Table>
      </div>
    );
  }
}
