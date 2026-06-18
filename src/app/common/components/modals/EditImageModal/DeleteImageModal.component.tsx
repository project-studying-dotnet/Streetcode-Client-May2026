import { observer } from 'mobx-react-lite';
import { useModalContext } from '@stores/root-store';
import { Modal, Button  } from 'antd';

const DeleteImageModal = observer(() => {
    const { modalStore: { setModal, modalsState: { deleteImage } } } = useModalContext();

   const onConfirm = () => {
        deleteImage.image?.onConfirm?.(); 
        setModal('deleteImage', undefined, false); 
    };
    return (
        <Modal
            title="Видалити"
            open={deleteImage.isOpen}
            onOk={onConfirm}
            onCancel={() => setModal('deleteImage')}
             footer={[
                <Button
                    key="back"
                    onClick={() => setModal('deleteImage', undefined, false)}
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
            <p>Ви впевнені?</p>
        </Modal>
    );
});

export default DeleteImageModal;