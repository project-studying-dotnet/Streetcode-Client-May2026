/* eslint-disable object-curly-newline */
import "./CommentItem.styles.scss";

import React from "react";
import { CommentOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Comment } from "@models/comments/comment.model";
import useMobx from "@stores/root-store";

import { Avatar, Button, List, message, Popconfirm, Space, Typography } from "antd";

const { Text, Paragraph } = Typography;

interface CommentItemProps {
  item: Comment;
  onReplyClick?: (parentId: number) => void;
  onEditClick?: (comment: Comment) => void;
  onRepliesCountChange?: () => void;
}

const CommentItem: React.FC<CommentItemProps> = ({ item, onReplyClick, onEditClick, onRepliesCountChange }) => {
  const { commentsStore } = useMobx();

  const handleDelete = async () => {
    const success = await commentsStore.deleteComment(item.id);
    if (success) {
      message.success("Коментар видалено");
      onRepliesCountChange?.();
    } else {
      message.error(commentsStore.lastError || "Помилка при видаленні коментаря");
    }
  };

  return (
    <List.Item className="comment-item">
      <div className="comment-item-content">
        <Avatar src={item.avatarUrl} className="comment-item-avatar" />
        <div style={{ flexGrow: 1 }}>
          <div className="comment-item-header">
            <Text strong className="comment-item-author">
              {item.username}
            </Text>
            <Text type="secondary" className="comment-item-date">
              {new Date(item.createdAt).toLocaleDateString("uk-UA")}
            </Text>
            {item.updatedAt && item.updatedAt !== item.createdAt && (
              <Text type="secondary" className="comment-item-edited">
                (редаговано)
              </Text>
            )}
          </div>
          <Paragraph className="comment-item-text">{item.text}</Paragraph>
        </div>
      </div>

      <Space size="middle" className="comment-item-actions">
        <Button type="link" size="small" icon={<CommentOutlined />} onClick={() => onReplyClick?.(item.id)}>
          Відповісти
        </Button>
        <Button type="link" size="small" icon={<EditOutlined />} onClick={() => onEditClick?.(item)}>
          Редагувати
        </Button>
        <Popconfirm
          title="Видалити коментар?"
          description="Це дію не можна скасувати"
          okText="Видалити"
          cancelText="Скасувати"
          onConfirm={handleDelete}
        >
          <Button type="link" size="small" danger icon={<DeleteOutlined />}>
            Видалити
          </Button>
        </Popconfirm>
      </Space>
    </List.Item>
  );
};

export default CommentItem;
