import './VacanciesPage.styles.scss';

import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Select, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import CustomSortIcon from '@/app/common/components/SortIcon.component';

type VacancyItem = {
    id: number;
    title: string;
    salary: number;
    status: boolean;
};

const vacancies: VacancyItem[] = [
    { id: 1, title: 'Девелопер', salary: 100000, status: true },
    { id: 2, title: 'Tech Lead', salary: 12300, status: false },
    { id: 3, title: 'Scrum master', salary: 5677, status: false },
    { id: 4, title: 'CEO', salary: 37773, status: true },
];

const compareStatus = (a: VacancyItem, b: VacancyItem) => {
    if (a.status === b.status) {
        return 0;
    }

    return a.status ? -1 : 1;
};

const VacanciesPage = () => {
    const columns: ColumnsType<VacancyItem> = [
        {
            title: 'Назва',
            dataIndex: 'title',
            key: 'title',
            sorter: (a, b) => a.title.localeCompare(b.title),
            sortIcon: CustomSortIcon,
        },
        {
            title: 'Заробітна плата',
            dataIndex: 'salary',
            key: 'salary',
            sorter: (a, b) => a.salary - b.salary,
            sortIcon: CustomSortIcon,
        },
        {
            title: 'Статус',
            dataIndex: 'status',
            key: 'status',
            sorter: compareStatus,
            sortIcon: CustomSortIcon,
            render: (status: boolean) => (
                <Select
                    size="small"
                    value={status ? 'active' : 'inactive'}
                    className="vacancy-status-select"
                    options={[
                        { value: 'active', label: 'Активна' },
                        { value: 'inactive', label: 'Не активна' },
                    ]}
                />
            ),
        },
        {
            title: 'Дії',
            key: 'actions',
            width: '8%',
            render: () => (
                <div className="vacancy-actions">
                    <EditOutlined className="actionButton" />
                    <DeleteOutlined className="actionButton" />
                </div>
            ),
        },
    ];

    return (
        <div className="vacancies-page">
            <div className="vacancies-page-header">
                <Input
                    placeholder="Назва"
                    prefix={<SearchOutlined />}
                    className="vacancies-search-input"
                    allowClear
                />

                <div className="vacancies-header-actions">
                    <Select
                        placeholder="Статус"
                        className="vacancies-status-filter"
                        options={[
                            { value: 'active', label: 'Активна' },
                            { value: 'inactive', label: 'Не активна' },
                        ]}
                    />

                    <Button className="vacancies-add-button">
                        Додати вакансію
                    </Button>
                </div>
            </div>

            <Table
                pagination={{ pageSize: 10 }}
                className="vacancies-table"
                columns={columns}
                dataSource={vacancies}
                rowKey="id"
            />
        </div>
    );
};

export default VacanciesPage;