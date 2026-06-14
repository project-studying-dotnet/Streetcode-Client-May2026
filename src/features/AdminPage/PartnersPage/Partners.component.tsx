import "./Partners.styles.scss";

import { observer } from "mobx-react-lite";
import React, { useEffect, useMemo, useState } from "react";
import { DeleteOutlined, EditOutlined, SearchOutlined, StarOutlined } from "@ant-design/icons";
import facebook from "@assets/images/partners/facebook.png";
import instagram from "@assets/images/partners/instagram.png";
import twitter from "@assets/images/partners/twitter.png";
import youtube from "@assets/images/partners/youtube.png";
import ImageStore from "@stores/image-store";
import useMobx, { useModalContext } from "@stores/root-store";

import { Button, Input, Table } from "antd";
import { ColumnsType } from "antd/es/table";

import PartnersApi from "@/app/api/partners/partners.api";
import base64ToUrl from "@/app/common/utils/base64ToUrl.utility";
import Image from "@/models/media/image.model";
import Partner, { PartnerSourceLink } from "@/models/partners/partners.model";
import CustomSortIcon from '@/app/common/components/SortIcon.component';

import PartnerModal from "./PartnerModal/PartnerModal.component";

const LogoType = [twitter, instagram, facebook, youtube];

const Partners: React.FC = observer(() => {
  const { partnersStore } = useMobx();

  const { modalStore } = useModalContext();
  const [modalAddOpened, setModalAddOpened] = useState<boolean>(false);
  const [modalEditOpened, setModalEditOpened] = useState<boolean>(false);
  const [partnerToEdit, setPartnerToEdit] = useState<Partner>();
  const [searchText, setSearchText] = useState('');

    const updatedPartners = () => {
        Promise.all([
            partnersStore?.fetchPartnersAll(),
        ]).then(() => {
            partnersStore?.PartnerMap.forEach((val, key) => {
                ImageStore.getImageById(val.logoId).then((logo) => {
                    partnersStore.PartnerMap.set(
                        val.id,
                        { ...val, logo },
                    );
                });
            });
        }).then(() => partnersStore.setInternalMap(partnersStore.getPartnerArray));
    };

    useEffect(() => {
        updatedPartners();
    }, []);

    const filteredPartners = useMemo(() => {
        const normalizedSearch = searchText.trim().toLowerCase();

        if (!normalizedSearch) {
            return partnersStore?.getPartnerArray ?? [];
        }

        return (partnersStore?.getPartnerArray ?? []).filter((partner) => {
            return [
                partner.title,
                partner.targetUrl?.title,
                partner.targetUrl?.href,
            ].some((value) => value?.toLowerCase().includes(normalizedSearch));
        });
    }, [searchText, partnersStore?.getPartnerArray]);

    const handleDeletePartner = async (partnerId: number) => {
        try {
            await PartnersApi.delete(partnerId);
            partnersStore.PartnerMap.delete(partnerId);
        } catch (e) {
            console.error(e);
        }

        modalStore.setConfirmationModal('confirmation');
    };

    const openDeleteModal = (partner: Partner) => {
        modalStore.setConfirmationModal(
            'confirmation',
            () => handleDeletePartner(partner.id),
            'Ви впевнені, що хочете видалити цього партнера?',
        );
    };

    const openEditModal = (partner: Partner) => {
        setPartnerToEdit(partner);
        setModalEditOpened(true);
    };

    const columns: ColumnsType<Partner> = [
        {
            title: 'Назва',
            dataIndex: 'title',
            key: 'title',
            sorter: (a, b) => (a.title ?? '').localeCompare(b.title ?? ''),
            sortIcon: CustomSortIcon,
            render(value, record) {
                return (
                    <div key={`${value}${record.id}`} className="partner-table-item-name">
                        <p>{value}</p>
                        {record.isKeyPartner ? <StarOutlined /> : ''}
                    </div>
                );
            },
        },
        {
            title: 'Посилання на сайт',
            dataIndex: 'targetUrl',
            key: 'url',
            width: '28%',
            render: (targetUrl) => (
                <a
                    className="site-link"
                    href={targetUrl?.href}
                    target="_blank"
                    rel="noreferrer"
                >
                    {targetUrl?.title ?? targetUrl?.href}
                </a>
            ),
        },
        {
            title: 'Лого',
            dataIndex: 'logo',
            key: 'logo',
            onCell: () => ({
                style: { padding: '0', margin: '0' },
            }),
            render: (logo:Image, record) => (
                <img
                    key={`${record.id}${logo?.id}`}
                    className="partners-table-logo"
                    src={base64ToUrl(logo?.base64, logo?.mimeType ?? '')}
                    alt={logo?.imageDetails?.alt ?? record.title ?? 'Partner logo'}
                />
            ),

        },
        {
            title: 'Соц. мережі',
            dataIndex: 'partnerSourceLinks',
            key: 'partnerSourceLinks',
            width: '12%',
            render: (links:PartnerSourceLink[], partner) => (
                <div key={`${links.length}${partner.id}${partner.logoId}`} className="partner-links">
                    {links.map((link) => (
                        <a
                            key={`${link.id}${link.targetUrl}`}
                            rel="noreferrer"
                            target="_blank"
                            className="sourceLink"
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
            ),
        },
        { title: 'Дії',
          dataIndex: 'action',
          key: 'action',
          width: '10%',
          render: (value, partner, index) => (
              <div key={`${partner.id}${index}`} className="partner-page-actions">
                  <EditOutlined
                      key={`${partner.id}${index}222`}
                      className="actionButton"
                      onClick={() => openEditModal(partner)}
                  />
                  <DeleteOutlined
                      key={`${partner.id}${index}111`}
                      className="actionButton"
                      onClick={() => openDeleteModal(partner)}
                  />
              </div>
          ) },
    ];
    return (
        <div className="partners-page">
            <div className="partners-page-container">
                <div className="partners-page-header">
                    <Input
                        placeholder="Пошук по назві"
                        prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                        className="partners-search-input"
                        allowClear
                        value={searchText}
                        onChange={(event) => setSearchText(event.target.value)}
                    />

                    <Button
                        className="partners-page-add-button partners-page-add-button"
                        onClick={() => setModalAddOpened(true)}
                    >
                        Додати партнера
                    </Button>
                </div>
                <Table
                    pagination={{ pageSize: 10 }}
                    className="partners-table"
                    columns={columns}
                    dataSource={filteredPartners}
                    rowKey="id"
                />
            </div>
            <PartnerModal open={modalAddOpened} setIsModalOpen={setModalAddOpened} isStreetcodeVisible />
            <PartnerModal
                open={modalEditOpened}
                setIsModalOpen={setModalEditOpened}
                partnerItem={partnerToEdit}
                isStreetcodeVisible
            />
        </div>

    );
});
export default Partners;
