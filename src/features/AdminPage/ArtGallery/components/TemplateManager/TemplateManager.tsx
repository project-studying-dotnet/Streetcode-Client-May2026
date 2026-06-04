import React, { useState } from 'react';
import { TemplateGrid } from '../TemplateGrid/TemplateGrid';
import './TemplateManager.styles.scss';

import { useArtGallery } from '../../hooks/useArtGallery';
export const TemplateManager = () => {
  const { activeTemplate, setActiveTemplate } = useArtGallery();

  return (
    <div className="template-manager">
      <div className="manager-header">
        <h3>Шаблони</h3>
        <TemplateSelector 
          current={activeTemplate} 
          onSelect={setActiveTemplate} 
        />
      </div>
      {/* Сетка просто рендерит структуру, данные берет из массива изображений */}
      <TemplateGrid activeType={activeTemplate} />
    </div>
  );
};