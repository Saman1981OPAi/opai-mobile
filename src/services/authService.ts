import { consentItems, mockUserProfile } from "@/data/authMock";
import { mockApiClient } from "@/services/mockApiClient";

export const authService = {
  getMockProfile() {
    return mockApiClient.get(mockUserProfile).data;
  },
  getRequiredConsents() {
    return mockApiClient.get(consentItems).data;
  },
  signInMock() {
    return mockApiClient.post(mockUserProfile).data;
  },
  signOutMock() {
    return mockApiClient.post({ signedOut: true }).data;
  }
};
