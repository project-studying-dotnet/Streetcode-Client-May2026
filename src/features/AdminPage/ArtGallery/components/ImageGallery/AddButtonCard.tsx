import React from 'react';
import { useFileUpload } from '../../hooks/useFileUpload'; //
import './AddButtonCard.styles.scss';

export const AddButtonCard = ({ onUpload }) => {
  const { 
    fileInputRef, 
    isDragging, 
    openFilePicker, 
    handleFileChange, 
    handleDragOver, 
    handleDragLeave, 
    handleDrop 
  } = useFileUpload(onUpload);

  return (
    <div 
      className={`add-button-card ${isDragging ? 'dragging' : ''}`}
      onClick={openFilePicker}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        hidden
      />
      <div className="content">
        <span>☁️</span>
        <p>Перетягніть файл або натисніть</p>
      </div>
    </div>
  );
};