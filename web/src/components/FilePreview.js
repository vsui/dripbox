import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { StyledLink } from '../styled';

class FilePreview extends Component {
  static propTypes = {
    fileName: PropTypes.string.isRequired,
    filePath: PropTypes.string.isRequired,
    folderPath: PropTypes.string.isRequired,
  }

  render() {
    return (
      <div>
        <StyledLink primary to={this.props.folderPath}>Back</StyledLink>
        File preview of {this.props.fileName} at {this.props.filePath}
      </div>
    );
  }
}

export default FilePreview;
