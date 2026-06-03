/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
import "./Dictionary.styles.scss";

import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import AdminBar from "@features/AdminPage/AdminBar.component";
import useMobx, { useModalContext } from "@stores/root-store";

import Button from "antd/es/button";
import Input from "antd/es/input";
import Table, { ColumnsType } from "antd/es/table";

import TermApi from "@/app/api/streetcode/text-content/terms.api";
import DictionaryModal from "@/app/common/components/modals/Terms/CreateUpdateTerm/DictionaryModal.component";
import { Term } from "@/models/streetcode/text-contents.model";

export const Dictionary: React.FC = observer(() => {
  const { termsStore } = useMobx();
  const { modalStore } = useModalContext();
  const [searchText, setSearchText] = useState("");

  const filteredTerms = termsStore.getTermArray.filter((term) => {
    if (!searchText) return true;
    return term.title?.toLowerCase().includes(searchText.toLowerCase());
  });

  useEffect(() => {
    Promise.all([termsStore?.fetchTerms()]).then(() =>
      termsStore.setInternalMap(termsStore.getTermArray),
    );
  }, [termsStore]);

  const columns: ColumnsType<Term> = [
    {
      title: "Назва",
      dataIndex: "title",
      key: "title",
      width: "30%",
      sorter: (a, b) => a.title.localeCompare(b.title),
      sortIcon: ({ sortOrder }) => {
        const color = "#1D1F23";

        return (
          <svg
            width="13"
            height="13"
            viewBox="0 0 13 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.5 7.25L12.5 7.25L6.5 0.5L0.5 7.25Z"
              fill={sortOrder === "ascend" ? color : "transparent"}
              stroke={color}
              strokeLinejoin="round"
            />
            <path
              d="M0.5 10.75L12.5 10.75L6.5 17.5L0.5 10.75Z"
              fill={sortOrder === "descend" ? color : "transparent"}
              stroke={color}
              strokeLinejoin="round"
            />
          </svg>
        );
      },
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
            onClick={() => modalStore.setModal("editTerm", term.id, true)}
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
                    .catch((e) => {
                      console.error(e);
                    });
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
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button
            className="streetcode-custom-button dictionary-page-add-button"
            onClick={() => {
              modalStore.setModal("addTerm", undefined, true);
            }}
          >
            Додати термін
          </Button>
        </div>
        <Table
          showSorterTooltip={false}
          pagination={{ pageSize: 10 }}
          className="dictionaries-table"
          columns={columns}
          dataSource={filteredTerms}
          rowKey="id"
        />
      </div>
      <DictionaryModal />
    </div>
  );
});

export default Dictionary;
