import { useState } from 'react';

export const useTemplateEditor = (
  imageTemplateStore: any,
  templateSlots: any,
  setTemplateSlots: any
) => {
  const [editingTemplateId, setEditingTemplateId] =
    useState<string | null>(null);

  const handleEditTemplate = (template: any) => {
    setEditingTemplateId(template.id);

    const layout = imageTemplateStore.templates.find(
      (t: any) => t.name === template.templateName
    );

    if (layout) {
      imageTemplateStore.setActiveTemplate(layout);
    }

    setTemplateSlots({ ...template.slots });
  };

  const handleSave = () => {
    if (editingTemplateId) {
      imageTemplateStore.updateTemplate({
        id: editingTemplateId,
        slots: { ...templateSlots },
        templateName:
          imageTemplateStore.activeTemplate?.name || 'Updated',
        templateId:
          imageTemplateStore.activeTemplate?.id || 0,
        isSavedToDb: false
      });

      setEditingTemplateId(null);
    } else {
      imageTemplateStore.addTemplate({
        id: String(Date.now()),
        slots: { ...templateSlots },
        templateName:
          imageTemplateStore.activeTemplate?.name || 'Unnamed',
           templateId:
          imageTemplateStore.activeTemplate?.id || 0,
        isSavedToDb: false
      });
    }

    setTemplateSlots({});
  };

  const saveToDb = async (templateToSave: any) => {
    try {
      imageTemplateStore.updateTemplateStatus(
        templateToSave.id,
        {
          isSavedToDb: true
        }
      );
    } catch (e) {
      console.error(e);
    }
  };

  return {
    handleEditTemplate,
    handleSave,
    saveToDb
  };
};


