import { Alert, Linking } from "react-native";

export const externalLinks = {
  appleWeatherDataSources: "https://developer.apple.com/weatherkit/data-source-attribution/",
  contact: "https://opaiapp.com/contact",
  facebook: "https://www.facebook.com/profile.php?id=61591569999710",
  instagram: "https://www.instagram.com/opaiapp/",
  privacy: "https://opaiapp.com/privacy",
  support: "https://opaiapp.com/support",
  terms: "https://opaiapp.com/terms",
  website: "https://opaiapp.com",
  whatsappChannel: "https://whatsapp.com/channel/0029Vb8HFSMEQIaoXOL6YO1a"
} as const;

export async function openExternalUrl(url: string) {
  if (!url.startsWith("https://")) {
    Alert.alert("Link Blocked", "Only secure HTTPS links can be opened from OPAi Police.");
    return;
  }

  const supported = await Linking.canOpenURL(url);
  if (!supported) {
    Alert.alert("Unable to Open Link", url);
    return;
  }

  await Linking.openURL(url);
}
