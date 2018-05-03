import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import { StyledLink, Button } from '../styled';
import { pathJoin } from '../utils/path';
import { shareFolder } from '../utils/api';

const Div = styled.div`
  display: flex;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: ${props => props.theme.primary};
  padding: 5px 5px;
`;

const Folder = (props) => {
  const { pathname } = props.location;
  const folderPath = pathJoin(pathname.substring('/home/'.length), props.folderName);

  return (
    <Div>
      <StyledLink style={{ fontSize: '1.25em' }} primary to={pathJoin(pathname, props.folderName)}>{props.folderName}<br /></StyledLink>
      <div style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
      }}
      >
        <Button onClick={() => shareFolder(folderPath)}>Share</Button>
        <Button onClick={props.removeFolder}>Remove</Button>
      </div>
    </Div>
  );
};

Folder.propTypes = {
  folderName: PropTypes.string.isRequired,
  removeFolder: PropTypes.func.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

export default withRouter(Folder);
