import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import styled from 'styled-components';

import { changePath } from '../redux/actions';
import { StyledLink, Button } from '../styled';
import { pathJoin } from '../utils/path';

const Div = styled.div`
  display: flex;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: ${props => props.theme.primary};
  padding: 5px 5px;
`;

const Folder = (props) => {
  const { pathname } = props.location;

  return (
    <Div>
      <StyledLink style={{ fontSize: '1.25em' }} primary to={pathJoin(pathname, props.folderName)}>{props.folderName}<br /></StyledLink>
      <Button onClick={props.removeFolder}>Remove</Button>
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

const mapStateToProps = state => ({ path: state.path });

const mapDispatchToProps = (dispatch, props) => ({
  navigate: (currPath) => {
    if (currPath === '') {
      dispatch(changePath(props.folderName));
    } else {
      dispatch(changePath(`${currPath}/${props.folderName}`));
    }
  },
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Folder));
