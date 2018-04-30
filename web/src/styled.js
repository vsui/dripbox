import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Header = styled.div`
  background-color: ${props => props.theme.primary};
  color: ${props => props.theme.secondary};
  h1 {
    font-size: ${props => props.onRegister ? '2em' : '0em'};
    transition font-size 0.5s;
    margin: 0 0;
    padding: 0 0;
  }
  padding: 20px 50px;
`;

const VerticallyCenteredDiv = styled.div`
`;

const StyledLink = styled(Link)`
  text-decoration: ${props => props.primary ? 'underline' : 'none'};
  color: ${props => props.primary ? props.theme.primary : props.theme.secondary};
  :hover {
  }
`;

const Nav = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 50px;
`;

const Input = styled.input`
  font-size: 1em;
  width: 250px;
  border: 0.5px solid lightgray;
  padding: 8px;
  transition: color 0.25s;
  border-radius: 5px;
  border-color: lightgray;
  margin: 5px 5px;
  :focus {
    outline: none;
    transition: border-color 1s;
    border-color: ${props => props.theme.primary};
  }
  transition: border-color 1s;
`;

const Button = styled.button`
  font-size: 1em;
  margin: 5px 5px;
  width: 100px;
  color: ${props => props.theme.secondary};
  padding: 10px;
  border-radius: 8px;
  :hover {
    position: relative;
    top: -1px;
    transition: top 0.25s;
  }
  border: 0px;
  background-color: ${props => props.theme.primary};
  transition: background-color 0.5s;
  :disabled {
    :hover {
      top: 0px;
    }
    background-color: lightgrey;
    transition: background-color 0.5s;
  }
`;

const ErrorSpan = styled.span`
  color: ${props => props.theme.error};
  size: ${props => props.children ? '1em' : '0em'};
  transition: size 0.25s;
`;

export {
  Button,
  Header,
  StyledLink,
  Nav,
  Input,
  ErrorSpan,
  VerticallyCenteredDiv,
};
