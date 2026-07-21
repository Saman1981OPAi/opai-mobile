export type DescriptionCertainty = "confirmed" | "possible" | "unknown";

export type PersonDescriptionInput = {
  age?: string;
  build?: string;
  clothing?: string;
  direction?: string;
  distinguishingFeatures?: string;
  hair?: string;
  height?: string;
  lastSeenAt?: string;
  presentation?: string;
};

export type VehicleDescriptionInput = {
  bodyStyle?: string;
  colour?: string;
  damage?: string;
  direction?: string;
  jurisdiction?: string;
  lastSeenAt?: string;
  lastSeenLocation?: string;
  makeModel?: string;
  makeModelCertainty: DescriptionCertainty;
  markings?: string;
  plate?: string;
};

export type SavedDescription = {
  createdAt: string;
  id: string;
  kind: "person" | "vehicle";
  text: string;
  title: string;
  updatedAt: string;
};

export type DescriptionStore = { descriptions: SavedDescription[]; userId: string; version: 1 };

