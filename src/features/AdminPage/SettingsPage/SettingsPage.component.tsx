import { useState } from 'react';
import { Tabs, Form, Input, Button, message } from 'antd';
import useMobx from '@stores/root-store';
import { ChangePasswordDto } from '@models/user/user.model';
import './SettingsPage.styles.scss';

const SettingsPage = () => {
    const { userLoginStore } = useMobx();
    const [passwordForm] = Form.useForm();
    const [profileForm] = Form.useForm();

    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const loginResponse = userLoginStore.userLoginResponce;

    const userData = loginResponse?.user;

    const initialValues = {
        username: userData?.name ? `${userData.name} ${userData.surname}` : 'Адміністратор',
        email: userData?.email || 'admin@streetcode.com',
    };

    const handlePasswordChange = async (data: ChangePasswordDto) => {
        setLoading(true);

        try {
            const result = await userLoginStore.changePassword(data);

            if (!result.success) {
                message.error('Помилка зміни пароля: перевірте поточний пароль');
                return;
            }

            message.success('Пароль успішно змінено');
            passwordForm.resetFields();
        } catch (error) {
            console.error('Password change error:', error);
            message.error('Сталася помилка');
        } finally {
            setLoading(false);
        }
    };

    const onFinishProfile = (values: any) => {
        console.log('Profile update:', values);
        message.success('Дані профілю оновлено');
        setIsEditing(false);
    };

    const items = [
        {
            key: '1',
            label: 'Профіль',
            children: (
                <Form
                    form={profileForm}
                    layout="vertical"
                    onFinish={onFinishProfile}
                    className="settings-form"
                    initialValues={initialValues}
                    disabled={!isEditing}
                >
                    <Form.Item label="Ім'я" name="username">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Email" name="email">
                        <Input disabled />
                    </Form.Item>

                    {!isEditing ? (
                        <Button type="primary" onClick={() => setIsEditing(true)}>
                            Редагувати
                        </Button>
                    ) : (
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <Button type="primary" htmlType="submit">Зберегти</Button>
                            <Button onClick={() => { profileForm.resetFields(); setIsEditing(false); }}>
                                Скасувати
                            </Button>
                        </div>
                    )}
                </Form>
            ),
        },
        {
            key: '2',
            label: 'Безпека',
            children: (
                <Form
                    form={passwordForm}
                    layout="vertical"
                    onFinish={handlePasswordChange}
                    className="settings-form"
                >
                    <Form.Item
                        label="Старий пароль"
                        name="currentPassword"
                        rules={[{ required: true, message: 'Введіть поточний пароль' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        label="Новий пароль"
                        name="newPassword"
                        rules={[{ required: true, min: 6, message: 'Мінімум 6 символів' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        label="Підтвердження пароля"
                        name="confirmNewPassword"
                        dependencies={['newPassword']}
                        rules={[
                            { required: true, message: 'Підтвердьте пароль' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Паролі не співпадають!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Button type="primary" danger htmlType="submit" loading={loading}>
                        Змінити пароль
                    </Button>
                </Form>
            ),
        },
    ];

    return (
        <div className="settings-page">
            <div className="settings-page-header">
                <h2>Налаштування</h2>
            </div>
            <Tabs defaultActiveKey="1" items={items} className="settings-tabs" />
        </div>
    );
};

export default SettingsPage;