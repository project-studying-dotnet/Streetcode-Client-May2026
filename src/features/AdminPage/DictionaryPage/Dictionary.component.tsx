import "./Dictionary.styles.scss";

import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import useMobx, { useModalContext } from "@stores/root-store";

import Button from "antd/es/button";
import Input from "antd/es/input";
import Table, { ColumnsType } from "antd/es/table";

import CreateUpdateTermModal from "@/app/common/components/modals/Terms/CreateUpdateTerm/CreateUpdateTermModal.component";
import DeleteTermModalComponent from "@/app/common/components/modals/Terms/DeleteTerm/DeleteTermModal.component";
import CustomSortIcon from "@/app/common/components/SortIcon.component";
import { Term } from "@/models/streetcode/text-contents.model";

export const Dictionary = () => {
  const { termsStore } = useMobx();
  const { modalStore } = useModalContext();
  const [searchText, setSearchText] = useState("");

  const filteredTerms = termsStore.getTermArray.filter((term) => {
    if (!searchText) return true;
    return term.title?.toLowerCase().includes(searchText.toLowerCase());
  });

  useEffect(() => {
    termsStore
      ?.fetchTerms()
      .then(() => termsStore.setInternalMap(termsStore.getTermArray));
  }, [termsStore]);

  const columns: ColumnsType<Term> = [
    {
      title: "Назва",
      dataIndex: "title",
      key: "title",
      width: "30%",
      sorter: (a, b) => a.title.localeCompare(b.title),
      sortIcon: CustomSortIcon,
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
              modalStore.setModal("deleteTerm", term.id, true);
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="dictionary-page">
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
            className="admin-page-add-button"
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
      <CreateUpdateTermModal />
      <DeleteTermModalComponent />
    </div>
  );
};

export default observer(Dictionary);
