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
    currentUserId?: number;
    onReplyClick?: (parentId: number) => void;
    onEditClick?: (comment: Comment) => void;
    onRepliesCountChange?: () => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
    item,
    currentUserId,
    onReplyClick,
    onEditClick,
    onRepliesCountChange,
}) => {
    const { commentsStore } = useMobx();
    const isOwner = currentUserId !== undefined && currentUserId === item.userId;

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
                <div className="comment-item-body">
                    <div className="comment-item-header">
                        <Text strong className="comment-item-author">{item.username}</Text>
                        <div className="comment-item-meta">
                            <Text type="secondary" className="comment-item-date">
                                {new Date(item.createdAt).toLocaleDateString("uk-UA")}
                            </Text>
                            {item.updatedAt && item.updatedAt !== item.createdAt && (
                                <Text type="secondary" className="comment-item-edited">
                                    (редаговано)
                                </Text>
                            )}
                        </div>
                    </div>
                    <Paragraph className="comment-item-text">{item.text}</Paragraph>
                </div>
            </div>

            <Space size="small" className="comment-item-actions">
                <Button
                    type="link"
                    size="small"
                    icon={<CommentOutlined />}
                    onClick={() => onReplyClick?.(item.id)}
                >
                    Відповісти
                </Button>

                {isOwner && (
                    <>
                        <Button
                            type="link"
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => onEditClick?.(item)}
                        >
                            Редагувати
                        </Button>
                        <Popconfirm
                            title="Видалити коментар?"
                            okText="Видалити"
                            cancelText="Скасувати"
                            rootClassName="comment-delete-popconfirm"
                            onConfirm={handleDelete}
                        >
                            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
                                Видалити
                            </Button>
                        </Popconfirm>
                    </>
                )}
            </Space>
        </List.Item>
    );
};

export default CommentItem;
