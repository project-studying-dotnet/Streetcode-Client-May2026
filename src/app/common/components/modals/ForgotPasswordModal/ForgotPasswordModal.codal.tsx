import './ForgotPasswordModal.styles.scss';

import { observer } from 'mobx-react-lite';
import { Button, Modal, Form, Input, message } from 'antd';
import { useModalContext } from '@stores/root-store';
import UserApi from '@api/user/user.api';

const ForgotPasswordModal = () => {
    const { modalStore: { setModal, modalsState: { forgotPassword } } } = useModalContext();

    const onFinish = async (values: { email: string }) => {
        try {
            await UserApi.forgotPassword({ email: values.email });
            message.success('Лист для скидання пароля відправлено!');
            setModal('forgotPassword');
        } catch {
            message.error('Помилка при відправці запиту');
        }
    };

    return (
        <Modal
            title="Відновлення пароля"
            open={forgotPassword.isOpen}
            onCancel={() => setModal('forgotPassword')}
            footer={null}
            className="forgotPasswordModal"
        >
            <Form layout="vertical" onFinish={onFinish}>
                <Form.Item
                    name="email"
                    label="Електронна адреса"
                    rules={[{ required: true, type: 'email', message: 'Введіть коректний email' }]}
                >
                    <Input />
                </Form.Item>
                <Button type="primary" htmlType="submit" block>
                    Відправити
                </Button>
            </Form>
        </Modal>
    );
};

export default observer(ForgotPasswordModal);