/* eslint-disable max-len */
import { makeAutoObservable, runInAction } from "mobx";
import CommentApi from "@api/comments/comment.api";
import { Comment, CommentCreate, CommentUpdate } from "@models/comments/comment.model";

const logError = (operation: string, error: unknown) => {
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.error(`[CommentStore] ${operation}`, error);
  }
};

const toErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string' && error) {
    return error;
  }
  return "Сталася невідома помилка";
};

const flattenComments = (comments: Comment[]): Comment[] => {
  const result: Comment[] = [];
  for (const comment of comments) {
    const { replies, ...rest } = comment;
    result.push(rest);
    if (replies?.length) {
      result.push(...flattenComments(replies));
    }
  }
  return result;
};

class CommentStore {
  public comments: Comment[] = [];

  public isLoading = false;

  public isSaving = false;

  public lastError: string | null = null;

  public editingCommentId: number | null = null;

  public replyingToCommentId: number | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  public clearError = () => {
    this.lastError = null;
  };

  public getCommentsByStreetcodeId = async (streetcodeId: number): Promise<Comment[]> => {
    this.isLoading = true;
    this.lastError = null;

    try {
      const comments = await CommentApi.getByStreetcodeId(streetcodeId);
      runInAction(() => {
        this.comments = flattenComments(comments);
      });
      return comments;
    } catch (error: unknown) {
      logError("getCommentsByStreetcodeId", error);
      runInAction(() => {
        this.lastError = toErrorMessage(error);
      });
      return [];
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  };

  public createComment = async (comment: CommentCreate): Promise<Comment | null> => {
    if (!comment.userId) {
      runInAction(() => {
        this.lastError = "Користувач не авторизований";
      });
      return null;
    }

    this.isSaving = true;
    this.lastError = null;

    try {
      const created = await CommentApi.create(comment);
      runInAction(() => {
        this.comments.unshift(created);
        this.replyingToCommentId = null;
      });
      return created;
    } catch (error: unknown) {
      logError("createComment", error);
      runInAction(() => {
        this.lastError = toErrorMessage(error);
      });
      return null;
    } finally {
      runInAction(() => {
        this.isSaving = false;
      });
    }
  };

  public updateComment = async (
    id: number,
    update: Omit<CommentUpdate, "id">,
  ): Promise<Comment | null> => {
    if (!update.userId) {
      runInAction(() => {
        this.lastError = "Користувач не авторизований";
      });
      return null;
    }

    this.isSaving = true;
    this.lastError = null;

    try {
      const comment = this.comments.find((c) => c.id === id);
      if (!comment) {
        throw new Error("Коментар не знайдено");
      }

      const updatePayload: CommentUpdate = {
        id,
        ...update,
      };

      const updated = await CommentApi.update(updatePayload);
      runInAction(() => {
        const index = this.comments.findIndex((c) => c.id === id);
        if (index !== -1) {
          this.comments[index] = updated;
        }
        this.editingCommentId = null;
      });
      return updated;
    } catch (error: unknown) {
      logError("updateComment", error);
      runInAction(() => {
        this.lastError = toErrorMessage(error);
      });
      return null;
    } finally {
      runInAction(() => {
        this.isSaving = false;
      });
    }
  };

  public deleteComment = async (id: number): Promise<boolean> => {
    this.isSaving = true;
    this.lastError = null;

    try {
      await CommentApi.delete(id);
      runInAction(() => {
        this.comments = this.comments.filter((c) => c.id !== id);
      });
      return true;
    } catch (error: unknown) {
      logError("deleteComment", error);
      runInAction(() => {
        this.lastError = toErrorMessage(error);
      });
      return false;
    } finally {
      runInAction(() => {
        this.isSaving = false;
      });
    }
  };

  public setEditingCommentId = (id: number | null) => {
    this.editingCommentId = id;
  };

  public setReplyingToCommentId = (id: number | null) => {
    this.replyingToCommentId = id;
  };

  public getCommentReplies = (parentId: number): Comment[] => this.comments.filter((c) => c.parentCommentId === parentId);

  public getMainComments = (): Comment[] => this.comments.filter((c) => !c.parentCommentId);
}

export default CommentStore;
