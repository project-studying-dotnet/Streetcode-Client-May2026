import "./CreateUpdateTermModal.styles.scss";

import CancelBtn from "@images/utils/Cancel_btn.svg";

import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";

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

export const CreateUpdateTermModal: React.FC<Props> = ({ afterSubmit }) => {
  const [form] = Form.useForm();
  const { termsStore } = useMobx();
  const { modalStore } = useModalContext();

  const { addTerm, editTerm } = modalStore.modalsState;
  const isOpen = addTerm.isOpen || editTerm.isOpen;
  const isEditMode = editTerm.isOpen;

  const termItem =
    isEditMode && editTerm.fromCardId
      ? termsStore.getTermArray.find((t) => t.id === editTerm.fromCardId)
      : undefined;

  useEffect(() => {
    if (isOpen) {
      console.log(`CreateUpdateTermModal opened in ${isEditMode ? "edit" : "add"} mode`, {
        termItem,
      });
      if (isEditMode && termItem) {
        form.setFieldsValue({
          title: termItem.title,
          description: termItem.description,
        });
      } else {
        form.resetFields();
      }
    }
  }, [isOpen, isEditMode, termItem, form]);

  const closeAndCleanData = () => {
    form.resetFields();
    modalStore.setModal("addTerm", undefined, false);
    modalStore.setModal("editTerm", undefined, false);
  };

  const onSuccesfulSubmitTerm = async (formValues: TermCreate) => {
    const termData = {
      title: formValues.title,
      description: formValues.description?.trim() || undefined,
    };

    try {
      let result: Term | null = null;

      if (isEditMode && editTerm.fromCardId) {
        console.log("Updating term with ID:", editTerm.fromCardId, termData);
        result = await termsStore.updateTerm({
          ...termData,
          id: editTerm.fromCardId,
        });
      } else {
        result = await termsStore.createTerm(termData);
      }

      const termResult: Term | undefined = result ?? undefined;
      if (afterSubmit && termResult) {
        afterSubmit(termResult);
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
            <h2 className="modal-title">
              {isEditMode ? "Редагувати " : "Додати "}
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
            <TextArea showCount maxLength={500} className="description-input" />
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

export default observer(CreateUpdateTermModal);
