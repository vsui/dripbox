import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import styled from 'styled-components';

const Div = styled.div`
  display: flex;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: ${props => props.theme.primary};
  font-size: 1.25em;
  padding: 5px 5px;
`;

const SharedFile = props => (
  <Div>
    <span 
      onClick={() =>
        props.history.push(`${props.location.pathname}?preview=${props.fileName}`)
      }
    >
      {props.fileName} - { props.fullPath }
    </span>
  </Div>
);

SharedFile.propTypes = {
  fileName: PropTypes.string.isRequired,
  fullPath: PropTypes.string.isRequired,
};

export default withRouter(SharedFile);
