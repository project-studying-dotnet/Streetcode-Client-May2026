import './AdminLoginPage.styles.scss';

import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button, Form, Input, message } from 'antd';

import useMobx from '@/app/stores/root-store';
import UserLoginStore from '@/app/stores/user-login-store';
import FRONTEND_ROUTES from '@/app/common/constants/frontend-routes.constants';

const AdminLoginPage = () => {
    const { userLoginStore } = useMobx();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (UserLoginStore.isLoggedIn) {
        return <Navigate to={FRONTEND_ROUTES.ADMIN.BASE} replace />;
    }

    const onFinish = async (values: { login: string; password: string }) => {
        setIsSubmitting(true);

        try {
            await userLoginStore.login(values);
            navigate(FRONTEND_ROUTES.ADMIN.BASE);
        } catch {
            message.error('Невірний логін або пароль');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="adminLoginPage">
            <div className="adminLoginCard">
                <h1 className="adminLoginTitle">Вхід до адмін-панелі</h1>
                <Form
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Логін"
                        name="login"
                        rules={[{ required: true, message: 'Введіть логін' }]}
                    >
                        <Input maxLength={20} />
                    </Form.Item>
                    <Form.Item
                        label="Пароль"
                        name="password"
                        rules={[{ required: true, message: 'Введіть пароль' }]}
                    >
                        <Input.Password maxLength={20} />
                    </Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={isSubmitting}
                        block
                    >
                        Увійти
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default observer(AdminLoginPage);
