export interface Comment {
  id: number;
  text: string;
  createdAt: string;
  updatedAt?: string;
  userId: number;
  username: string;
  avatarUrl?: string;
  streetcodeId: number;
  parentCommentId?: number;
  replies?: Comment[];
}

export interface CommentCreate {
  text: string;
  streetcodeId: number;
  userId: number;
  parentCommentId?: number;
}

export interface CommentUpdate {
  id: number;
  text: string;
  streetcodeId: number;
  userId: number;
  parentCommentId?: number;
}
