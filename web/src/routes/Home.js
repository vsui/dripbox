import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

import { upload } from '../utils/api';
import FileListing from '../components/FileListing';

export default class Home extends Component {
  static propTypes = {
    username: PropTypes.string.isRequired,
  }

  onSubmit = () => {
    const file = this.state.selected;

    upload(file.name, file)
      .then(() => {
        this.setState({
          files: [...this.state.files, { Key: file.name }],
        });
        toast('Upload successful!');
      })
      .catch(() => {
        toast('Upload unsuccessful');
      });
  }

  render() {
    return (
      <div>
        <h1>{this.props.username}</h1>
        <input type="file" onChange={e => this.setState({ selected: e.target.files[0] })} />
        <button onClick={this.onSubmit}>Submit</button>
        <FileListing />
      </div>
    );
  }
}
