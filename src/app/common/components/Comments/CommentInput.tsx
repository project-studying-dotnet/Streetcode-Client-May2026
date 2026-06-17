/* eslint-disable object-curly-newline */
/* eslint-disable max-len */
import "./CommentInput.styles.scss";

import React, { useEffect, useState } from "react";
import { SendOutlined } from "@ant-design/icons";
import { Comment } from "@models/comments/comment.model";
import useMobx from "@stores/root-store";

import { Button, Input, message } from "antd";

const { TextArea } = Input;

interface CommentInputProps {
  streetcodeId?: number;
  onCommentCreated?: (comment: Comment) => void;
  parentCommentId?: number;
  editingComment?: Comment | null;
  onEditCancel?: () => void;
}

const CommentInput: React.FC<CommentInputProps> = ({
  streetcodeId,
  onCommentCreated,
  parentCommentId,
  editingComment,
  onEditCancel,
}) => {
  const [value, setValue] = useState(editingComment?.text ?? "");
  const { commentsStore, userLoginStore } = useMobx();

  useEffect(() => {
    setValue(editingComment?.text ?? "");
  }, [editingComment]);

  const handleSubmit = async () => {
    if (!value.trim() || !streetcodeId) {
      message.warning("Будь ласка, напишіть коментар");
      return;
    }

    const { userId } = userLoginStore;
    if (!userId) {
      message.error("Ви не авторизовані. Будь ласка, увійдіть в систему.");
      return;
    }

    if (editingComment) {
      if (value.trim() === editingComment.text.trim()) {
        onEditCancel?.();
        return;
      }
      const success = await commentsStore.updateComment(editingComment.id, {
        text: value,
        streetcodeId,
        userId,
        parentCommentId: editingComment.parentCommentId,
      });
      if (success) {
        message.success("Коментар оновлено");
        setValue("");
        onEditCancel?.();
      } else {
        message.error(commentsStore.lastError || "Помилка при оновленні коментаря");
      }
    } else {
      const created = await commentsStore.createComment({
        text: value,
        streetcodeId,
        userId,
        parentCommentId,
      });
      if (created) {
        message.success("Коментар додано");
        setValue("");
        onCommentCreated?.(created);
      } else {
        message.error(commentsStore.lastError || "Помилка при додаванні коментаря");
      }
    }
  };

  const handleCancel = () => {
    setValue("");
    onEditCancel?.();
  };

  return (
    <div className="comment-input-wrapper">
      <TextArea
        className="comment-textarea"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={editingComment ? "Редагуйте коментар..." : "Напишіть коментар..."}
        autoSize={{ minRows: 2, maxRows: 4 }}
        disabled={commentsStore.isSaving}
      />
      <div className="comment-actions-container">
        {editingComment && (
          <Button className="cancel-btn" onClick={handleCancel} disabled={commentsStore.isSaving}>
            Скасувати
          </Button>
        )}
        <Button
          className="submit-btn"
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSubmit}
          disabled={!value.trim() || commentsStore.isSaving}
          loading={commentsStore.isSaving}
        >
          {editingComment ? "Зберегти" : "Надіслати"}
        </Button>
      </div>
    </div>
  );
};

export default CommentInput;
