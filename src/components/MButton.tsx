import { ButtonContainer } from "./MButton.styles";

interface MButtonProps {
  label: String;
  variant?: 'primary' | 'secondary' | 'warning' | 'error'
}

export function MButton({variant='primary', label}: MButtonProps) {
  return (
    <ButtonContainer variant={variant}>{label}</ButtonContainer>
  )
}