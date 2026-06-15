export interface Comment {
    id: number;
    text: string;
    createdAt: string;
    userId: string;
    username: string;
    avatarUrl?: string;
    streetcodeId: number;
    parentId?: number;
}

export interface CommentCreate {
    text: string;
    streetcodeId: number;
    parentId?: number;
}
