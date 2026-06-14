import { observer } from 'mobx-react-lite';
import { useModalContext } from '@stores/root-store';
import { Modal, Button } from 'antd';

const DeleteImageTemplatesModal = observer(() => {
    const { modalStore: { setModal, modalsState: { deleteImageTemplates } } } = useModalContext();

    const onConfirm = () => {
        deleteImageTemplates.image?.onConfirm?.();
        setModal('deleteImageTemplates', undefined, false);
    };

    return (
        <Modal
            title="Видалити"
            open={deleteImageTemplates.isOpen}
            onOk={onConfirm}
            onCancel={() => setModal('deleteImageTemplates', undefined, false)}
            footer={[
                <Button
                    key="back"
                    onClick={() => setModal('deleteImageTemplates', undefined, false)}
                    className="ant-btn-default"
                >
                    Скасувати
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    danger
                    onClick={onConfirm}
                    className="ant-btn-primary"
                >
                    Видалити
                </Button>,
            ]}
        >
            <p>Ви впевнені, що хочете видалити цей елемент?</p>
        </Modal>
    );
});
export default DeleteImageTemplatesModal;