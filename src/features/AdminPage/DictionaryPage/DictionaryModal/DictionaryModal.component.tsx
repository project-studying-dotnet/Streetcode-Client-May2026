import "./DictionaryModal.styles.scss";
import "@features/AdminPage/AdminModal.styles.scss";

import CancelBtn from "@images/utils/Cancel_btn.svg";

import { observer } from "mobx-react-lite";
import React from "react";

import Button from "antd/es/button";
import Form from "antd/es/form";
import Input from "antd/es/input/Input";
import TextArea from "antd/es/input/TextArea";
import Modal from "antd/es/modal";

// eslint-disable-next-line import/extensions
import useMobx from "@/app/stores/root-store";
import { Term, TermCreate } from "@/models/streetcode/text-contents.model";

interface Props {
  termItem?: Term;
  open: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  afterSubmit?: (partner: Term) => void;
}

export const DictionaryModal: React.FC<Props> = observer(
  ({ termItem, open, setIsModalOpen, afterSubmit }) => {
    const [form] = Form.useForm();

    const { termsStore } = useMobx();

    const closeAndCleanData = () => {
      form.resetFields();
      setIsModalOpen(false);
    };

    const onSuccesfulSubmitTerm = async (formValues: TermCreate) => {
      const term: TermCreate = {
        title: formValues.title,
        description: formValues.description?.trim() || undefined,
      };

      try {
        const t = await termsStore.createTerm(term);
        if (afterSubmit && t) {
          afterSubmit(t);
        }
      } catch (e) {
        console.error(e);
      } finally {
        closeAndCleanData();
      }
    };

    return (
      <Modal
        open={open}
        onCancel={closeAndCleanData}
        className="modalContainer"
        footer={null}
        closeIcon={<CancelBtn />}
      >
        <div className="modalContainer-content">
          <Form form={form} layout="vertical" onFinish={onSuccesfulSubmitTerm}>
            <div className="center">
              <h2>
                {termItem ? "Редагувати " : "Додати "}
                термін
              </h2>
            </div>

            <Form.Item
              name="title"
              label="Назва"
              rules={[{ required: true, message: "Введіть назву" }]}
            >
              <Input maxLength={50} showCount />
            </Form.Item>

            <Form.Item
              name="description"
              label="Опис"
              rules={[{ required: true, message: "Введіть опис" }]}
            >
              <TextArea showCount maxLength={500} />
            </Form.Item>

            <Button
              className="streetcode-custom-button save"
              onClick={() => {
                form.submit();
              }}
            >
              Зберегти
            </Button>
          </Form>
        </div>
      </Modal>
    );
  },
);

export default DictionaryModal;
