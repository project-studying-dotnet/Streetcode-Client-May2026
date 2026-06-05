import React from 'react';
import { Modal, Button } from 'antd';
import CancelBtn from "@images/utils/Cancel_btn.svg";

import "./DeleteRelatedTermModal.styles.scss";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteRelatedTermModal  : React.FC<Props> = ({
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
       closeIcon={<CancelBtn />}
      open={open}
      onCancel={onClose}
      className="modalContainer"
      footer={null}
    >
      <div className="term-modal">
          <p>Ви впевнені, що хочете видалити цей пов'язаний терм?</p>
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

export default DeleteRelatedTermModal;
