import '../Modal.css';
import React, { Component } from 'react';
import { Table, TableBody, TableTextCell, TableHeader, TableColumn, TableRow } from '../../../Dashboard';

export default class CSVInvitationsTable extends Component {

  static propTypes = {
    invitations: React.PropTypes.array,
    validationErrors: React.PropTypes.string
  };

  render() {
    const { validationErrors, invitations } = this.props;

    if (!invitations || !invitations.length) {
      return (<div>Please summit a CSV file with the list of users.</div>);
    }

    if (validationErrors) {
      return <div>{validationErrors}</div>;
    }

    return (
      <div className="invitationstable-header">
        <Table>
          <TableHeader>
            <TableColumn width="50%">Email</TableColumn>
            <TableColumn width="50%">Status</TableColumn>
          </TableHeader>
          <TableBody>
            {invitations.map((invitation, index) => {
              return (
                <TableRow key={index}>
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
