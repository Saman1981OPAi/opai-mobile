import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const eas = JSON.parse(readFileSync(new URL("../eas.json", import.meta.url), "utf8"));
const profiles = eas.build ?? {};

function mergeProfile(parent, child) {
  return {
    ...parent,
    ...child,
    env: {
      ...(parent.env ?? {}),
      ...(child.env ?? {}),
    },
    ios: {
      ...(parent.ios ?? {}),
      ...(child.ios ?? {}),
    },
    android: {
      ...(parent.android ?? {}),
      ...(child.android ?? {}),
    },
  };
}

function resolveProfile(name, path = []) {
  assert.ok(profiles[name], `Missing EAS build profile: ${name}`);
  assert.ok(!path.includes(name), `Circular EAS profile inheritance: ${[...path, name].join(" -> ")}`);

  const profile = profiles[name];
  if (!profile.extends) {
    return profile;
  }

  return mergeProfile(resolveProfile(profile.extends, [...path, name]), profile);
}

for (const profileName of ["development", "pr43-certification", "production", "testflight"]) {
  const profile = resolveProfile(profileName);
  assert.equal(profile.node, "22.23.1", `${profileName} must use Node 22.23.1`);
  assert.equal(profile.pnpm, "11.9.0", `${profileName} must use pnpm 11.9.0`);
  assert.equal(profile.corepack, true, `${profileName} must enable Corepack`);
}

assert.equal(profiles.testflight.extends, "production", "TestFlight must inherit production");
assert.equal(profiles.testflight.env, undefined, "TestFlight must not override production environment values");

for (const profileName of ["production", "testflight"]) {
  const profile = resolveProfile(profileName);
  const appEnv = profile.env?.EXPO_PUBLIC_APP_ENV;
  const apiUrl = profile.env?.EXPO_PUBLIC_OPAI_API_BASE_URL;

  assert.equal(appEnv, "production", `${profileName} APP_ENV must be production`);
  assert.equal(apiUrl, "https://api.opaiapp.com", `${profileName} must use the production API`);
  assert.ok(!/onrender\.com/i.test(apiUrl), `${profileName} must not use Render`);
  assert.ok(!/localhost|127\.0\.0\.1|\[::1\]/i.test(apiUrl), `${profileName} must not use a local API`);
}

assert.equal(profiles["internal-staging"], undefined, "Legacy staging profile must remain unavailable");

const certificationProfileName = "pr43-certification";
const certificationSource = profiles[certificationProfileName];
const certification = resolveProfile(certificationProfileName);
const certificationUrl = "https://opai-backend-staging.onrender.com";

assert.equal(certificationSource.extends, "base", "Certification must inherit only the audited base profile");
assert.equal(certification.developmentClient, true, "Certification must use a development client");
assert.equal(certification.distribution, "internal", "Certification must not be publicly distributed");
assert.equal(certification.android?.buildType, "apk", "Android certification output must be an APK");
assert.equal(certification.env?.EXPO_PUBLIC_APP_ENV, "staging", "Certification must identify itself as staging");
assert.equal(
  certification.env?.EXPO_PUBLIC_OPAI_API_BASE_URL,
  certificationUrl,
  "Certification must use the approved Render staging endpoint",
);
assert.equal(certification.autoIncrement, undefined, "Certification must not increment the production build baseline");
assert.equal(certificationSource.autoSubmit, undefined, "Certification must not auto-submit");

const serializedProfiles = JSON.stringify(profiles);
assert.equal(
  serializedProfiles.split(certificationUrl).length - 1,
  1,
  "Render must appear in exactly one EAS build profile",
);

const submitProfiles = JSON.stringify(eas.submit ?? {});
assert.ok(!/onrender\.com/i.test(submitProfiles), "Render must never appear in submit profiles");

console.log("Release profiles verified.");
