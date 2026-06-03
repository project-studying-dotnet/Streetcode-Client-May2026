import "./DeleteTermModal.styles.scss";

import CancelBtn from "@images/utils/Cancel_btn.svg";

import { observer } from "mobx-react-lite";
import useMobx, { useModalContext } from "@stores/root-store";

import { Modal } from "antd";

const DeleteTermModal = () => {
  const { termsStore } = useMobx();
  const {
    modalStore: {
      setModal,
      modalsState: { deleteTerm },
    },
  } = useModalContext();

  const termId = deleteTerm?.fromCardId as number;
  const term = termsStore.getTermArray.find((t) => t.id === termId);

  const handleDelete = async () => {
    if (termId) {
      try {
        await termsStore.deleteTerm(termId);
      } catch (e) {
        console.error(e);
      } finally {
        setModal("deleteTerm");
      }
    }
  };

  return (
    <Modal
      className="deleteModal"
      closeIcon={<CancelBtn />}
      open={deleteTerm.isOpen}
      onCancel={() => setModal("deleteTerm")}
      onOk={handleDelete}
    >
      <h2>Ви впевнені, що бажаєте видалити визначення?</h2>
      {term && (
        <p>
          {term.title}
          {" - "}
          {term.description}
        </p>
      )}
    </Modal>
  );
};

export default observer(DeleteTermModal);
