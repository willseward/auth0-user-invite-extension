import React, { Component, PropTypes } from 'react';

import '../Modal.css';
import { Table, TableBody, TableTextCell, TableHeader, TableColumn, TableRow } from '../../../../components/Dashboard';

export default class CSVInvitationsTable extends Component {

  static propTypes = {
    invitations: PropTypes.array,
    fields: PropTypes.array.isRequired
  };

  capitalizeItem(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  renderHeader() {
    return this.props.fields.map(field => (
      <TableColumn width="{1 / this.props.fields.length}%">{this.capitalizeItem(field)}</TableColumn>
    ));
  }

  renderBody(invitations) {
    return invitations.map((invitation, index) => (
      <TableRow key={index}>
        { this.props.fields.map(field => <TableTextCell>{invitation[field]}</TableTextCell>) }
      </TableRow>
    ));
  }

  render() {
    const { invitations } = this.props;

    if (!invitations || !invitations.length) {
      return (<div>Please summit a valid CSV file with the list of users.</div>);
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
