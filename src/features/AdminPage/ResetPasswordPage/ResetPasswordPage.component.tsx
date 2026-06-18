import './ResetPasswordPage.styles.scss';

import { useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { API_ROUTES } from '@constants/api-routes.constants';
import UserApi from '@api/user/user.api';

const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const token = searchParams.get('token');
    const email = searchParams.get('email');

    const handleFinish = async (values: { password: string; confirm: string }) => {
        if (values.password !== values.confirm) {
            message.error('Паролі не співпадають');
            return;
        }
        if (!token || !email) {
            message.error('Некоректне посилання для відновлення пароля');
            return;
        }
        try {
            setIsLoading(true);

            await UserApi.resetPassword({
                email,
                token,
                newPassword: values.password
            });

            message.success('Пароль успішно змінено!');
            navigate(API_ROUTES.ADMIN_AUTHORIZATION.LOGIN);
        } catch {
            message.error('Помилка при зміні пароля. Можливо, посилання застаріло.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="loginPage">
            <div className="loginCard">
                <h1 className="loginTitle">Створення нового пароля</h1>
                <p className="loginSubtitle">Введіть новий пароль для вашого облікового запису</p>

                <Form
                    layout="vertical"
                    onFinish={handleFinish}
                >
                    <Form.Item
                        label="Новий пароль"
                        name="password"
                        rules={[{ required: true, message: 'Введіть новий пароль' }]}
                    >
                        <Input.Password maxLength={64} />
                    </Form.Item>

                    <Form.Item
                        label="Підтвердження пароля"
                        name="confirm"
                        rules={[{ required: true, message: 'Підтвердьте пароль' }]}
                    >
                        <Input.Password maxLength={64} />
                    </Form.Item>

                    <Button
                        className="loginSubmitBtn"
                        htmlType="submit"
                        loading={isLoading}
                        block
                    >
                        Зберегти пароль
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;