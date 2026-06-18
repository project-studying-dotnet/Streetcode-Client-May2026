import React from 'react';
import { useFileUpload } from '../../hooks/useFileUpload'; //
import './AddButtonCard.styles.scss';


interface AddButtonCardProps {
  onUpload: (file: File) => void;
}
export const AddButtonCard: React.FC<AddButtonCardProps> = ({ onUpload }) => {
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
    <button
      type="button"
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
    </button>
  );
};