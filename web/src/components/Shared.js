import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { Button, Input } from '../styled';

class Shared extends Component {
  state = {
    fileName: '',
    folderName: '',
  }

  onFileNameChange = e => this.setState({ fileName: e.target.value })
  onFolderNameChange = e => this.setState({ folderName: e.target.value })
  navigateToFile = () => this.props.history.push(`shared/files/${this.state.fileName}`)
  navigateToFolder = () => this.props.history.push(`shared/folders/${this.state.folderName}`)

  render() {
    return (
      <div>
        <Input onChange={this.onFileNameChange} />
        <Button style={{ width: '10em' }} onClick={this.navigateToFile}>Go to shared file</Button>
        <br />
        <Input onChange={this.onFolderNameChange} />
        <Button style={{ width: '10em' }} onClick={this.navigateToFolder}>Go to shared folder</Button>
      </div>
    );
  }
}

export default withRouter(Shared);
