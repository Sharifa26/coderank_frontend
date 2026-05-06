import api from "./api";
import {
  IForgotPasswordRequest,
  IAuthResponse,
  IGoogleLoginRequest,
  ILoginRequest,
  IMessageResponse,
  IResetPasswordRequest,
  ISignupRequest,
} from "@/types";

export const signup = (data: ISignupRequest) =>
  api.post<IAuthResponse>("/auth/signup", data);
export const login = (data: ILoginRequest) =>
  api.post<IAuthResponse>("/auth/login", data);
export const googleLogin = (data: IGoogleLoginRequest) =>
  api.post<IAuthResponse>("/auth/google", data);
export const fetchUser = () => api.get<IAuthResponse>("/auth/me");
export const forgotPassword = (data: IForgotPasswordRequest) =>
  api.post<IMessageResponse>("/auth/forgot-password", data);
export const resetPassword = (data: IResetPasswordRequest) =>
  api.post<IMessageResponse>("/auth/reset-password", data);
