import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { Input, Button } from '../styled';

class Register extends Component {
  state = {
    username: '',
    usernameError: '',
    password: '',
    confirmedPassword: '',
    passwordError: '',
  }

  onUsernameChange = (e) => {
    this.setState({ username: e.target.value });
    this.validateUsername(e.target.value);
  }
  onPasswordChange = (e) => {
    this.setState({ password: e.target.value });
    this.validatePasswords(this.state.confirmedPassword, e.target.value);
  }
  onConfirmedPasswordChange = (e) => {
    this.setState({ confirmedPassword: e.target.value });
    this.validatePasswords(e.target.value, this.state.password);
  }

  validateUsername = (username) => {
    const regex = /^\w+$/;
    if (!regex.test(username)) {
      this.setState({ usernameError: 'Username should only contain letters, digits, and underscores!' });
    } else {
      this.setState({ usernameError: '' });
    }
  }

  validatePasswords = (confirmedPassword, password) => {
    if (password.length < 8) {
      this.setState({ passwordError: 'Password must be at least 8 characters!' });
      return;
    }
    if (password !== confirmedPassword) {
      this.setState({ passwordError: 'Passwords must match!' });
    } else {
      this.setState({ passwordError: '' });
    }
  }
  render() {
    const {
      username,
      password,
      confirmedPassword,
      passwordError,
      usernameError,
    } = this.state;

    return (
      <div>
        <Input
          value={username}
          placeholder="Username"
          onChange={this.onUsernameChange}
        />
        { usernameError }
        <Input
          value={password}
          placeholder="Password (min. 8 characters)"
          type="password"
          onChange={this.onPasswordChange}
          minlength="8"
        />
        <Input
          value={confirmedPassword}
          ref={(c) => { this.hello = c; }}
          placeholder="Confirm password"
          type="password"
          onChange={this.onConfirmedPasswordChange}
          minlength="8"
        />
        { passwordError }
        <Button disabled={usernameError !== '' || passwordError !== ''}>Submit</Button>

        <Link to="/login">Login</Link>
      </div>
    );
  }
}

export default Register;
