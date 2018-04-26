import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { download } from '../utils/api';
import { REMOVE_FILE_REQUESTED } from '../redux/actions';

const File = ({
  fileName,
  fileSize,
  lastModified,
  remove,
  fullPath,
}) => (
  <div>
    { fileName } { fileSize } {lastModified }
    <button onClick={() => download(fullPath, fileName)}>Download</button>
    <button onClick={() => remove(fileName)}>Remove</button>
  </div>
);

File.propTypes = {
  fileName: PropTypes.string.isRequired,
  fileSize: PropTypes.number.isRequired,
  lastModified: PropTypes.string.isRequired,
  remove: PropTypes.func.isRequired,
  fullPath: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch, props) => ({
  remove: () => dispatch({ type: REMOVE_FILE_REQUESTED, path: props.fileName }),
});

export default connect(null, mapDispatchToProps)(File);
