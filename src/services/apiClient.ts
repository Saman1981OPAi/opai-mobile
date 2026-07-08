export type ApiClientMode = "mock";

export type ApiResult<T> = {
  data: T;
  mode: ApiClientMode;
  source: "local-placeholder";
};

export type ApiError = {
  error: {
    code: string;
    message: string;
    requestId: string;
  };
};

export type ApiClient = {
  mode: ApiClientMode;
  readLocal<T>(data: T): ApiResult<T>;
};

export const apiClient: ApiClient = {
  mode: "mock",
  readLocal<T>(data: T): ApiResult<T> {
    return {
      data,
      mode: "mock",
      source: "local-placeholder"
    };
  }
};
