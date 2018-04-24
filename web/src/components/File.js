import React from 'react';
import PropTypes from 'prop-types';

import { download, remove } from '../utils/api';

const File = ({
  fileName,
  fileSize,
  lastModified,
}) => (
  <div>
    { fileName } { fileSize } {lastModified }
    <button onClick={() => download(fileName)}>Download</button>
    <button onClick={() => remove(fileName)}>Remove</button>
  </div>
);

File.propTypes = {
  fileName: PropTypes.string.isRequired,
  fileSize: PropTypes.number.isRequired,
  lastModified: PropTypes.string.isRequired,
};

export default File;
