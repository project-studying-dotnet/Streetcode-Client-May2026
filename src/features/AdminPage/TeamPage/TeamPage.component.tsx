import './TeamPage.styles.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useState } from 'react';
import { DeleteOutlined, EditOutlined, SearchOutlined, StarOutlined } from '@ant-design/icons';
import { Button, Input, Table } from 'antd';
import facebook from '@assets/images/partners/facebook.png';
import instagram from '@assets/images/partners/instagram.png';
import twitter from '@assets/images/partners/twitter.png';
import youtube from '@assets/images/partners/youtube.png';
import { ColumnsType } from 'antd/es/table';
import CustomSortIcon from '@/app/common/components/SortIcon.component';

import Image from '@/models/media/image.model';

import base64ToUrl from '../../../app/common/utils/base64ToUrl.utility';
import ImageStore from '../../../app/stores/image-store';
import useMobx, { useModalContext } from '../../../app/stores/root-store';
import TeamMember, { TeamMemberLink } from '../../../models/team/team.model';

import TeamModal from './TeamModal/TeamModal.component';

const LogoType = [twitter, instagram, facebook, youtube];
const TeamPage = () => {
    const { teamStore } = useMobx();
    const { modalStore } = useModalContext();
    const [modalAddOpened, setModalAddOpened] = useState<boolean>(false);
    const [modalEditOpened, setModalEditOpened] = useState<boolean>(false);
    const [teamToEdit, setTeamToedit] = useState<TeamMember>();
    const [searchText, setSearchText] = useState('');

    const updatedTeam = () => {
        Promise.all([teamStore?.fetchTeamAll()]).then(() => {
            teamStore?.TeamMap.forEach((val, key) => {
                ImageStore.getImageById(val.imageId).then((image) => {
                    teamStore.TeamMap.set(val.id, { ...val, image });
                });
            });
        }).then(() => teamStore.setInternalMap(teamStore.getTeamArray));
    };

    useEffect(() => {
        updatedTeam();
    }, []);

    const renderImageColumn = (image: Image, record: { id: any; }) => (
        <img
            key={`${record.id}${image?.id}`}
            className="team-table-logo"
            src={base64ToUrl(image?.base64, image?.mimeType ?? '')}
            alt={image?.imageDetails?.alt}
        />
    );

    const filteredTeam = useMemo(() => {
        const normalizedSearch = searchText.trim().toLowerCase();

        return (teamStore?.getTeamArray ?? []).filter((team) => {
            const fullName = `${team.lastName ?? ''} ${team.firstName ?? ''}`;
            const positions = team.positions?.map((x) => x.position).join(' ') ?? '';

            return [
                fullName,
                positions,
                team.description,
            ].some((value) => value?.toLowerCase().includes(normalizedSearch));
        });
    }, [searchText, teamStore?.getTeamArray]);

    const columns: ColumnsType<TeamMember> = [
        {
            title: "Прізвище та ім'я",
            dataIndex: 'lastName',
            key: 'lastName',
            sortIcon: CustomSortIcon,
            sorter: (a, b) => {
                const firstName = `${a.lastName ?? ''} ${a.firstName ?? ''}`;
                const secondName = `${b.lastName ?? ''} ${b.firstName ?? ''}`;

                return firstName.localeCompare(secondName);
            },
            render(value, record) {
                return (
                    <div key={`${value}${record.id}`} className="team-table-item-name">
                        <p>
                            {value} {record.firstName}
                        </p>
                        {record.isMain ? <StarOutlined /> : ''}
                    </div>
                );
            },
        },
        {
            title: 'Позиція',
            dataIndex: 'positions',
            key: 'positions',
            render(value, record) {
                return (
                    <div key={`${value}${record.id}`} className="team-table-item-name">
                        <p>
                            {record.positions.map((x) => `${x.position} `)}
                            {' '}
                        </p>
                    </div>
                );
            },
        },
        {
            title: 'Опис',
            dataIndex: 'description',
            key: 'description',
            render(value, record) {
                return (
                    <div key={`${value}${record.id}`} className="team-table-item-name">
                        <p>{value}</p>
                    </div>
                );
            },
        },
        {
            title: 'Фото',
            dataIndex: 'image',
            key: 'image',
            onCell: () => ({
                style: { padding: '0', margin: '0' },
            }),
            render: renderImageColumn,
        },
        { title: 'Соц. мережі',
          dataIndex: 'teamMemberLinks',
          key: 'teamMemberLinks',
          width: '8%',
          render: (links: TeamMemberLink[], team) => (
              <div key={`${links.length}${team.id}${team.imageId}`} className="team-links">
                  {links.map((link) => (
                      <a
                          key={`${link.id}${link.targetUrl}`}
                          rel="noreferrer"
                          target="_blank"
                          className="teamLink"
                          href={link.targetUrl.href}
                      >
                          <img
                              key={link.id * link.logoType}
                              src={LogoType[link.logoType]}
                              alt={link.targetUrl.title}
                          />
                      </a>
                  ))}
              </div>
          ) },
        {
            title: 'Дії',
            dataIndex: 'action',
            key: 'action',
            width: '5%',
            render: (value, team, index) => (
                <div key={`${team.id}${index}`} className="team-page-actions">
                    <EditOutlined
                        key={`${team.id}${index}`}
                        className="actionButton"
                        onClick={() => {
                            setTeamToedit(team);
                            setModalEditOpened(true);
                        }}
                    />
                    <DeleteOutlined
                        key={`${team.id}${index}`}
                        className="actionButton"
                        onClick={() => {
                            modalStore.setConfirmationModal(
                                'confirmation',
                                () => {
                                    teamStore.deleteTeam(team.id).then(() => {
                                        teamStore.TeamMap.delete(team.id);
                                    }).catch((e) => {
                                        console.log(e);
                                    });
                                    modalStore.setConfirmationModal('confirmation');
                                },
                                'Ви впевнені, що хочете видалити цього члена команди?',
                            );
                        }}
                    />
                </div>
            ),
        },
    ];
    return (
        <div className="team-page">
            <div className="team-page-container">
                <div className="team-page-header">
                    <Input
                        placeholder="Пошук по назві"
                        prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                        className="team-search-input"
                        allowClear
                        value={searchText}
                        onChange={(event) => setSearchText(event.target.value)}
                    />

                    <Button
                        className="team-page-add-button"
                        onClick={() => setModalAddOpened(true)}
                    >
                        Додати члена команди
                    </Button>
                </div>

                <Table
                    pagination={{ pageSize: 10 }}
                    className="team-table"
                    columns={columns}
                    dataSource={filteredTeam}
                    rowKey="id"
                />
            </div>

            <TeamModal open={modalAddOpened} setIsModalOpen={setModalAddOpened} />
            <TeamModal
                open={modalEditOpened}
                setIsModalOpen={setModalEditOpened}
                teamMember={teamToEdit}
            />
        </div>
    );
};
export default observer(TeamPage);
