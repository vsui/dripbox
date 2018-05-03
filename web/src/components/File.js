import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withRouter } from 'react-router';

import { download, shareFile } from '../utils/api';
import { Button } from '../styled';

const Div = styled.div`
  display: flex;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: ${props => props.theme.primary};
  font-size: 1.25em;
  padding: 5px 5px;
`;

const File = props => (
  <Div>
    <span 
      onClick={() =>
        props.history.push(`${props.location.pathname}?preview=${props.fileName}`)
      }
    >
      { props.fileName }
    </span>
    <div style={{
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
    }}
    >
      <Button style={{ fontSize: '0.75em' }} onClick={() => download(props.fullPath, props.fileName)}>Download</Button>
      <Button style={{ fontSize: '0.75em' }} onClick={() => shareFile(props.fullPath)}>Share</Button>
      <Button style={{ fontSize: '0.75em' }} onClick={props.deleteFile}>Remove</Button>
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

export default withRouter(File);
