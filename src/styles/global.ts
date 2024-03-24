import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background: rgba(250, 250, 250) !important;
    background-color: rgba(23, 23, 24);
    color: rgba(0, 0, 0)
  }

  body, input, textArea, button {
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    font-size: 1rem;
  }

  :focus {
    outline: 0;
    box-shadow: 0 0 0 2px "#eee";
  }
`