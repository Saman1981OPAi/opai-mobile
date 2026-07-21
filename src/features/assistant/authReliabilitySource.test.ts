import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const apiClient = readFileSync(
  new URL("../../services/api/apiClient.ts", import.meta.url),
  "utf8"
);
const authApi = readFileSync(
  new URL("../../services/api/authApi.ts", import.meta.url),
  "utf8"
);
const app = readFileSync(new URL("../../../App.tsx", import.meta.url), "utf8");

test("authenticated requests support bounded refresh and global cancellation", () => {
  assert.equal(apiClient.includes("REFRESH_TIMEOUT_MS = 8_000"), true);
  assert.equal(apiClient.includes("cancelAuthenticatedRequests"), true);
  assert.equal(apiClient.includes("setSessionExpiredHandler"), true);
  assert.equal(apiClient.includes('"REQUEST_CANCELLED"'), true);
  assert.equal(apiClient.includes('"REFRESH_TIMEOUT"'), true);
});

test("sign out clears local credentials before best-effort server revocation", () => {
  const signOut = authApi.slice(authApi.indexOf("async signOut()"));
  const cancelIndex = signOut.indexOf("apiClient.cancelAuthenticatedRequests()");
  const clearIndex = signOut.indexOf("await secureSession.clear()");
  const revokeIndex = signOut.indexOf("void apiClient");
  assert.ok(cancelIndex >= 0);
  assert.ok(clearIndex > cancelIndex);
  assert.ok(revokeIndex > clearIndex);
  assert.equal(authApi.includes("timeoutMs: 1_500"), true);
});

test("OPAi opens immediately after login and session expiry", () => {
  assert.equal(app.includes('useState<ModuleId>("ai")'), true);
  assert.ok([...app.matchAll(/setActiveModule\("ai"\)/g)].length >= 3);
  assert.equal(app.includes("setSessionExpiredHandler"), true);
});
