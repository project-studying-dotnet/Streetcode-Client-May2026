import React from 'react';
import './ModalCloseButton.styles.scss';

interface Props {
  onClick: () => void;
  ariaLabel?: string;
}

export const ModalCloseButton: React.FC<Props> = ({
  onClick,
  ariaLabel = 'Закрити',
}) => {
  return (
    <button
      className="modal-close-btn"
      aria-label={ariaLabel}
      onClick={onClick}
      type="button"
    >
      ×
    </button>
  );
};