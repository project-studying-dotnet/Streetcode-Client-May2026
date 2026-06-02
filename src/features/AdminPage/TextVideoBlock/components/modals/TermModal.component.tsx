import React, { useEffect, useState } from 'react';
import { Modal, Input, Button, Select } from 'antd';
import TermsApi from '@api/streetcode/text-content/terms.api';
import { Term } from '@models/streetcode/text-contents.model';

import '@features/AdminPage/AdminModal.styles.scss';
import './TermModal.styles.scss';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (word: string, term: Term | null) => void;
  initialValue?: string;
}

const TermModal: React.FC<Props> = ({ open, onClose, onConfirm, initialValue = '' }) => {
  const [terms, setTerms] = useState<Term[]>([]);
 
  const [word, setWord] = useState(initialValue);
  const [selectedTerm, setSelectedTerm] = useState<Term | null>(null);

  useEffect(() => {
    if (open) {
      setWord(initialValue);
      setSelectedTerm(null);
      TermsApi.getAll().then((data) => setTerms(data ?? [])).catch(console.error);
    }
  }, [open, initialValue]);

  const handleConfirm = () => {
    if (!selectedTerm) {
      onClose();
      return;
    }
    onConfirm(word, selectedTerm);
    onClose();
  };

  return (
    <Modal
      title="Оберіть термін"
      open={open}
      onCancel={onClose}
      className="modalContainer" 
      footer={null}
    >
      <div className="term-modal">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <Input
            placeholder="Введіть слово"
            value={word}
            onChange={(e) => setWord(e.target.value)}
          />

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

export default TermModal;