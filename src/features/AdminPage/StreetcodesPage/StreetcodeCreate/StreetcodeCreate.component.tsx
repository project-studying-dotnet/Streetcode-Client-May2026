import './StreetcodeCreate.styles.scss';

import {
    Button, Card, DatePicker, Form, Input, InputNumber, Divider, Select, Switch, Space, Tooltip,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import Radio from 'antd/es/radio/radio';
import { observer } from 'mobx-react-lite';
import React, { useState, useEffect } from 'react';
import useMobx from '../../../../app/stores/root-store';
import { BulbOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import Streetcode from '../../../../models/streetcode/streetcode-types.model';
import StreetcodesApi from '../../../../app/api/streetcode/streetcodes.api';
import dayjs from 'dayjs';
import TagItem from '../../../../app/common/components/Tag/TagItem.component';
import Tag, { StreetcodeTag } from '../../../../models/additional-content/tag.model';
import FRONTEND_ROUTES from '@/app/common/constants/frontend-routes.constants';
import sourcesApi from '@api/sources/sources.api';
import SourcesAdminModal from '../../SourcesAdminBlock/SourcesAdminModal.component';
import {
    SourceCategoryName,
    StreetcodeCategoryContent,
} from '@models/sources/sources.model';

const StreetcodeCreate: React.FC = observer(() => {
    const [form] = Form.useForm();
    const [isVisible, setIsVisible] = useState(true);
    const { tagsStore, streetcodeCatalogStore } = useMobx();
    const [startDateType, setStartDateType] = useState('date');
    const [endDateType, setEndDateType] = useState('date');
    const [years, setYears] = useState('');
    const [typeStartDateFormat, setTypeStartDateFormat] = useState('DD/MM/YYYY');
    const [typeEndDateFormat, setTypeEndDateFormat] = useState('DD/MM/YYYY');
    const [displayResolution, setDisplayResolution] = useState(360);
    const { id } = useParams();
    const [currentStreetcode, setCurrentStreetcode] = useState<Streetcode>();
    const [selectedTags, setSelectedTags] = useState<StreetcodeTag[]>([]);
    const [forFansModalOpen, setForFansModalOpen] = useState(false);
    const [forFansItems, setForFansItems] = useState<StreetcodeCategoryContent[]>([]);
    const [sourceCategories, setSourceCategories] = useState<SourceCategoryName[]>([]);
    const navigate = useNavigate();

    const onTagSelect = (value: string) => {
        const selectedTag = tagsStore?.Tags.find((tag) => tag.title === value);

        if (selectedTag) {
            setSelectedTags((prev) => [...prev, selectedTag as StreetcodeTag]);
        }
    };

    const onTagDeselect = (value: string) => {
        setSelectedTags((prev) => prev.filter((tag: Tag) => tag.title !== value));
    };

    useEffect(() => {
    sourcesApi.getAllNames()
        .then(setSourceCategories)
        .catch((error) => {
            console.error('Failed to load source categories:', error);
        });
        }, []);

    useEffect(() => {
        if (id) {
            setSelectedTags(currentStreetcode?.tags || []);
            form.setFieldsValue({
                index: currentStreetcode?.index,
                firstName: currentStreetcode?.firstName,
                lastName: currentStreetcode?.lastName,
                title: currentStreetcode?.title,
                transliterationUrl: currentStreetcode?.transliterationUrl,
                eventStartOrPersonBirthDate: dayjs(currentStreetcode?.eventStartOrPersonBirthDate),
                eventEndOrPersonDeathDate: dayjs(currentStreetcode?.eventEndOrPersonDeathDate),
                dateString: currentStreetcode?.dateString,
                tags: currentStreetcode?.tags?.map((t) => t.title),
                teaser: currentStreetcode?.teaser,
            });
        }
    }, [currentStreetcode]);

    useEffect(() => async () => {
        const streetcode = await StreetcodesApi.getById(Number(id)).then((res) => res).catch((err) => err);
        setCurrentStreetcode(streetcode);
    }, []);

    useEffect(() => {
        tagsStore?.fetchAllTags();
    }, []);

    const onSuccesfulSubmitStreetcode = (values: any) => {
        const streetcode: Streetcode = {
            id: currentStreetcode?.id || 0,
            index: values.index,
            firstName: values.firstName,
            lastName: values.lastName,
            title: values.title,
            transliterationUrl: values.transliterationUrl,
            eventStartOrPersonBirthDate: dayjs(values.eventStartOrPersonBirthDate),
            eventEndOrPersonDeathDate: dayjs(values.eventEndOrPersonDeathDate),
            dateString: values.dateString,
            tags: selectedTags,
            teaser: values.teaser,
        };

       if (currentStreetcode?.id) {
            StreetcodesApi.update(streetcode).then((res) => res).catch((err) => err);
            navigate(`${FRONTEND_ROUTES.ADMIN.STREETCODES}`);
        } else {
            streetcodeCatalogStore?.createStreetcode(streetcode).then((res) => res).catch((err) => err);
            navigate(`${FRONTEND_ROUTES.ADMIN.STREETCODES}`);
        }
    };

    const updateYears = () => {
        const startDate = form.getFieldValue('eventStartOrPersonBirthDate');
        const endDate = form.getFieldValue('eventEndOrPersonDeathDate');

        const startString = startDate
            ? dayjs(startDate).format(typeStartDateFormat)
            : '';

        const endString = endDate
            ? dayjs(endDate).format(typeEndDateFormat)
            : '';

        form.setFieldValue(
            'dateString',
            endString
                ? `${startString} - ${endString}`
                : startString
        );
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

    const pickerMap = {
        date: 'date',
        month: 'month',
    };
    const getPlainTextPreview = (html = '', limit = 300) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    return (doc.body.textContent ?? '').trim().slice(0, limit);
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

                    <div className="streetcode-create-page__mainblock__head">
                        <Form.Item
                            name="index"
                        >
                            <InputNumber
                                className="inputNamber"
                                min={1}
                                max={9999}
                                placeholder="Введіть номер стріткоду" />
                        </Form.Item>

                        <Form.Item
                            name="type"
                        >
                            <Space>
                                <div>Постать</div>
                                <Switch onChange={() => setIsVisible(!isVisible)} />
                                <div>Подія</div>
                            </Space>
                        </Form.Item>
                    </div>

                    {isVisible && (
                        <div className="streetcode-create-page__mainblock__person" hidden={!isVisible}>
                            <Form.Item
                                className="person__item"
                                name="firstName"
                                label="Ім'я"
                                rules={[{ message: "Введіть ім'я:" }]}
                            >
                                <Input maxLength={50} showCount />
                            </Form.Item>

                            <Form.Item
                                className="person__item"
                                name="lastName"
                                label="Прізвище"
                                rules={[{ message: 'Введіть прізвище:' }]}
                            >
                                <Input maxLength={50} showCount />
                            </Form.Item>
                        </div>
                    )}

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
                                className="years__item"
                                defaultValue={startDateType}
                                onChange={(value) => {
                                    setStartDateType(value);
                                    setTypeStartDateFormat(listTypeDateFormat[value]);
                                }}
                                options={typeDiapason}
                            />
                        </Form.Item>

                        <Form.Item>
                            <Select
                                className="years__item"
                                defaultValue={endDateType}
                                onChange={(value) => {
                                    setEndDateType(value);
                                    setTypeEndDateFormat(listTypeDateFormat[value]);
                                }}
                                options={typeDiapason}
                            />
                        </Form.Item>
                    </Space>

                    <div>
                        <Space>
                            <Form.Item
                                name="eventStartOrPersonBirthDate"
                                label="Від"
                                rules={[{ required: true }]}
                            >
                                <DatePicker
                                    className="years__item"
                                    picker={pickerMap[startDateType] || 'year'}
                                    format={typeStartDateFormat}
                                    onChange={updateYears}
                                />
                            </Form.Item>

                            <Form.Item
                                name="eventEndOrPersonDeathDate"
                                label="До"
                            >
                                <DatePicker
                                    className="years__item"
                                    picker={pickerMap[endDateType] || 'year'}
                                    format={typeEndDateFormat}
                                    onChange={updateYears}
                                />
                            </Form.Item>
                        </Space>
                    </div>

                    <Form.Item
                        name="dateString"
                        label="Роки"
                    >
                        <Input maxLength={100} />
                    </Form.Item>
                </div>
                <Divider />

                <div className="streetcode-create-page__tags">
                    <h2>
                        Теги
                        <Tooltip title="Підказка">
                            <BulbOutlined />
                        </Tooltip>
                    </h2>
                    <Divider />

                    <div>
                        Розширення
                        <Radio.Group
                            className="radio"
                            name="radiogroup"
                            onChange={(e) => setDisplayResolution(e.target.value)}
                            defaultValue={displayResolution}
                            options={[
                                { value: 360, label: '360' },
                                { value: 768, label: '768' },
                                { value: 1600, label: '1600' },
                            ]}
                        />
                    </div>

                    <Space>
                        {selectedTags.map((tag) => (
                            <TagItem key={tag.id} tag={tag} />
                        ))}
                    </Space>

                    <Form.Item
                        name="tags"
                    >
                        <Select
                            mode="tags"
                            onSelect={onTagSelect}
                            onDeselect={onTagDeselect}
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

                <div className="streetcode-create-page__forFans">
                    <div className="streetcode-create-page__forFans__header">
                        <Button
                            icon={<PlusOutlined />}
                            type="text"
                            className="streetcode-create-page__forFans__plus"
                            onClick={() => setForFansModalOpen(true)}
                        />

                        <h2>Для фанатів</h2>
                    </div>

                    <div className="streetcode-create-page__forFans__list">
                        {forFansItems.map((item, index) => (
                            <Card key={`${item.sourceLinkCategoryId}-${index}`}>
                                <p>{getPlainTextPreview(item.text)}</p>
                            </Card>
                        ))}
                    </div>
                </div>
                <Divider />

                <div className="streetcode-create-page__button">
                    <Button className="">
                        Зберегти як чернетку
                    </Button>
                    <Button className="streetcode-custom-button save" onClick={() => form.submit()}>
                        Опублікувати
                    </Button>
                </div>

                <SourcesAdminModal
                    open={forFansModalOpen}
                    streetcodeId={0}
                    categories={sourceCategories}
                    initialContent={null}
                    onCancel={() => setForFansModalOpen(false)}
                    onSave={(content: StreetcodeCategoryContent) => {
                        setForFansItems((prev) => [...prev, content]);
                        setForFansModalOpen(false);
                    }}
                />
            </Form>
        </div>
    );
});

export default StreetcodeCreate;