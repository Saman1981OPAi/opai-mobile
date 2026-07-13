import { apiClient } from "@/services/api/apiClient";
import { secureSession } from "@/services/api/secureSession";
import type { OfficerProfileResponse, TokenResponse } from "@/services/api/apiTypes";

async function saveAndLoadProfile(tokens: TokenResponse) {
  await secureSession.save(tokens);
  return apiClient.get<OfficerProfileResponse>("/auth/me");
}

export const authApi = {
  async signIn(email: string, password: string) {
    const tokens = await apiClient.post<TokenResponse>("/auth/login", { email, password }, { authenticated: false });
    return saveAndLoadProfile(tokens);
  },
  async register(email: string, password: string, displayName: string) {
    const tokens = await apiClient.post<TokenResponse>("/auth/register", {
      email,
      password,
      display_name: displayName
    }, { authenticated: false });
    return saveAndLoadProfile(tokens);
  },
  async restore() {
    if (!(await secureSession.getRefreshToken())) return null;
    try {
      return await apiClient.get<OfficerProfileResponse>("/auth/me");
    } catch {
      await secureSession.clear();
      return null;
    }
  },
  async forgotPassword(email: string) {
    return apiClient.post<{ message: string }>("/auth/password/forgot", { email }, { authenticated: false });
  },
  async signOut() {
    const refreshToken = await secureSession.getRefreshToken();
    try {
      if (refreshToken) await apiClient.post("/auth/logout", { refresh_token: refreshToken }, { authenticated: false });
    } finally {
      await secureSession.clear();
    }
  }
};
