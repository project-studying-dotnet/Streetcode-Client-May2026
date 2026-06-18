import { useState, useRef, DragEvent, ChangeEvent } from 'react';

export const useFileUpload = (onUpload: (file: File) => void) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

 
  const openFilePicker = () => {
    fileInputRef.current?.click();
  };


  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onUpload(file);
  };

  return {
    fileInputRef,
    isDragging,
    openFilePicker,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop
  };
};