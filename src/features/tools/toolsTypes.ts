import type { ComponentProps } from "react";
import type { MaterialCommunityIcons } from "@expo/vector-icons";

export type ToolId = "notebook" | "timeline" | "descriptions" | "phonetic" | "calculator" | "checklists" | "calendar";

export type ToolDefinition = {
  id: ToolId;
  icon: ComponentProps<typeof MaterialCommunityIcons>["name"];
  label: string;
  summary: string;
};
