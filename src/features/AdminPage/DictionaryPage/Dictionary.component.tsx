import "./Dictionary.styles.scss";

import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import AdminBar from "@features/AdminPage/AdminBar.component";
import DictionaryModal from "@features/AdminPage/DictionaryPage/DictionaryModal/DictionaryModal.component";
import useMobx, { useModalContext } from "@stores/root-store";

import Button from "antd/es/button";
import Input from "antd/es/input";
import Table, { ColumnsType } from "antd/es/table";

import TermApi from "@/app/api/streetcode/text-content/terms.api";
import { Term } from "@/models/streetcode/text-contents.model";

export const Dictionary: React.FC = observer(() => {
  const { termsStore } = useMobx();
  const { modalStore } = useModalContext();
  const [modalAddOpened, setModalAddOpened] = useState<boolean>(false);

  const updatedTerms = () => {
    Promise.all([termsStore?.fetchTerms()]).then(() => termsStore.setInternalMap(termsStore.getTermArray));
  };

  useEffect(() => {
    updatedTerms();
  }, []);

  const columns: ColumnsType<Term> = [
    {
      title: "Назва",
      dataIndex: "title",
      key: "title",
      width: "30%",
      render(value, record) {
        return (
          <div
            key={`${value}${record.id}`}
            className="dictionary-table-item-name"
          >
            <p>{value}</p>
          </div>
        );
      },
    },
    {
      title: "Опис",
      dataIndex: "description",
      key: "description",
      render: (description) => (
        <p className="dictionary-table-item-description">{description}</p>
      ),
    },
    {
      title: "Дії",
      dataIndex: "action",
      key: "action",
      width: "10%",
      render: (value, term, index) => (
        <div key={`${term.id}${index}`} className="dictionary-page-actions">
          <EditOutlined
            key={`${term.id}${index}edit`}
            className="actionButton"
            onClick={() => {
              // Додати логіку для setTermToEdit та setModalEditOpened
            }}
          />
          <DeleteOutlined
            key={`${term.id}${index}delete`}
            className="actionButton"
            onClick={() => {
              modalStore.setConfirmationModal(
                "confirmation",
                () => {
                  TermApi.delete(term.id)
                    .then(() => {
                      termsStore.TermMap.delete(term.id);
                    })
                    .catch((e) => {});
                  modalStore.setConfirmationModal("confirmation");
                },
                "Ви впевнені, що хочете видалити цей термін?",
              );
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="dictionary-page">
      <AdminBar />
      <div className="dictionary-page-container">
        <div className="dictionary-header-container">
          <Input
            placeholder="Назва"
            prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
            className="dictionary-search-input"
            allowClear
          />
          <Button
            className="streetcode-custom-button dictionary-page-add-button"
            onClick={() => setModalAddOpened(true)}
          >
            Додати термін
          </Button>
        </div>
        <Table
          pagination={{ pageSize: 10 }}
          className="dictionaries-table"
          columns={columns}
          dataSource={termsStore?.getTermArray}
          rowKey="id"
        />
      </div>
      <DictionaryModal
        open={modalAddOpened}
        setIsModalOpen={setModalAddOpened}
      />
    </div>
  );
});

export default Dictionary;
