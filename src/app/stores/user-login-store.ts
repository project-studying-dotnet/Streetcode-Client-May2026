import { makeAutoObservable } from "mobx";
import UserApi from "@api/user/user.api";

import { RefreshTokenResponce, UserLoginResponce } from "@/models/user/user.model";

export default class UserLoginStore {
  private timeoutHandler: ReturnType<typeof setTimeout> | null = null;

  private static readonly tokenStorageName = "token";

  private static readonly dateStorageName = "expireAt";

  private static readonly refreshTokenStorageName = "refreshToken";

  private static readonly userIdStorageName = "userId";

  public userLoginResponce?: UserLoginResponce;

  private callback?: () => void;

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

  public static setToken(newToken: string) {
    return localStorage.setItem(UserLoginStore.tokenStorageName, newToken);
  }

  private static clearToken() {
    localStorage.removeItem(UserLoginStore.tokenStorageName);
  }

  private static getRefreshToken() {
    return localStorage.getItem(UserLoginStore.refreshTokenStorageName);
  }

  private static setRefreshToken(refreshToken: string) {
    localStorage.setItem(UserLoginStore.refreshTokenStorageName, refreshToken);
  }

  private static clearRefreshToken() {
    localStorage.removeItem(UserLoginStore.refreshTokenStorageName);
  }

  public setCallback(func: () => void) {
    this.callback = func;
  }

  public static get isLoggedIn(): boolean {
    return UserLoginStore.getExpiredDate() > new Date(Date.now()).getTime();
  }

  public static clearUserData() {
    localStorage.removeItem(UserLoginStore.tokenStorageName);
    localStorage.removeItem(UserLoginStore.refreshTokenStorageName);
    localStorage.removeItem(UserLoginStore.dateStorageName);
    localStorage.removeItem(UserLoginStore.userIdStorageName);
  }

  public logout() {
    if (this.timeoutHandler) {
      clearTimeout(this.timeoutHandler);
    }

    UserLoginStore.clearUserData();
  }

  public get userId(): number | undefined {
    if (this.userLoginResponce?.user.id !== undefined) {
      return this.userLoginResponce.user.id;
    }
    const stored = localStorage.getItem(UserLoginStore.userIdStorageName);
    return stored ? Number(stored) : undefined;
  }

  public setUserLoginResponce(user: UserLoginResponce, func: () => void) {
    try {
      const timeNumber = new Date(user.expireAt).getTime();
      UserLoginStore.setExpiredDate(timeNumber.toString());
      const expireForSeconds = timeNumber - Date.now();
      this.setCallback(func);
      this.userLoginResponce = user;
      UserLoginStore.setToken(user.token);
      UserLoginStore.setRefreshToken(user.refreshToken);
      localStorage.setItem(UserLoginStore.userIdStorageName, String(user.user.id));
      if (expireForSeconds > 10000) {
        this.timeoutHandler = setTimeout(() => {
          if (this.callback) {
            this.callback();
          }
        }, expireForSeconds - 10000);
      }
    } catch (e) {
      console.log(e);
    }
  }

  public refreshToken = (): Promise<RefreshTokenResponce> => UserApi.refreshToken({
      token: UserLoginStore.getToken() ?? "",
      refreshToken: UserLoginStore.getRefreshToken() ?? "",
    }).then((refreshToken) => {
      const expireForSeconds = new Date(refreshToken.expireAt).getTime() - Date.now();
      this.timeoutHandler = setTimeout(() => {
        if (this.callback) {
          this.callback();
        }
      }, expireForSeconds);
      UserLoginStore.setExpiredDate(new Date(refreshToken.expireAt).getTime().toString());
      UserLoginStore.setToken(refreshToken.token);
      UserLoginStore.setRefreshToken(refreshToken.refreshToken);
      return refreshToken;
    });
}
