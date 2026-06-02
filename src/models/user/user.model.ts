export default interface User {
    id: number;
    name: string;
    surname: string;
    email: string;
    login: string;
    role: UserRole;
}

export interface UserLoginRequest {
    login: string;
    password: string;
}

export interface UserLoginResponce {
    user: User;
    token: string;
    refreshToken: string;
    expireAt: Date;
}

export interface RefreshTokenRequest {
    token: string;
    refreshToken: string;
}

export interface RefreshTokenResponce {
    user: User;
    token: string;
    refreshToken: string;
    expireAt: Date;
}

export enum UserRole {
    MainAdministrator = 'MainAdministrator',
    Administrator = 'Administrator',
    Moderator = 'Moderator',
}
