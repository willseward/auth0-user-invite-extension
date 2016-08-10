import React, { Component } from 'react';
import { Table, TableBody, TableTextCell, TableHeader, TableColumn, TableRow } from '../Dashboard';

export default class InvitationsTable extends Component {
  static propTypes = {
    invitations: React.PropTypes.array
  };

  render() {
    const { invitations } = this.props;
    if (!invitations || !invitations.length) {
      return <div>There are no invitations available. Please add a new user or summit a CSV file.</div>;
    }

    return (
      <div>
        <Table>
          <TableHeader>
            <TableColumn width="50%">Email</TableColumn>
            <TableColumn width="50%">Status</TableColumn>
          </TableHeader>
          <TableBody>
            { invitations.map((invitation, index) => {
              return (
                <TableRow key={index}>
                  <TableTextCell>{invitation.email}</TableTextCell>
                  <TableTextCell>{invitation.app_metadata.invite.status}</TableTextCell>
                </TableRow>
              );
            }) }
          </TableBody>
        </Table>
      </div>
    );
  }
}
