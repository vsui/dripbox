import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { Input, Button } from '../styled';
import { login } from '../utils/api';

class Login extends Component {
  state = {
    username: '',
    password: '',
  }

  onUsernameChange = e => this.setState({ username: e.target.value })
  onPasswordChange = e => this.setState({ password: e.target.value })
  onLoginClick = () => {
    const { username, password } = this.state;
    login(username, password)
      .then((token) => {
        localStorage.setItem('token', token);
        this.props.history.push('/home', null);
      })
      .catch(err => console.log(err));
  }

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
        <Button onClick={this.onLoginClick}>Login</Button>
      </div>
    );
  }
}

export default withRouter(Login);
