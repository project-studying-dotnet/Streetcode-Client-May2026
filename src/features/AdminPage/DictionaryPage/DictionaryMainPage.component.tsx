import "./DictionaryMainPage.styles.scss";

import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import {
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons/lib/icons";
import AdminBar from "@features/AdminPage/AdminBar.component";
import DictionaryModal from "@features/AdminPage/DictionaryPage/DictionaryModal/DictionaryModal.component";
import useMobx, { useModalContext } from "@stores/root-store";

import Button from "antd/es/button";
import Table, { ColumnsType } from "antd/es/table";

import TermApi from "@/app/api/streetcode/text-content/terms.api";
import { Term } from "@/models/streetcode/text-contents.model";
/* eslint-disable indent */
export const DictionaryMainPage: React.FC = observer(() => {
  const { termsStore } = useMobx();
  const { modalStore } = useModalContext();
  const [modalAddOpened, setModalAddOpened] = useState<boolean>(false);

  const updatedTerms = () => {
    Promise.all([termsStore?.fetchTerms()])
      .then(() => termsStore.setInternalMap(termsStore.getTermArray));
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
          <DeleteOutlined
            key={`${term.id}${index}111`}
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
          {/* <EditOutlined
            key={`${term.id}${index}222`}
            className="actionButton"
            onClick={() => {
              setTermToEdit(term);
              setModalEditOpened(true);
            }}
          /> */}
        </div>
      ),
    },
  ];

  return (
    <div className="dictionary-page">
      <AdminBar />
      <div className="dictionary-page-container">
        <div className="container-justify-end">
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

export default DictionaryMainPage;
