import { makeAutoObservable, runInAction } from "mobx";

import { SpinProps } from "antd/es/spin";

import { Comment, CommentCreate } from "@/models/comments/comment.model";

class CommentStore {
  public comments: Comment[] = [];

  public isLoading = false;

  static readonly isLoading: boolean | SpinProps | undefined;

  constructor() {
    makeAutoObservable(this);
    this.loadMockComments();
  }

  private loadMockComments() {
    this.comments = Array.from({ length: 12 }).map((_, index) => ({
      id: index,
      text:
        index % 2 === 0
          ? "Чудовий стріткод! Дуже інформативно та цікаво дізнатися про історію цієї локації."
          : "Підтримую! Хотілося б бачити більше таких інтерактивних елементів на сторінці.",
      createdAt: "10.06.2026",
      userId: `user-${index}`,
      username: `Користувач ${index + 1}`,
      avatarUrl: `https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`,
      streetcodeId: 1,
    }));
  }

  public createComment = async (comment: CommentCreate) => {
    this.isLoading = true;
    try {
      await new Promise((resolve) => {
        setTimeout(resolve, 500);
      });

      const newComment: Comment = {
        id: Math.random(),
        text: comment.text,
        createdAt: "10.06.2026",
        userId: "current-user",
        username: "Поточний Користувач",
        avatarUrl: "https://api.dicebear.com/7.x/miniavs/svg?seed=current",
        streetcodeId: comment.streetcodeId,
        parentId: comment.parentId,
      };

      runInAction(() => {
        this.comments.unshift(newComment);
        this.isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.isLoading = false;
      });
      console.error("Помилка при створенні коментаря:", error);
    }
  };

  public deleteComment = async (id: number) => {
    this.comments = this.comments.filter((c) => c.id !== id);
  };
}

export default CommentStore;
