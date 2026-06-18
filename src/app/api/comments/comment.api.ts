/* eslint-disable max-len */
import Agent from "@api/agent.api";
import { API_ROUTES } from "@constants/api-routes.constants";
import { Comment, CommentCreate, CommentUpdate } from "@models/comments/comment.model";

const CommentApi = {
  getByStreetcodeId: (streetcodeId: number) => Agent.get<Comment[]>(`${API_ROUTES.COMMENTS.GET_BY_STREETCODE_ID}/${streetcodeId}`),

  create: (comment: CommentCreate) => Agent.post<Comment>(`${API_ROUTES.COMMENTS.CREATE}`, comment),

  update: (comment: CommentUpdate) => Agent.put<Comment>(`${API_ROUTES.COMMENTS.UPDATE}`, comment),

  delete: (id: number) => Agent.delete<void>(`${API_ROUTES.COMMENTS.DELETE}/${id}`),
};

export default CommentApi;
