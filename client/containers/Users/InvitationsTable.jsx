import React, { PropTypes } from 'react';
import { Table, TableBody, TableTextCell, TableHeader, TableColumn, TableRow } from '../../components/Dashboard';

const InvitationsTable = (props) => {
  const { invitations, error } = props;
  if (error) {
    return null;
  }

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
          { invitations.map((invitation, index) => (
            <TableRow key={index}>
              <TableTextCell>{invitation.email}</TableTextCell>
              <TableTextCell>{invitation.app_metadata.invite.status}</TableTextCell>
            </TableRow>
          )) }
        </TableBody>
      </Table>
    </div>
  );
};

InvitationsTable.propTypes = {
  invitations: PropTypes.array,
  error: PropTypes.string
};

export default InvitationsTable;
