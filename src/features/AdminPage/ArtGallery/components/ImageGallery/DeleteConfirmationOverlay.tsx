import React from 'react';
import { DeleteConfirmationOverlayProps } from '../../types/gallery.types';
import './DeleteConfirmationOverlay.styles.scss';


export const DeleteConfirmationOverlay: React.FC<DeleteConfirmationOverlayProps> = ({ isVisible, onConfirm, onCancel }) => {
    if (!isVisible) return null;

    return (
        <div className="delete-confirmation-overlay">
            <p>Видалити?</p>
            <div className="buttons">
                <button className="btn-confirm" onClick={onConfirm}>Так</button>
                <button className="btn-cancel" onClick={onCancel}>Ні</button>
            </div>
        </div>
    );
};