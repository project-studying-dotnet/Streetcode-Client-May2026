import React from 'react';
import { observer } from 'mobx-react-lite';
import { Modal } from 'antd';
import { useModalContext } from '@stores/root-store';
import './TemplatesModal.styles.scss';

const TemplatesModal = observer(() => {
    const {
        modalStore: { setModal, modalsState: { templates } },
        templateStore
    } = useModalContext();

    const handleSelect = (template: any) => {
        templateStore.setActiveTemplate(template);
        setModal('templates', undefined, false); // Закрываем окно
    };

    return (
        <Modal
            className="templates-modal"
            open={templates.isOpen}
            onCancel={() => setModal('templates', undefined, false)}
            footer={null}
            title="Шаблони"
        >
            <div className="templates-grid">
                {templateStore.templates.map((item) => (
                    <div
                        key={item.id}
                        className="template-item"
                        onClick={() => handleSelect(item)}
                    >
                        <div
                            className={`preview-grid ${item.name
                                .toLowerCase()
                                .replace(/-/g, '-')}`}
                        >
                            {item.slots.map((slot) => (
                                <div
                                    key={slot.id}
                                    className="preview-slot"
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </Modal>
    );
});
export default TemplatesModal;