import React from 'react';
import './Button.styles.scss';

interface ButtonProps {
  label?: string;
  icon?: React.ReactNode;
  variant?: 'red' | 'white' | 'icon-red';
  padding?: '11' | '17' | '25';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  label, 
  icon, 
  variant = 'red', 
  padding = '17', 
  onClick, 
  disabled,
  className = ''
}) => {

  const classes = [
    'button-base',
    `button-base--${variant}`,
    `button-base--p-${padding}`,
    !label && icon ? 'button-base--icon-only' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button className={classes} onClick={onClick} disabled={disabled} type="button">
      {icon && <span className="button-icon">{icon}</span>}
      {label && <span>{label}</span>}
    </button>
  );
};