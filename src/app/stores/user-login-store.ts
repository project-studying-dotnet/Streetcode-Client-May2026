import { makeAutoObservable } from 'mobx';
import UserApi from '@api/user/user.api';

import {
    RefreshTokenResponce,
    UserLoginRequest,
    UserLoginResponce,
    UserRole,
} from '@/models/user/user.model';
import User from '@/models/user/user.model';

export default class UserLoginStore {
    private timeoutHandler: NodeJS.Timeout = null;

    private static tokenStorageName = 'token';

    private static refreshTokenStorageName = 'refreshToken';

    private static dateStorageName = 'expireAt';

    private static userStorageName = 'user';

    public userLoginResponce?: UserLoginResponce;

    private callback?: () => void;

    public isAuthChecking = false;

    public constructor() {
        makeAutoObservable(this);
    }

    private static getExpiredDate(): number {
        return Number(localStorage.getItem(UserLoginStore.dateStorageName)!);
    }

    private static setExpiredDate(date: string): void {
        localStorage.setItem(UserLoginStore.dateStorageName, date);
    }

    public static getToken() {
        return localStorage.getItem(UserLoginStore.tokenStorageName);
    }

    public static getRefreshToken() {
        return localStorage.getItem(UserLoginStore.refreshTokenStorageName);
    }

    public static getUser(): User | null {
        const storedUser = localStorage.getItem(UserLoginStore.userStorageName);
        return storedUser ? JSON.parse(storedUser) as User : null;
    }

    public static setToken(newToken: string) {
        return localStorage.setItem(UserLoginStore.tokenStorageName, newToken);
    }

    private static setRefreshToken(newToken: string) {
        return localStorage.setItem(UserLoginStore.refreshTokenStorageName, newToken);
    }

    private static setUser(user: User) {
        return localStorage.setItem(UserLoginStore.userStorageName, JSON.stringify(user));
    }

    public setCallback(func: () => void) {
        this.callback = func;
    }

    public static get isLoggedIn(): boolean {
        const expireAt = UserLoginStore.getExpiredDate();
        return Boolean(expireAt) && expireAt > Date.now();
    }

    public get currentUser(): User | undefined {
        return this.userLoginResponce?.user ?? UserLoginStore.getUser() ?? undefined;
    }

    public hasRole(...roles: UserRole[]): boolean {
        const userRole = this.currentUser?.role;
        return Boolean(userRole) && roles.includes(userRole!);
    }

    public clearUserData() {
        if (this.timeoutHandler) {
            clearTimeout(this.timeoutHandler);
        }
        localStorage.removeItem(UserLoginStore.tokenStorageName);
        localStorage.removeItem(UserLoginStore.refreshTokenStorageName);
        localStorage.removeItem(UserLoginStore.dateStorageName);
        localStorage.removeItem(UserLoginStore.userStorageName);
        this.userLoginResponce = undefined;
    }

    public logout = async (): Promise<void> => {
        if (UserLoginStore.isLoggedIn) {
            try {
                await UserApi.logout();
            } catch {
                // Clear local session even if server logout fails.
            }
        }
        this.clearUserData();
    };

    private scheduleTokenRefresh(expireAt: Date) {
        if (this.timeoutHandler) {
            clearTimeout(this.timeoutHandler);
        }

        const expireForSeconds = new Date(expireAt).getTime() - Date.now();
        if (expireForSeconds > 10000) {
            this.timeoutHandler = setTimeout(() => {
                this.callback?.();
            }, expireForSeconds - 10000);
        }
    }

    private persistAuthResponse(response: UserLoginResponce | RefreshTokenResponce) {
        const expireAtTime = new Date(response.expireAt).getTime().toString();
        UserLoginStore.setExpiredDate(expireAtTime);
        UserLoginStore.setToken(response.token);
        UserLoginStore.setRefreshToken(response.refreshToken);
        UserLoginStore.setUser(response.user);
        this.userLoginResponce = response;
        this.scheduleTokenRefresh(response.expireAt);
    }

    public login = async (credentials: UserLoginRequest): Promise<UserLoginResponce> => {
        const response = await UserApi.login(credentials);
        this.persistAuthResponse(response);
        return response;
    };

    public setUserLoginResponce(user: UserLoginResponce, func: () => void) {
        try {
            this.setCallback(func);
            this.persistAuthResponse(user);
        } catch (e) {
            console.log(e);
        }
    }

    public refreshToken = (): Promise<RefreshTokenResponce> => (
        UserApi.refreshToken({
            token: UserLoginStore.getToken() ?? '',
            refreshToken: UserLoginStore.getRefreshToken() ?? '',
        })
            .then((refreshTokenResponse) => {
                this.persistAuthResponse(refreshTokenResponse);
                return refreshTokenResponse;
            })
    );

    public restoreSession = async (): Promise<boolean> => {
        if (UserLoginStore.isLoggedIn) {
            return true;
        }

        const token = UserLoginStore.getToken();
        const refreshToken = UserLoginStore.getRefreshToken();

        if (!token || !refreshToken) {
            return false;
        }

        this.isAuthChecking = true;

        try {
            await this.refreshToken();
            return true;
        } catch {
            this.clearUserData();
            return false;
        } finally {
            this.isAuthChecking = false;
        }
    };
}
