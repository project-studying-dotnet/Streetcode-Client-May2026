/* eslint-disable object-curly-newline */
import "./CommentItem.styles.scss";

import React from "react";
import { CommentOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";

import { Avatar, Button, List, Space, Typography } from "antd";

const { Text, Paragraph } = Typography;

const CommentItem: React.FC<{ item: CommentData }> = ({ item }) => (
  <List.Item className="comment-item">
    <div className="comment-item-content">
      <Avatar src={item.avatarUrl} className="comment-item-avatar" />
      <div style={{ flexGrow: 1 }}>
        <div className="comment-item-header">
          <Text strong className="comment-item-author">
            {item.author}
          </Text>
          <Text type="secondary" className="comment-item-date">
            {item.date}
          </Text>
        </div>
        <Paragraph className="comment-item-text">{item.text}</Paragraph>
      </div>
    </div>

    <Space size="middle" className="comment-item-actions">
      <Button type="link" size="small" icon={<CommentOutlined />}>
        Відповісти
      </Button>
      <Button type="link" size="small" icon={<EditOutlined />}>
        Редагувати
      </Button>
      <Button type="link" size="small" danger icon={<DeleteOutlined />}>
        Видалити
      </Button>
    </Space>
  </List.Item>
);

export default CommentItem;
