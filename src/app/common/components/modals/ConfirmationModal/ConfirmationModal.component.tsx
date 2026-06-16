import { observer } from 'mobx-react-lite';

import { Modal } from 'antd';

import { useModalContext } from '@/app/stores/root-store';

const ConfirmationModal = () => {
    const {
        modalStore: {
            setConfirmationModal,
            modalsState: { confirmation },
        },
    } = useModalContext();

    const confirmationProps = confirmation.confirmationProps;

    return (
        <Modal
            title={confirmationProps?.title ?? 'Підтвердження'}
            open={confirmation.isOpen}
            okText={confirmationProps?.okText ?? 'OK'}
            cancelText={confirmationProps?.cancelText ?? 'Cancel'}
            className={confirmationProps?.className}
            onOk={async () => {
                try {
                    await confirmationProps?.onSubmit?.();
                } finally {
                    setConfirmationModal('confirmation', undefined, undefined, false);
                }
            }}
            onCancel={() => {
                if (confirmationProps?.onCancel) {
                    confirmationProps.onCancel();
                } else {
                    setConfirmationModal('confirmation', undefined, undefined, false);
                }
            }}
        >
            {confirmationProps?.text
                ? <p>{confirmationProps.text}</p>
                : <p>Ви впевнені, що хочете видалити цей елемент?</p>}
        </Modal>
    );
};

export default observer(ConfirmationModal);