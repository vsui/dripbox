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
  :focus {
    outline: none;
    color: greenyellow;
    ::-webkit-input-placeholder {
      transition: color 0.25s;
      color: pink;
    }
  }
`;

export { Subheading, Header, Input };
