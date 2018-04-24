import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { LIST_FILES_REQUESTED } from '../store/actions';

import File from './File';

const FileListing = props => (
  <div>
    <button onClick={props.refresh}>Refresh</button>
    {
      props.files.map(file => <File key={file.fileName} {...file} />)
    }
  </div>
);

FileListing.propTypes = {
  files: PropTypes.arrayOf(PropTypes.shape({
    fileName: PropTypes.string.isRequired,
    fileSize: PropTypes.number.isRequired,
    lastModified: PropTypes.string.isRequired,
  })).isRequired,
  refresh: PropTypes.func.isRequired,
};

const mapStateToProps = state => state;
const mapDispatchToProps = dispatch => ({
  refresh: dispatch({ type: LIST_FILES_REQUESTED }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FileListing);
