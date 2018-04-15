import React, { Component } from 'react';

import { Input } from '../styled';

class Register extends Component {
  state = {
    username: '',
    password: '',
    confirmedPassword: '',
  }

  onUsernameChange = e => this.setState({ username: e.target.value })
  onPasswordChange = e => this.setState({ password: e.target.value })
  onConfirmedPasswordChange = e => this.setState({ confirmedPassword: e.target.value })

  render() {
    const { username, password, confirmedPassword } = this.state;
    return (
      <div>
        <Input
          value={username}
          placeholder="Username"
          onChange={this.onUsernameChange}
        />
        <Input
          value={password}
          placeholder="Password (min. 8 characters)"
          type="password"
          onChange={this.onPasswordChange}
        />
        <Input
          value={confirmedPassword}
          placeholder="Confirm password"
          type="password"
          onChange={this.onConfirmedPasswordChange}
        />
      </div>
    );
  }
}

export default Register;
