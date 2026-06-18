import './LoginPage.styles.scss';
import { GoogleLogin } from '@react-oauth/google';

import { useState } from 'react';
import { Button, Checkbox, Form, Input, message } from 'antd';
import { observer } from 'mobx-react-lite';
import { Navigate, useNavigate } from 'react-router-dom';
import UserLoginStore from '@/app/stores/user-login-store';

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

    if (UserLoginStore.isLoggedIn) {
        return <Navigate to={FRONTEND_ROUTES.ADMIN.BASE} replace />;
    }

    return (
        <div className="loginPage">
            <div className="loginCard">
                <h1 className="loginTitle">Вхід</h1>
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
                        <span className="dividerLine" />

                        <span className="dividerText">
                            або продовжити через
                        </span>

                        <span className="dividerLine" />
                    </div>

                    <GoogleLogin
                        onSuccess={async (credentialResponse) => {
                            try {
                                setIsLoading(true);
                                const response = await UserApi.googleLogin({
                                    idToken: credentialResponse.credential as string
                                });
                                userLoginStore.setUserLoginResponce(response, userLoginStore.refreshToken);
                                navigate(FRONTEND_ROUTES.ADMIN.BASE);
                            } catch (e) {
                                console.error('Google Auth Error:', e);
                                message.error('Помилка авторизації через Google');
                            } finally {
                                setIsLoading(false);
                            }
                        }}
                        onError={() => {
                            message.error('Не вдалося увійти через Google');
                        }}
                    />
                </Form>
            </div>
        </div>
    );
};

export default observer(LoginPage);