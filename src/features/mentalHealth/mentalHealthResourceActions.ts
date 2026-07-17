import { Alert, Linking } from "react-native";

type ResourceAction = "call" | "text" | "website";

const actionLabels: Record<ResourceAction, string> = {
  call: "Phone",
  text: "Messages",
  website: "Browser"
};

async function openConfirmedUri(action: ResourceAction, label: string, uri: string) {
  const supported = await Linking.canOpenURL(uri);
  if (!supported) {
    Alert.alert(`Unable to Open ${actionLabels[action]}`, "This action is not available on this device.");
    return;
  }

  await Linking.openURL(uri);
}

export function confirmMentalHealthAction(action: ResourceAction, label: string, target: string) {
  const uri = action === "call" ? `tel:${target}` : action === "text" ? `sms:${target}` : target;
  const verb = action === "call" ? "Call" : action === "text" ? "Text" : "Open Website";

  Alert.alert(
    `${verb} ${label}?`,
    `This will open ${actionLabels[action]}. OPAi does not place calls, send messages, or record this action.`,
    [
      { style: "cancel", text: "Cancel" },
      { text: verb, onPress: () => void openConfirmedUri(action, label, uri) }
    ]
  );
}

export function confirm988Choice() {
  Alert.alert(
    "Contact 9-8-8?",
    "Choose how to contact the Canada-wide Suicide Crisis Helpline. OPAi will open the selected device app and will not record your choice.",
    [
      { style: "cancel", text: "Cancel" },
      { text: "Call", onPress: () => void openConfirmedUri("call", "9-8-8", "tel:988") },
      { text: "Text", onPress: () => void openConfirmedUri("text", "9-8-8", "sms:988") }
    ]
  );
}
