import './LoginPage.styles.scss';

import { useState } from 'react';
import { Button, Checkbox, Form, Input, message } from 'antd';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';

import UserApi from '@api/user/user.api';
import FRONTEND_ROUTES from '@constants/frontend-routes.constants';
import useMobx from '@stores/root-store';

const LoginPage = () => {
    const { userLoginStore } = useMobx();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleFinish = async (values: { login: string; password: string }) => {
        try {
            setIsLoading(true);

            const response = await UserApi.adminLogin(values);

            userLoginStore.setUserLoginResponce(
                response,
                userLoginStore.refreshToken,
            );

            navigate(FRONTEND_ROUTES.ADMIN.BASE);
        } catch {
            message.error('Невірний логін або пароль');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="loginPage">
            <div className="loginCard">
                <h1>Вхід</h1>
                <p className="loginSubtitle">Введіть свої дані для входу</p>

                <Form
                    layout="vertical"
                    onFinish={handleFinish}
                >
                    <Form.Item
                        label="Електронна адреса"
                        name="login"
                        rules={[{ required: true, message: 'Введіть логін' }]}
                    >
                        <Input maxLength={256} />
                    </Form.Item>

                    <Form.Item
                        label="Пароль"
                        name="password"
                        rules={[{ required: true, message: 'Введіть пароль' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <div className="loginOptions">
                        <Button type="link" disabled>
                            Забули пароль?
                        </Button>

                        <Checkbox defaultChecked>
                            Запам’ятати мене
                        </Checkbox>
                    </div>

                    <Button
                        className="loginSubmitBtn"
                        htmlType="submit"
                        loading={isLoading}
                        block
                    >
                        Увійти
                    </Button>

                    <div className="loginRegister">
                        Немає облікового запису?
                        <Button type="link" disabled>
                            Зареєструватися
                        </Button>
                    </div>

                    <div className="loginDivider">
                        <span></span>
                            <span className="dividerText">
                                або продовжити через
                            </span>
                        <span></span>
                    </div>

                    <Button className="googleLoginBtn" disabled>
                        Google
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default observer(LoginPage);