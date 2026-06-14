import './CalendarPage.styles.scss';

import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Select, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';

import CustomSortIcon from '@/app/common/components/SortIcon.component';

type CalendarItem = {
    id: number;
    title: string;
    date: string;
    relatedCodes: string[];
    status: number;
};

const statusLabels: Record<number, string> = {
    0: 'Чернетка',
    1: 'Опублікований',
    2: 'Заархівований',
};

const calendarItems: CalendarItem[] = [
    {
        id: 1,
        title: 'День народження Тараса Шевченка',
        date: '1814-03-09',
        relatedCodes: ['Тарас Шевченко', 'Роман Ратушний(Сенека)', 'Леся Українка'],
        status: 1,
    },
    {
        id: 2,
        title: 'День народження Лесі Українки',
        date: '2025-02-25',
        relatedCodes: ['Роман Ратушний(Сенека)'],
        status: 1,
    },
    {
        id: 3,
        title: 'Підрозділ Протасового',
        date: '2022-02-24',
        relatedCodes: ['Леся Українка'],
        status: 0,
    },
];

const CalendarPage = () => {
    const columns: ColumnsType<CalendarItem> = [
        {
            title: 'Назва',
            dataIndex: 'title',
            key: 'title',
            sorter: (a, b) => a.title.localeCompare(b.title),
            sortIcon: CustomSortIcon,
        },
        {
            title: 'Дата',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: "Пов'язані коди",
            dataIndex: 'relatedCodes',
            key: 'relatedCodes',
            render: (codes: string[]) => (
                <div className="calendar-related-codes">
                    {codes.map((code) => (
                        <Tag key={code} className="calendar-code-tag">
                            {code}
                        </Tag>
                    ))}
                </div>
            ),
        },
        {
            title: 'Статус',
            dataIndex: 'status',
            key: 'status',
            render: (status: number) => (
                <Select
                    size="small"
                    value={status}
                    className="calendar-status-select"
                    options={[
                        { value: 0, label: statusLabels[0] },
                        { value: 1, label: statusLabels[1] },
                        { value: 2, label: statusLabels[2] },
                    ]}
                />
            ),
        },
        {
            title: 'Дії',
            key: 'actions',
            width: '8%',
            render: () => (
                <div className="calendar-actions">
                    <EditOutlined className="actionButton" />
                    <DeleteOutlined className="actionButton" />
                </div>
            ),
        },
    ];

    return (
        <div className="calendar-page">
            <div className="calendar-page-header">
                <Input
                    placeholder="Назва"
                    prefix={<SearchOutlined />}
                    className="calendar-search-input"
                    allowClear
                />

                <div className="calendar-header-actions">
                    <Select
                        placeholder="Події"
                        className="calendar-type-select"
                        options={[
                            { value: 'events', label: 'Події' },
                            { value: 'birthdays', label: 'Дні народження' },
                        ]}
                    />

                    <Button className="calendar-add-button">
                        Додати подію
                    </Button>
                </div>
            </div>

            <Table
                pagination={{ pageSize: 10 }}
                className="calendar-table"
                columns={columns}
                dataSource={calendarItems}
                rowKey="id"
            />
        </div>
    );
};

export default CalendarPage;