import { observer } from 'mobx-react-lite';
import { Modal } from 'antd';
import { useModalContext } from '@stores/root-store';
import { TemplateRenderer } from '@components/ImageTemplates-grid/TemplateRenderer';
import './TemplatesModal.styles.scss';

const TemplatesModal = observer(() => {
    const {
        modalStore: { setModal, modalsState: { templates } },
        imageTemplateStore
    } = useModalContext();

    const handleSelect = (template: any) => {
        imageTemplateStore.setActiveTemplate(template);
        setModal('templates', undefined, false); 
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
                {imageTemplateStore.templates.map((item) => (
                    <div
                        key={item.id}
                        className="template-item"
                        onClick={() => handleSelect(item)}
                    >
                        <TemplateRenderer 
                            template={item} 
                            renderSlot={() => null}
                        />
                    </div>
                ))}
            </div>
        </Modal>
    );
});
export default TemplatesModal;