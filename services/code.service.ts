import api from "./api";
import {
  ICodeHistoryResponse,
  ICodeSnippet,
  IMessageResponse,
  IOptimizeResponse,
} from "@/types";

interface RunCodePayload {
  language: string;
  code: string;
  stdin: string;
}

interface SaveCodePayload extends RunCodePayload {
  title: string;
  stdout?: string;
  stderr?: string;
  status?: string;
}

interface OptimizeCodePayload {
  language: string;
  code: string;
}

interface ShareCodeResponse {
  data: {
    shareId?: string;
    shareUrl?: string;
    snippet?: ICodeSnippet;
  };
}

interface SharedCodeResponse {
  data: {
    snippet: ICodeSnippet;
  };
}

export const saveCode = (data: SaveCodePayload) =>
  api.post<{ data: { snippet: ICodeSnippet } }>("/code/save", data);
export const getHistory = () => api.get<ICodeHistoryResponse>("/history");
export const getCodeById = (id: string) =>
  api.get<{ data: { snippet: ICodeSnippet } }>(`/code/${id}`);
export const deleteCode = (id: string) =>
  api.delete<IMessageResponse>(`/code/delete/${id}`);
export const shareCode = (codeId: string) =>
  api.post<ShareCodeResponse>("/code/share", { codeId });
export const getSharedCode = (shareId: string) =>
  api.get<SharedCodeResponse>(`/code/shared/${shareId}`);
export const optimizeCode = (data: OptimizeCodePayload) =>
  api.post<IOptimizeResponse>("/code/optimize", data);
