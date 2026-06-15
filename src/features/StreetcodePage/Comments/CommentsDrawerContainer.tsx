/* eslint-disable import/extensions */
/* eslint-disable max-len */
import "./CommentsDrawerContainer.styles.scss";

import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CommentInput from "@components/Comments/CommentInput";
import CommentItem from "@components/Comments/CommentItem";
import useMobx from "@stores/root-store";

import { Drawer, List } from "antd";

const CommentsDrawerContainer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: streetcodeId } = useParams<{ id: string }>();
  const { commentsStore } = useMobx();

  const isOpen = location.pathname.endsWith("/comments");

  const handleClose = () => {
    navigate("../", { relative: "path" });
  };

  return (
    <Drawer title="Коментарі" placement="right" onClose={handleClose} open={isOpen} width={400} rootClassName="comments-drawer">
      <div className="comments-drawer-list-area">
        <List
          itemLayout="horizontal"
          loading={commentsStore.isLoading}
          dataSource={commentsStore.comments}
          renderItem={(item) => <CommentItem item={item} />}
        />
      </div>

      <CommentInput streetcodeId={streetcodeId} />
    </Drawer>
  );
};

export default CommentsDrawerContainer;
