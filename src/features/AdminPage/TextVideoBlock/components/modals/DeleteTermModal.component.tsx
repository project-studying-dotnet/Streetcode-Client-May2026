import React from 'react';
import { Modal, Button } from 'antd';

import '@features/AdminPage/AdminModal.styles.scss';
import './TermModal.styles.scss';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteTermModal: React.FC<Props> = ({
  open,
  onClose,
  onConfirm,
}) => {

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      title="Ви впевнені, що хочете видалити цей тег?"
      open={open}
      onCancel={onClose}
      className="modalContainer"
      footer={null}
    >
      <div className="term-modal">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="modal-buttons">
            <Button className="cancel-button" onClick={onClose}>
              Скасувати
            </Button>

            <Button className="confirm-button" onClick={handleConfirm}>
              Підтвердити
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteTermModal;
