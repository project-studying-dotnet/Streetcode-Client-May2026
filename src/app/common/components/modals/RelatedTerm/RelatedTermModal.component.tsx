import React, { useEffect, useState } from 'react';
import { Modal, Button, Select } from 'antd';
import TermsApi from '@api/streetcode/text-content/terms.api';
import { Term } from '@models/streetcode/text-contents.model';
import CancelBtn from "@images/utils/Cancel_btn.svg";

import './RelatedTermModal.styles.scss';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (word: string, term: Term | null) => void;
  initialValue?: string;
}

const RelatedTermModal: React.FC<Props> = ({ open, onClose, onConfirm, initialValue = '' }) => {
  const [terms, setTerms] = useState<Term[]>([]);

  const [selectedTerm, setSelectedTerm] = useState<Term | null>(null);

  useEffect(() => {
    if (open) {
      setSelectedTerm(null);
      TermsApi.getAll().then((data) => setTerms(data ?? [])).catch(console.error);
    }
  }, [open, initialValue]);

  const handleConfirm = () => {
    if (!selectedTerm) {
      onClose();
      return;
    }
    onConfirm(initialValue, selectedTerm);
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p>
            {initialValue
              ? <>Пов'язати термін <b>"{initialValue}"</b>?</>
              : <>Пов'язати термін?</>
            }
          </p>
          <Select
            showSearch
            placeholder="Виберіть термін з бази"
            options={terms.map(t => ({ value: t.id, label: t.title, term: t }))}
            onChange={(_, option: any) => setSelectedTerm(option?.term ?? null)}
            value={selectedTerm?.id}
            allowClear
            style={{ width: '100%' }}
          />

          <div className="modal-buttons">
            <Button className="cancel-button" onClick={onClose}>
              Скасувати
            </Button>
            <Button className="confirm-button" type="primary" onClick={handleConfirm}>
              Пов'язати
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default RelatedTermModal;