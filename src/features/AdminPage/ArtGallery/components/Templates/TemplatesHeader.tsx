import React from 'react';
import { Button } from 'antd';
import './TemplatesHeader.styles.scss';
import { TemplateHeaderProps } from '../../types/gallery.types';

export const TemplatesHeader = ({ onOpenTemplates }: TemplateHeaderProps) => {
    return (
        <div className="templates-header">
            <h3 className="templates-title">Шаблони</h3>
            <Button 
                className="streetcode-custom-button" 
                onClick={onOpenTemplates}
            >
                Обрати шаблон
            </Button>
        </div>
    );
};