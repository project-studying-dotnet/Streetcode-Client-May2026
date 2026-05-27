/* eslint-disable no-restricted-imports */
/* eslint-disable import/order */
/* eslint-disable simple-import-sort/imports */
import './StreetcodeCreate.styles.scss';

import {
    Button, DatePicker, Form, Input, InputNumber, Divider, Select, Switch, Space,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import Radio from 'antd/es/radio/radio';
import { observer } from 'mobx-react-lite';
import React, { useState, useEffect } from 'react';
import useMobx from '../../../../app/stores/root-store';
import { BulbOutlined } from '@ant-design/icons';

const StreetcodeCreate: React.FC = observer(() => {
    const [form] = Form.useForm();
    const [isVisible, setIsVisible] = useState(true);
    const { tagsStore, streetcodeCatalogStore } = useMobx();
    const [startDateType, setStartDateType] = useState('date');
    const [endDateType, setEndDateType] = useState('date');
    const [years, setYears] = useState('');
    const [typeStartDateFormat, setStartTypeDateFormat] = useState('DD/MM/YYYY');
    const [typeEndDateFormat, setEndTypeDateFormat] = useState('DD/MM/YYYY');
    const [displayResolution, setDisplayResolution] = useState();

    useEffect(() => {
        tagsStore?.fetchAllTags();
    }, []);

    const onSuccesfulSubmitStreetcode = (values: any) => {
        Promise.all([streetcodeCatalogStore?.createStreetcode(values).then((res) => res).catch((err) => err)]);
    };

    const typeDiapason = [{
        value: 'year',
        label: 'рік',
    }, {
        value: 'month',
        label: 'місяць/рік',
    }, {
        value: 'date',
        label: 'день/місяць/рік',
    }];

    const listTypeDateFormat = {
        date: 'DD/MM/YYYY',
        month: 'MM/YYYY',
        year: 'YYYY',
    };

    return (
        <div className="streetcode-create-page">
            <Form
                form={form}
                layout="vertical"
                onFinish={onSuccesfulSubmitStreetcode}
            >
                <div className="streetcode-create-page__mainblock">
                    <h2>Стріткод</h2>
                    <Divider />

                    <Space>
                        <Form.Item
                            name="index"
                        >
                            <InputNumber min={1} max={9999} placeholder="Введіть номер стріткоду" />
                        </Form.Item>

                        <Form.Item
                            name="type"
                        >
                            <Space>
                                <div>Постать</div>
                                <Switch onClick={() => setIsVisible(!isVisible)} />
                                <div>Подія</div>
                            </Space>
                        </Form.Item>
                    </Space>

                    <div className="streetcode-create-page__mainblock__person" hidden={!isVisible}>
                        <Space>
                            <Form.Item
                                name="firstName"
                                label="Ім'я"
                                rules={[{ message: "Введіть ім'я:" }]}
                            >
                                <Input maxLength={50} showCount />
                            </Form.Item>

                            <Form.Item
                                name="lastName"
                                label="Прізвище"
                                rules={[{ message: 'Введіть прізвище:' }]}
                            >
                                <Input maxLength={50} showCount />
                            </Form.Item>
                        </Space>
                    </div>

                    <Form.Item
                        name="title"
                        label="Назва"
                        rules={[{ required: true, message: 'Введіть назву:' }]}
                    >
                        <Input maxLength={100} showCount />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Короткий опис(для зв'язків історії)"
                        rules={[{ message: 'Введіть опис:' }]}
                    >
                        <Input maxLength={33} showCount />
                    </Form.Item>

                    <Form.Item
                        name="transliterationUrl"
                        label="Транслітерація для URL"
                        rules={[{ required: true, message: 'Введіть транслітерацію:' }]}
                    >
                        <Input maxLength={33} showCount />
                    </Form.Item>
                </div>
                <Divider />

                <div className="streetcode-create-page__years">
                    <h2>Роки</h2>
                    <Divider />

                    <div>Тип діапазону</div>

                    <Space>
                        <Form.Item>
                            <Select
                                defaultValue={startDateType}
                                onChange={(value) => {
                                    setStartDateType(value);
                                    setStartTypeDateFormat(listTypeDateFormat[value]);
                                }}
                                options={typeDiapason}
                            />
                        </Form.Item>

                        <Form.Item>
                            <Select
                                defaultValue={endDateType}
                                onChange={(value) => {
                                    setEndDateType(value);
                                    setEndTypeDateFormat(listTypeDateFormat[value]);
                                }}
                                options={typeDiapason}
                            />
                        </Form.Item>
                    </Space>

                    <Form.Item
                        name="eventStartOrPersonBirthDate"
                        label="Від"
                        rules={[{ required: true }]}
                    >
                        <DatePicker
                            picker={
                                startDateType === 'date' ? 'date' : startDateType === 'month' ? 'month' : 'year'
                            }
                            format={typeStartDateFormat}
                            onChange={(date, dateString) => setYears(dateString.toString())}
                        />
                    </Form.Item>

                    <Form.Item
                        name="eventEndOrPersonDeathDate"
                        label="До"
                    >
                        <DatePicker
                            picker={
                                endDateType === 'date' ? 'date' : endDateType === 'month' ? 'month' : 'year'
                            }
                            format={typeEndDateFormat}
                            onChange={(date, dateString) => setYears((prev) => `${prev} - ${dateString.toString()}`)}
                        />
                    </Form.Item>

                    <Form.Item
                        name="dateString"
                        label="Роки"
                    >
                        <Input value={years} maxLength={100} />
                    </Form.Item>
                </div>
                <Divider />

                <div className="streetcode-create-page__tags">
                    <h2>
Теги
                        <BulbOutlined />
                    </h2>
                    <Divider />

                    <div>
                        Розширення
                        <Radio.Group
                            name="radiogroup"
                            onChange={(e) => setDisplayResolution(e.target.value)}
                            defaultValue={360}
                            options={[
                                { value: 360, label: '360' },
                                { value: 768, label: '768' },
                                { value: 1600, label: '1600' },
                            ]}
                        />
                    </div>

                    <Form.Item
                        name="tags"
                    >
                        <Select
                            mode="tags"
                        >
                            {tagsStore?.Tags.map((tag) => (
                                <Select.Option key={tag.id} value={tag.title}>
                                    {tag.title}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="teaser"
                        label="Тізер"
                        rules={[{ required: true, message: 'Введіть тізер:' }]}
                    >
                        <TextArea maxLength={520} showCount />
                    </Form.Item>
                </div>
                <Divider />

                <Button>Зберегти як чернетку</Button>
                <Button className="streetcode-custom-button save" onClick={() => form.submit()}>Опублікувати</Button>
            </Form>
        </div>
    );
});

export default StreetcodeCreate;
