import styled from 'styled-components';

const Header = styled.h1`
  margin: 0 0;
  text-align: center;
`;

const Subheading = styled.span`
  margin-top: 10px;
  text-align: center;
  display: block;
`;

const Input = styled.input`
  display: block;
  font-size: 1em;
  width: 90%;
  margin: 5px auto;
  border: 0.5px solid lightgray;
  padding: 8px;
  transition: color 0.25s;
  border-radius: 5px;
  border-color: lightgray;
  :focus {
    outline: none;
    transition: border-color 1s;
    border-color: darkblue;
  }
`;

const Button = styled.button`
  display: block;
  font-size: 1em;
  color: white;
  position: relative;
  top: 0;
  margin: 0 auto;
  padding: 10px;
  border-radius: 8px;
  :hover {
    top: -0.5px;
    transition: top 0.25s;
  }
  border: 0px;
  background-color: lightgreen;
  transition: background-color 0.5s;
  :disabled {
    background-color: red;
    transition: background-color 0.5s;
  }
`;

export {
  Button,
  Subheading,
  Header,
  Input,
};
