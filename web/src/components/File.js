import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { download } from '../utils/api';
import { Button } from '../styled';
import { REMOVE_FILE_REQUESTED } from '../redux/actions';

const Div = styled.div`
  display: flex;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: ${props => props.theme.primary};
  font-size: 1.25em;
  padding: 5px 5px;
`;

const File = ({
  fileName,
  fileSize,
  lastModified,
  fullPath,
  deleteFile,
}) => (
  <Div>
    { fileName }
    <div style={{
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
    }}>
      <Button style={{ fontSize: '0.75em' }} onClick={() => download(fullPath, fileName)}>Download</Button>
      <Button style={{ fontSize: '0.75em' }} onClick={deleteFile}>Remove</Button>
    </div>
  </Div>
);

File.propTypes = {
  fileName: PropTypes.string.isRequired,
  fileSize: PropTypes.number.isRequired,
  lastModified: PropTypes.string.isRequired,
  deleteFile: PropTypes.func.isRequired,
  fullPath: PropTypes.string.isRequired,
};

const mapDispatchToProps = (dispatch, props) => ({
  remove: () => dispatch({ type: REMOVE_FILE_REQUESTED, path: props.fileName }),
});

export default connect(null, mapDispatchToProps)(File);
