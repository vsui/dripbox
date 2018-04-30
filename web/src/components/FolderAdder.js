import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Button, Input } from '../styled';

class FolderAdder extends Component {
  static propTypes = {
    createFolder: PropTypes.func.isRequired,
  }

  state = {
    folderName: '',
  };

  onChange = e => this.setState({ folderName: e.target.value })
  onClick = () => this.props.createFolder(this.state.folderName)

  render() {
    return (
      <div>
        <Input onChange={this.onChange} value={this.state.folderName} />
        <Button onClick={this.onClick}>Add folder</Button>
      </div>
    );
  }
}

export default FolderAdder;
