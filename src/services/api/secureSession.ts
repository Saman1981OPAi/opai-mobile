import * as SecureStore from "expo-secure-store";
import type { TokenResponse } from "@/services/api/apiTypes";

const ACCESS_TOKEN_KEY = "opai.auth.accessToken";
const REFRESH_TOKEN_KEY = "opai.auth.refreshToken";

export const secureSession = {
  async getAccessToken() {
    return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  },
  async getRefreshToken() {
    return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  },
  async save(tokens: TokenResponse) {
    await Promise.all([
      SecureStore.setItemAsync(ACCESS_TOKEN_KEY, tokens.access_token),
      SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokens.refresh_token)
    ]);
  },
  async clear() {
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY)
    ]);
  }
};
