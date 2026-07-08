import { apiClient } from "@/services/apiClient";

export const mockApiClient = {
  get<T>(data: T) {
    return apiClient.readLocal(data);
  },
  post<T>(data: T) {
    return apiClient.readLocal(data);
  },
  patch<T>(data: T) {
    return apiClient.readLocal(data);
  },
  delete<T>(data: T) {
    return apiClient.readLocal(data);
  }
};
