import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';

import { LIST_FILES_REQUESTED, UPLOAD_FILE_REQUESTED } from '../redux/actions';
import File from './File';

const FileListing = props => (
  <div>
    <button onClick={props.refresh}>Refresh</button>
    <Dropzone
      disableClick
      onDrop={files =>
        files.map(file => 
          props.upload(file.name, file))}
    >
      {
        props.files.map(file => <File key={file.fileName} {...file} />)
      }
    </Dropzone>
  </div>
);

FileListing.propTypes = {
  files: PropTypes.arrayOf(PropTypes.shape({
    fileName: PropTypes.string.isRequired,
    fileSize: PropTypes.number.isRequired,
    lastModified: PropTypes.string.isRequired,
  })).isRequired,
  refresh: PropTypes.func.isRequired,
  upload: PropTypes.func.isRequired,
};

const mapStateToProps = state => state;
const mapDispatchToProps = dispatch => ({
  refresh: () => dispatch({ type: LIST_FILES_REQUESTED }),
  upload: (name, file) => dispatch({ type: UPLOAD_FILE_REQUESTED, name, file }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FileListing);
