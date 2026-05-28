import { observer } from 'mobx-react-lite';

import { Modal } from 'antd';

import useMobx, { useModalContext } from '@/app/stores/root-store';

const ConfirmationModal = () => {
    const { modalStore: { setConfirmationModal, modalsState: { confirmation } } } = useModalContext();
    return (
        <Modal
            title="Підтведження"
            open={confirmation.isOpen}
            onOk={async () => {
                try {
                    await confirmation.confirmationProps?.onSubmit?.();
                } finally {
                    setConfirmationModal('confirmation', undefined, undefined, false);
                }
            }}
            onCancel={() => {
                if (confirmation.confirmationProps?.onCancel) {
                    confirmation.confirmationProps.onCancel();
                } else {
                    setConfirmationModal('confirmation', undefined, undefined, false);
                }
            }}
        >
            {(confirmation.confirmationProps?.text)
                ? <p>{confirmation.confirmationProps.text}</p> : <p>Ви впевнені, що хочете видалити цей елемент?</p>}
        </Modal>
    );
};
export default observer(ConfirmationModal);
