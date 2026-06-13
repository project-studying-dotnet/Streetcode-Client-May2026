import { observer } from 'mobx-react-lite';
import { useModalContext } from '@stores/root-store';
import { Modal } from 'antd';

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
        >
            <p>Ви впевнені?</p>
        </Modal>
    );
});

export default DeleteImageModal;