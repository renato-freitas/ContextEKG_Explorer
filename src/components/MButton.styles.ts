import styled from 'styled-components';

export type ButtonVariants = 'primary' | 'secondary' | 'warning' | 'error';

interface ButtonContainerProps {
  variant: ButtonVariants
}

const buttonVariantColors = {
  primary: '#f00',
  secondary: '#ff0',
  warning: '#f0f',
  error: '#f00'
}

export const ButtonContainer = styled.button<ButtonContainerProps>`
  height: 2rem;
  width: 100px;
  border-radius: 12px;
  background-color: ${props => props.theme.primary};
  color: ${props => props.theme.white}
  /* background-color: ${props => buttonVariantColors[props.variant]} */
`
