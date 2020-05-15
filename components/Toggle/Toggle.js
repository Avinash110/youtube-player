import styled from 'styled-components';
import React from 'react';
import ReactDOM from 'react-dom';

import Sun from "../../public/images/sun.svg";
import Moon from "../../public/images/moon.svg";

const ToggleContainer = styled.button`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${({ theme }) => theme.gradient};
  width: 100px;
  height: 48px;
  margin: 0 auto;
  border-radius: 30px;
  border: 2px solid ${({ theme }) => theme.toggleBorder};
  font-size: 0.5rem;
  padding: 6px;
  overflow: hidden;
  cursor: pointer;
  :focus{
    outline: none;
  }
  img {
    max-width: 2.5rem;
    height: auto;
    transition: all 0.3s linear;

    &:first-child {
      transform: ${({ lightTheme }) => lightTheme ? 'translateY(0)' : 'translateY(100px)'};
    }

    &:nth-child(2) {
      transform: ${({ lightTheme }) => lightTheme ? 'translateY(-100px)' : 'translateY(0)'};
    }
  }
`;

export const Toggle = ({ theme, toggleTheme }) => {
  const isLight = theme === 'light';

  return (
    <ToggleContainer lightTheme={isLight} onClick={toggleTheme}>
      <img src={Sun} width="36px" height="36px" alt="Sun free icon"/>
      <img src={Moon} width="36px" height="36px" alt="Moon free icon"/>
    </ToggleContainer>
  );
};