import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    font-family: Roboto, sans-serif;
    transition: all 0.25s linear;
  }

  nav {
    background-color: ${({ theme }) => theme.nav};
  }

  a, a:hover {
    color: ${({ theme }) => theme.link};
  }

  .repo-item, .profile-item {
    background-color: ${({ theme }) => theme.list};
  }

  .card, .card-block {
    background-color: ${({ theme }) => theme.container};
  }

  hr {
    border-top:1px solid ${({ theme }) => theme.body}
  }
`