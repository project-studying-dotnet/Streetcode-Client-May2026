/* eslint-disable object-curly-newline */
/* eslint-disable import/extensions */
/* eslint-disable max-len */
import "./CommentsDrawerContainer.styles.scss";

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CommentInput from "@components/Comments/CommentInput";
import CommentItem from "@components/Comments/CommentItem";
import { Comment } from "@models/comments/comment.model";
import useMobx from "@stores/root-store";

import { Divider, Drawer, Empty, List, Typography } from "antd";

const { Text } = Typography;

const CommentsDrawerContainer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: streetcodeId } = useParams<{ id: string }>();
  const { commentsStore } = useMobx();

  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<Set<number>>(new Set());

  const isOpen = location.pathname.endsWith("/comments");

  useEffect(() => {
    if (isOpen && streetcodeId) {
      commentsStore.getCommentsByStreetcodeId(Number.parseInt(streetcodeId, 10));
    }
  }, [isOpen, streetcodeId, commentsStore]);

  const handleClose = () => {
    navigate("../", { relative: "path" });
    setEditingComment(null);
    commentsStore.setReplyingToCommentId(null);
  };

  const handleReplyClick = (parentId: number) => {
    commentsStore.setReplyingToCommentId(parentId);
  };

  const handleEditClick = (comment: Comment) => {
    setEditingComment(comment);
    commentsStore.setEditingCommentId(comment.id);
  };

  const handleEditCancel = () => {
    setEditingComment(null);
    commentsStore.setEditingCommentId(null);
  };

  const toggleRepliesExpanded = (parentId: number) => {
    const newExpanded = new Set(expandedReplies);
    if (newExpanded.has(parentId)) {
      newExpanded.delete(parentId);
    } else {
      newExpanded.add(parentId);
    }
    setExpandedReplies(newExpanded);
  };

  const mainComments = commentsStore.getMainComments();

  return (
    <Drawer title="Коментарі" placement="right" onClose={handleClose} open={isOpen} width={400} rootClassName="comments-drawer">
      <div className="comments-drawer-list-area">
        {mainComments.length === 0 && !commentsStore.isLoading ? (
          <Empty description="Немає коментарів" />
        ) : (
          <List
            itemLayout="horizontal"
            loading={commentsStore.isLoading}
            dataSource={mainComments}
            renderItem={(mainComment) => (
              <div key={mainComment.id}>
                <CommentItem
                  item={mainComment}
                  onReplyClick={handleReplyClick}
                  onEditClick={handleEditClick}
                  onRepliesCountChange={() => setExpandedReplies(new Set())}
                />

                {/* Replies section */}
                {commentsStore.getCommentReplies(mainComment.id).length > 0 && (
                  <div className="comment-replies-container">
                    <button type="button" className="toggle-replies-btn" onClick={() => toggleRepliesExpanded(mainComment.id)}>
                      {expandedReplies.has(mainComment.id)
                        ? `Сховати відповіді (${commentsStore.getCommentReplies(mainComment.id).length})`
                        : `Показати відповіді (${commentsStore.getCommentReplies(mainComment.id).length})`}
                    </button>

                    {expandedReplies.has(mainComment.id) && (
                      <List
                        itemLayout="horizontal"
                        dataSource={commentsStore.getCommentReplies(mainComment.id)}
                        renderItem={(reply) => (
                          <div key={reply.id} className="reply-item">
                            <CommentItem
                              item={reply}
                              onReplyClick={handleReplyClick}
                              onEditClick={handleEditClick}
                              onRepliesCountChange={() => setExpandedReplies(new Set())}
                            />
                          </div>
                        )}
                      />
                    )}

                    {/* Reply input */}
                    {commentsStore.replyingToCommentId === mainComment.id && (
                      <div className="reply-input-wrapper">
                        <Text type="secondary">
                          Відповідь на коментар
                          {mainComment.username}
                        </Text>
                        <CommentInput
                          streetcodeId={streetcodeId}
                          parentCommentId={mainComment.id}
                          onCommentCreated={() => {
                            commentsStore.setReplyingToCommentId(null);
                            setExpandedReplies(new Set([...expandedReplies, mainComment.id]));
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Reply input for new reply */}
                {commentsStore.replyingToCommentId === mainComment.id && commentsStore.getCommentReplies(mainComment.id).length === 0 && (
                  <div className="reply-input-wrapper">
                    <Text type="secondary">
                      Відповідь на коментар
                      {mainComment.username}
                    </Text>
                    <CommentInput
                      streetcodeId={streetcodeId}
                      parentCommentId={mainComment.id}
                      onCommentCreated={() => {
                        commentsStore.setReplyingToCommentId(null);
                        setExpandedReplies(new Set([...expandedReplies, mainComment.id]));
                      }}
                    />
                  </div>
                )}

                <Divider />
              </div>
            )}
          />
        )}
      </div>

      {/* Main comment input area */}
      {editingComment && (
        <div className="editing-notice">
          <Text type="secondary">Редагування коментаря</Text>
        </div>
      )}
      {commentsStore.replyingToCommentId === null && !editingComment && (
        <div className="main-comment-input-area">
          <Text type="secondary">Новий коментар</Text>
        </div>
      )}
      <CommentInput streetcodeId={streetcodeId} editingComment={editingComment} onEditCancel={handleEditCancel} />
    </Drawer>
  );
};

export default CommentsDrawerContainer;
