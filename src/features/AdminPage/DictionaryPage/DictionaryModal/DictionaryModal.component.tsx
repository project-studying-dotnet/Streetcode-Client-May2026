/* eslint-disable import/extensions */
/* eslint-disable react/jsx-wrap-multilines */
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

import useMobx, { useModalContext } from "@/app/stores/root-store";
import { Term, TermCreate } from "@/models/streetcode/text-contents.model";

interface Props {
  afterSubmit?: (term: Term) => void;
}

export const DictionaryModal: React.FC<Props> = ({ afterSubmit }) => {
  const [form] = Form.useForm();
  const { termsStore } = useMobx();
  const { modalStore } = useModalContext();

  const { isOpen } = modalStore.modalsState.addTerm;

  const closeAndCleanData = () => {
    form.resetFields();
    modalStore.setModal("addTerm", undefined, false);
  };

  const onSuccesfulSubmitTerm = async (formValues: TermCreate) => {
    try {
      const createdTerm = await termsStore.createTerm(formValues);
      const result: Term | undefined = createdTerm ?? undefined;

      if (afterSubmit && result) {
        afterSubmit(result);
      }
    } catch (e) {
      console.error(e);
    } finally {
      closeAndCleanData();
    }
  };

  return (
    <Modal
      open={isOpen}
      onCancel={closeAndCleanData}
      className="modalContainer"
      footer={null}
      closeIcon={<CancelBtn />}
    >
      <div className="modalContainer-content">
        <Form form={form} layout="vertical" onFinish={onSuccesfulSubmitTerm}>
          <div className="center">
            <h2>Додати термін</h2>
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
            onClick={() => form.submit()}
          >
            Зберегти
          </Button>
        </Form>
      </div>
    </Modal>
  );
};

export default observer(DictionaryModal);
