import { observer } from 'mobx-react-lite';
import { useModalContext } from '@stores/root-store';
import { Modal } from 'antd';

const DeleteImageModal = observer(() => {
    const { modalStore: { setModal, modalsState: { deleteImage } } } = useModalContext();

    const onConfirm = () => {
        console.log("Удаляем картинку ID:", deleteImage.image?.id);
        setModal('deleteImage');
    };

    return (
        <Modal
            title="Видалити зображення"
            open={deleteImage.isOpen}
            onOk={onConfirm}
            onCancel={() => setModal('deleteImage')}
            className="deleteModal" 
        >
            <p>Ви впевнені, що хочете видалити це зображення?</p>
        </Modal>
    );
});

export default DeleteImageModal;