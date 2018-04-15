import React, { Component } from 'react';

import { Input } from '../styled';

class Login extends Component {
  state = {
    username: '',
    password: '',
  }

  onUsernameChange = e => this.setState({ username: e.target.value })
  onPasswordChange = e => this.setState({ password: e.target.value })

  render() {
    const { username, password } = this.state;
    return (
      <div>
        <Input
          value={username}
          placeholder="Username"
          onChange={this.onUsernameChange}
        />
        <Input
          value={password}
          placeholder="Password (min. 10 characters)"
          type="password"
          onChange={this.onPasswordChange}
        />
      </div>
    );
  }
}

export default Login;
