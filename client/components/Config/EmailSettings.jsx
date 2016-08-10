import React, { Component } from 'react';
import { EmailSettingsForm } from './';

export default class EmailSettings extends Component {

  handleSubmit(data) {
    console.log('handleSubmit', data);
  }

  resetForm() {
    console.log('resetForm');
  }

  render() {
    return (
      <div>
        <EmailSettingsForm
          onSubmit={this.handleSubmit.bind(this)}
          resetForm={this.resetForm.bind(this)}
          submitting={true}
        />
      </div>
    )
  }
}
