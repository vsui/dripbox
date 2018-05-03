import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { StyledLink } from '../styled';
import { pathJoin } from '../utils/path';

const Div = styled.div`
  display: flex;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: ${props => props.theme.primary};
  padding: 5px 5px;
`;

const SharedFolder = (props) => {
  const { pathname } = props.location;

  return (
    <Div>
      <StyledLink style={{ fontSize: '1.25em' }} primary to={pathJoin(pathname, props.folderName)}>{props.folderName}</StyledLink>
    </Div>
  );
};

SharedFolder.propTypes = {
  folderName: PropTypes.string.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

export default withRouter(SharedFolder);
