import dayjs from 'dayjs';
import { useEffect } from 'react';
import { Button, DatePicker, Form, Input, Modal, Select, message } from 'antd';
import { observer } from 'mobx-react-lite';

import useMobx, { useModalContext } from '@/app/stores/root-store';
import TimelineItem, { DateViewPattern } from '@/models/timeline/chronology.model';

interface Props {
    streetcodeId: number;
}

const ChronologyAdminModal = ({ streetcodeId }: Props) => {
    const [form] = Form.useForm();
    const { modalStore } = useModalContext();
    const { timelineItemStore, historicalContextStore } = useMobx();

    const isOpen = modalStore.modalsState.adminChronology.isOpen;
    const editingItemId = modalStore.modalsState.adminChronology.fromCardId;

    const editingItem = editingItemId
        ? timelineItemStore.timelineItemMap.get(editingItemId)
        : undefined;

    const isEditMode = Boolean(editingItem);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        if (editingItem) {
            form.setFieldsValue({
                title: editingItem.title,
                description: editingItem.description,
                date: dayjs(editingItem.date),
                dateViewPattern: editingItem.dateViewPattern,
                contextId: editingItem.historicalContexts?.[0]?.id,
            });
        } else {
            form.resetFields();
            form.setFieldsValue({
                dateViewPattern: DateViewPattern.DateMonthYear,
            });
        }
    }, [isOpen, editingItem, form]);

    useEffect(() => {
        if (isOpen) {
            historicalContextStore.fetchHistoricalContextAll();
        }
    }, [isOpen, historicalContextStore]);

    const closeModal = () => {
        form.resetFields();
        modalStore.setModal('adminChronology', undefined, false);
    };

    const handleSubmit = async (values: {
        title: string;
        description?: string;
        date: any;
        dateViewPattern: DateViewPattern;
        contextId?: number;
    }) => {
        const selectedContext = historicalContextStore.historicalContextArray
            .find((context) => context.id === values.contextId);

        const timelineItem: TimelineItem = {
            id: editingItem?.id ?? 0,
            title: values.title,
            description: values.description,
            date: values.date.hour(12).minute(0).second(0).millisecond(0).toDate(),
            dateViewPattern: values.dateViewPattern,
            streetcodeId,
            historicalContexts: selectedContext ? [selectedContext] : [],
        };

        if (isEditMode) {
            await timelineItemStore.updateTimelineItem(timelineItem);
            message.success('Подію успішно оновлено');
        } else {
            await timelineItemStore.createTimelineItem(timelineItem);
            message.success('Подію успішно створено');
        }
        closeModal();
    };

    return (
        <Modal
            open={isOpen}
            onCancel={closeModal}
            footer={null}
            title={isEditMode ? 'Редагування події' : 'Створення події'}
            destroyOnClose
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    dateViewPattern: DateViewPattern.DateMonthYear,
                }}
            >
                <Form.Item
                    label="Назва"
                    name="title"
                    rules={[
                        { required: true, message: 'Введіть назву події' },
                        { max: 28, message: 'Назва не може перевищувати 28 символів' },
                    ]}
                >
                    <Input showCount maxLength={28} />
                </Form.Item>

                <Form.Item
                    label="Дата"
                    name="date"
                    rules={[{ required: true, message: 'Оберіть дату' }]}
                >
                    <DatePicker style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    label="Тип дати"
                    name="dateViewPattern"
                    rules={[{ required: true, message: 'Оберіть тип дати' }]}
                >
                    <Select
                        options={[
                            { value: DateViewPattern.DateMonthYear, label: 'День місяць рік' },
                            { value: DateViewPattern.MonthYear, label: 'Місяць рік' },
                            { value: DateViewPattern.SeasonYear, label: 'Пора року' },
                            { value: DateViewPattern.Year, label: 'Рік' },
                        ]}
                    />
                </Form.Item>

                <Form.Item label="Контекст" name="contextId">
                    <Select
                        allowClear
                        options={historicalContextStore.historicalContextArray.map((context) => ({
                            value: context.id,
                            label: context.title,
                        }))}
                    />
                </Form.Item>

                <Form.Item
                    label="Опис"
                    name="description"
                    rules={[
                        { required: true, message: 'Введіть опис події' },
                        { max: 400, message: 'Опис не може перевищувати 400 символів' },
                    ]}
                >
                    <Input.TextArea showCount maxLength={400} rows={4} />
                </Form.Item>

                <Button type="primary" htmlType="submit">
                    Зберегти
                </Button>
            </Form>
        </Modal>
    );
};

export default observer(ChronologyAdminModal);