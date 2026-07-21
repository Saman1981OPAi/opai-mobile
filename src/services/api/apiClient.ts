import { apiConfig } from "@/services/api/apiConfig";
import { secureSession } from "@/services/api/secureSession";
import type { TokenResponse } from "@/services/api/apiTypes";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code: string,
    readonly requestId?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type RequestOptions = RequestInit & {
  authenticated?: boolean;
  timeoutMs?: number;
};

type SessionExpiredHandler = () => void | Promise<void>;

let refreshPromise: Promise<string | null> | null = null;
let sessionExpiredHandler: SessionExpiredHandler | null = null;
let sessionExpiryInProgress = false;
const authenticatedControllers = new Set<AbortController>();
const REFRESH_TIMEOUT_MS = 8_000;

function safeMessage(status: number) {
  if (status === 401) return "Your session has expired. Please sign in again.";
  if (status === 403) return "This action is not available for this account.";
  if (status === 413) return "The selected file is too large.";
  if (status === 422) return "Check the information and try again.";
  if (status === 429) return "The daily or short-term AI limit has been reached. Try again later.";
  if (status >= 500) return "The OPAi service is temporarily unavailable.";
  return "The request could not be completed.";
}

async function parseError(response: Response) {
  let code = `HTTP_${response.status}`;
  let message = safeMessage(response.status);
  try {
    const body = (await response.json()) as { detail?: unknown; error?: { code?: string; message?: string } };
    if (body.error?.code) code = body.error.code;
    if (body.error?.message) message = body.error.message;
    if (typeof body.detail === "string" && response.status < 500) message = body.detail;
  } catch {
    // Keep the privacy-safe status message when the body is not JSON.
  }
  return new ApiError(message, response.status, code, response.headers.get("x-request-id") ?? undefined);
}

async function expireSession() {
  if (sessionExpiryInProgress) return;
  sessionExpiryInProgress = true;
  try {
    authenticatedControllers.forEach((controller) => controller.abort());
    authenticatedControllers.clear();
    await secureSession.clear();
    await sessionExpiredHandler?.();
  } finally {
    sessionExpiryInProgress = false;
  }
}

async function refreshAccessToken() {
  const refreshToken = await secureSession.getRefreshToken();
  if (!refreshToken) {
    await expireSession();
    return null;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REFRESH_TIMEOUT_MS);
  try {
    const response = await fetch(`${apiConfig.baseUrl}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
      signal: controller.signal
    });
    if (!response.ok) {
      if ([400, 401, 403].includes(response.status)) {
        await expireSession();
        return null;
      }
      throw await parseError(response);
    }
    const tokens = (await response.json()) as TokenResponse;
    await secureSession.save(tokens);
    return tokens.access_token;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof Error && error.name === "AbortError") {
      throw new ApiError("Session refresh timed out. Try again.", 408, "REFRESH_TIMEOUT");
    }
    throw new ApiError("Unable to refresh the session. Check your connection.", 0, "NETWORK_ERROR");
  } finally {
    clearTimeout(timeout);
  }
}

async function request<T>(path: string, options: RequestOptions = {}, retried = false): Promise<T> {
  const controller = new AbortController();
  let timedOut = false;
  let cancelledByCaller = false;
  const timeout = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, options.timeoutMs ?? apiConfig.timeoutMs);
  const headers = new Headers(options.headers);
  const authenticated = options.authenticated !== false;
  const externalSignal = options.signal;
  const cancelFromCaller = () => {
    cancelledByCaller = true;
    controller.abort();
  };
  if (externalSignal?.aborted) {
    cancelFromCaller();
  } else {
    externalSignal?.addEventListener("abort", cancelFromCaller, { once: true });
  }

  try {
    if (authenticated) {
      authenticatedControllers.add(controller);
      const accessToken = await secureSession.getAccessToken();
      if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
    }
    if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    const response = await fetch(`${apiConfig.baseUrl}${path}`, {
      ...options,
      headers,
      signal: controller.signal
    });

    if (response.status === 401 && authenticated && !retried) {
      refreshPromise ??= refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
      const refreshed = await refreshPromise;
      if (refreshed) return request<T>(path, options, true);
      throw new ApiError("Your session has expired. Please sign in again.", 401, "SESSION_EXPIRED");
    }
    if (response.status === 401 && authenticated && retried) {
      await expireSession();
      throw new ApiError("Your session has expired. Please sign in again.", 401, "SESSION_EXPIRED");
    }

    if (!response.ok) throw await parseError(response);
    if (response.status === 204) return undefined as T;
    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof Error && error.name === "AbortError") {
      if (cancelledByCaller || (!timedOut && authenticated)) {
        throw new ApiError("Request cancelled.", 0, "REQUEST_CANCELLED");
      }
      throw new ApiError("The request timed out. Check your connection and try again.", 408, "TIMEOUT");
    }
    throw new ApiError("Unable to reach the OPAi service. Your local data remains available.", 0, "NETWORK_ERROR");
  } finally {
    clearTimeout(timeout);
    externalSignal?.removeEventListener("abort", cancelFromCaller);
    authenticatedControllers.delete(controller);
  }
}

export const apiClient = {
  get<T>(path: string, options?: RequestOptions) {
    return request<T>(path, { ...options, method: "GET" });
  },
  post<T>(path: string, body?: unknown, options?: RequestOptions) {
    return request<T>(path, { ...options, method: "POST", body: body instanceof FormData ? body : JSON.stringify(body ?? {}) });
  },
  delete<T>(path: string, options?: RequestOptions) {
    return request<T>(path, { ...options, method: "DELETE" });
  },
  cancelAuthenticatedRequests() {
    authenticatedControllers.forEach((controller) => controller.abort());
    authenticatedControllers.clear();
  },
  setSessionExpiredHandler(handler: SessionExpiredHandler | null) {
    sessionExpiredHandler = handler;
  }
};
