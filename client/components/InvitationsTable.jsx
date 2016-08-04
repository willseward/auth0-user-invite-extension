import React, { Component } from 'react';
import { ButtonToolbar } from 'react-bootstrap';
import { Table, TableAction, TableCell, TableBody, TableIconCell, TableTextCell, TableHeader, TableColumn, TableRow } from './Dashboard';

export default class InvitationsTable extends Component {
  static propTypes = {
    error: React.PropTypes.string,
    invitations: React.PropTypes.array.isRequired
  };

  render() {
    const { error, invitations } = this.props;
    if (!error && invitations.size === 0) {
      return <div>There are no invitations available. Please add a new user or summit a CSV file.</div>;
    }

    return (
      <div>
        <Table>
          <TableHeader>
            <TableColumn width="33%">Username</TableColumn>
            <TableColumn width="33%">Email</TableColumn>
            <TableColumn width="33%">Status</TableColumn>
          </TableHeader>
          <TableBody>
            {invitations.map((invitation, index) => {
              return (
                <TableRow key={index}>
                  <TableTextCell>{invitation.username}</TableTextCell>
                  <TableTextCell>{invitation.email}</TableTextCell>
                  <TableTextCell>{invitation.status}</TableTextCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  }
}
