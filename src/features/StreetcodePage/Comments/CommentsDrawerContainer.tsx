/* eslint-disable object-curly-newline */
/* eslint-disable import/extensions */
/* eslint-disable max-len */
import "./CommentsDrawerContainer.styles.scss";

import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CommentInput from "@components/Comments/CommentInput";
import CommentItem from "@components/Comments/CommentItem";
import FRONTEND_ROUTES from "@constants/frontend-routes.constants";
import { Comment } from "@models/comments/comment.model";
import useMobx, { useStreetcodeDataContext } from "@stores/root-store";
import UserLoginStore from "@stores/user-login-store";

import { Button, Divider, Drawer, Empty, List, Typography } from "antd";

const { Text } = Typography;

const CommentsDrawerContainer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { streetcodeStore } = useStreetcodeDataContext();
  const { commentsStore, userLoginStore } = useMobx();

  const streetcodeId = streetcodeStore.getStreetCodeId;
  const { isLoggedIn } = UserLoginStore;
  const currentUserId = userLoginStore.userId;

  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<Set<number>>(new Set());

  const isOpen = location.pathname.endsWith("/comments");

  useEffect(() => {
    if (isOpen && streetcodeId > 0) {
      commentsStore.getCommentsByStreetcodeId(streetcodeId);
    }
  }, [isOpen, streetcodeId, commentsStore]);

  const handleClose = () => {
    navigate(location.pathname.replace(/\/comments$/, ""));
    setEditingComment(null);
    commentsStore.setEditingCommentId(null);
    commentsStore.setReplyingToCommentId(null);
  };

  const handleReplyClick = (parentId: number) => {
    if (!isLoggedIn) {
      navigate(FRONTEND_ROUTES.ADMIN.LOGIN);
      return;
    }
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
    setExpandedReplies((prev) => {
      const next = new Set(prev);
      if (next.has(parentId)) {
        next.delete(parentId);
      } else {
        next.add(parentId);
      }
      return next;
    });
  };

  const mainComments = commentsStore.getMainComments();
  const { replyingToCommentId } = commentsStore;

  return (
    <Drawer title="Коментарі" placement="right" onClose={handleClose} open={isOpen} width={600} rootClassName="comments-drawer">
      <div className="comments-drawer-list-area">
        {mainComments.length === 0 && !commentsStore.isLoading ? (
          <Empty description="Немає коментарів" />
        ) : (
          <List
            itemLayout="horizontal"
            loading={commentsStore.isLoading}
            dataSource={mainComments}
            renderItem={(mainComment) => {
              const replies = commentsStore.getCommentReplies(mainComment.id);
              const replyingToReply = replies.find((r) => r.id === replyingToCommentId);
              const isReplying = replyingToCommentId === mainComment.id || replyingToReply !== undefined;
              const replyTargetUsername = replyingToReply ? replyingToReply.username : mainComment.username;

              return (
                <div key={mainComment.id}>
                  <CommentItem
                    item={mainComment}
                    currentUserId={currentUserId}
                    onReplyClick={handleReplyClick}
                    onEditClick={handleEditClick}
                    onRepliesCountChange={() => setExpandedReplies(new Set())}
                  />

                  {replies.length > 0 && (
                    <div className="comment-replies-container">
                      <button type="button" className="toggle-replies-btn" onClick={() => toggleRepliesExpanded(mainComment.id)}>
                        {expandedReplies.has(mainComment.id) ? `Сховати відповіді (${replies.length})` : `Показати відповіді (${replies.length})`}
                      </button>

                      {expandedReplies.has(mainComment.id) && (
                        <List
                          itemLayout="horizontal"
                          dataSource={replies}
                          renderItem={(reply) => (
                            <div key={reply.id} className="reply-item">
                              <CommentItem
                                item={reply}
                                currentUserId={currentUserId}
                                onReplyClick={handleReplyClick}
                                onEditClick={handleEditClick}
                                onRepliesCountChange={() => setExpandedReplies(new Set())}
                              />
                            </div>
                          )}
                        />
                      )}
                    </div>
                  )}

                  {isReplying && (
                    <div className="reply-input-wrapper">
                      <Text className="reply-to-label">{`Відповідь на коментар ${replyTargetUsername}`}</Text>
                      <CommentInput
                        streetcodeId={streetcodeId}
                        parentCommentId={mainComment.id}
                        onCommentCreated={() => {
                          commentsStore.setReplyingToCommentId(null);
                          setExpandedReplies((prev) => new Set([...prev, mainComment.id]));
                        }}
                      />
                    </div>
                  )}

                  <Divider />
                </div>
              );
            }}
          />
        )}
      </div>

      <div className="comments-drawer-footer">
        {isLoggedIn ? (
          <CommentInput streetcodeId={streetcodeId} editingComment={editingComment} onEditCancel={handleEditCancel} />
        ) : (
          <Button className="comment-login-btn" block onClick={() => navigate(FRONTEND_ROUTES.ADMIN.LOGIN)}>
            Авторизуватися
          </Button>
        )}
      </div>
    </Drawer>
  );
};

export default observer(CommentsDrawerContainer);
