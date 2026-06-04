import React from 'react';
// import './AdminArtControls.styles.scss';
import { AdminArtControlsProps } from '../../types/gallery.types';

export const AdminArtControls = ({ onDelete, onEdit }: AdminArtControlsProps) => (
  <div className="admin-art-controls">
    <button className="edit-btn" onClick={onEdit}>Редагувати</button>
    <button className="delete-btn" onClick={onDelete}>Видалити</button>
  </div>
);