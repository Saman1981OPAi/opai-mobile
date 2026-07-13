import { secureSession } from "@/services/api/secureSession";

export async function getAuthHeaders() {
  const token = await secureSession.getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
