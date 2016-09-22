import '../Modal.css';
import React, { Component } from 'react';
import { Table, TableBody, TableTextCell, TableHeader, TableColumn, TableRow } from '../../../Dashboard';

export default class CSVInvitationsTable extends Component {

  static propTypes = {
    invitations: React.PropTypes.array,
    validationErrors: React.PropTypes.string
  };

  capitalizeItem(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  renderHeader () {
    return this.props.fields.map(field => {
      return (<TableColumn width="{1 / this.props.fields.length}%">{this.capitalizeItem(field)}</TableColumn>);
    });
  }

  renderBody (invitations) {
    return invitations.map((invitation, index) => {
      return (
        <TableRow key={index}>
          { this.props.fields.map(field => <TableTextCell>{invitation[field]}</TableTextCell> )}
        </TableRow>
      );
    });
  }

  render() {
    const { validationErrors, invitations } = this.props;

    if (!invitations || !invitations.length || validationErrors) {
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
