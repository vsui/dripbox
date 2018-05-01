import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { get } from '../utils/api';
import { StyledLink } from '../styled';

class FilePreview extends Component {
  static propTypes = {
    fileName: PropTypes.string.isRequired,
    filePath: PropTypes.string.isRequired,
    folderPath: PropTypes.string.isRequired,
  }

  state = {
    blob: null,
  }

  componentDidMount() {
    this._loadFile();
  }

  _loadFile() {
    this._asyncRequest = get(this.props.filePath)
      .then((blob) => {
        this._asyncRequest = null;
        this.setState({ blob });
      });
  }

  render() {
    const extensionStart = this.props.fileName.lastIndexOf('.');
    const extension = this.props.fileName.substring(extensionStart + 1);
    if (this.state.blob === null) {
      return (
        <div>
          <StyledLink primary to={this.props.folderPath}>Back</StyledLink>
          Loading...
        </div>
      );
    }
    if (extension === 'png' || extension === 'jpg') {
      const url = URL.createObjectURL(this.state.blob);
      return (
        <div>
          <StyledLink primary to={this.props.folderPath}>Back</StyledLink>
          <br />
          File preview of {this.props.fileName}
          <img style={{ width: '100%' }} src={url} alt={this.props.fileName} />
        </div>
      );
    } else if (extension === 'pdf') {
      const url = URL.createObjectURL(new Blob([this.state.blob], { type: 'application/pdf' }));
      return (
        <div style={{ height: '100%' }}>
          <StyledLink primary to={this.props.folderPath}>Back</StyledLink>
          <br />
          <embed style={{ width: '100%', height: '100%' }} src={url} type="application/pdf" width="600" height="500" alt="pdf" />
        </div>
      );
    }

    const url = URL.createObjectURL(new Blob([this.state.blob], { type: 'text/plain' }));
    return (
      <div style={{ height: '100%' }}>
        <StyledLink primary to={this.props.folderPath}>Back</StyledLink>
        <br />
        <embed style={{ width: '100%', height: '100%' }} src={url} type="text/plain" width="600" height="500" alt="pdf" />
      </div>
    );
  }
}

export default FilePreview;
