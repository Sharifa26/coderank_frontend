export interface IUser {
  id: string;
  username: string;
  email: string;
  avatar?: string | null;
  authProvider?: "local" | "google";
  createdAt?: string;
}

export interface IAuthResponse {
  success: boolean;
  message: string;
  data: {
    user: IUser;
    token?: string;
  };
}

export interface ISignupRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IGoogleLoginRequest {
  idToken: string;
}

export interface IForgotPasswordRequest {
  email: string;
}

export interface IResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface IMessageResponse {
  success: boolean;
  message: string;
}

export interface ICodeSnippet {
  _id: string;
  userId: string;
  title: string;
  language: string;
  code: string;
  stdin: string;
  stdout: string;
  stderr: string;
  status: ExecutionStatus;
  isPublic: boolean;
  shareId?: string;
  createdAt: string;
  updatedAt: string;
}

export type ExecutionStatus =
  | "idle"
  | "pending"
  | "compiling"
  | "running"
  | "waiting_for_input"
  | "completed"
  | "error"
  | "timeout";

export interface ICodeHistoryResponse {
  success: boolean;
  message: string;
  data: {
    snippets: ICodeSnippet[];
    total: number;
    page: number;
    totalPages: number;
  };
}

export interface IRunCodeResponse {
  success: boolean;
  message: string;
  data: {
    output: string;
    error: string;
    exitCode: number;
    executionTime: string;
    status: Exclude<
      ExecutionStatus,
      "idle" | "pending" | "compiling" | "running" | "waiting_for_input"
    >;
  };
}

export interface IExecutionStatusPayload {
  executionId: string;
  status: Exclude<ExecutionStatus, "idle" | "pending">;
  message?: string;
}

export interface IExecutionOutputPayload {
  executionId: string;
  stream: "stdout" | "stderr";
  data: string;
}

export interface IExecutionCompletePayload {
  executionId: string;
  stdout: string;
  stderr: string;
  exitCode: number;
  executionTime: number;
  status: "completed" | "error" | "timeout";
}

export interface IOptimizeResponse {
  success: boolean;
  message: string;
  data: {
    optimizedCode: string;
    suggestions: string[];
    improvements: string[];
  };
}
