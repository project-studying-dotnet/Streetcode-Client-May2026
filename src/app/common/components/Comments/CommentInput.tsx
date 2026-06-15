import "./CommentInput.styles.scss";

import React, { useState } from "react";
import { SendOutlined } from "@ant-design/icons";

import { Button, Input } from "antd";

const { TextArea } = Input;

const CommentInput: React.FC = () => {
  const [value, setValue] = useState("");

  return (
    <div className="comment-input-wrapper">
      <TextArea
        className="comment-textarea"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Напишіть коментар..."
        autoSize={{ minRows: 2, maxRows: 4 }}
      />
      <div className="comment-actions-container">
        <Button className="submit-btn" type="primary" icon={<SendOutlined />} disabled={!value.trim()}>
          Надіслати
        </Button>
      </div>
    </div>
  );
};

export default CommentInput;
