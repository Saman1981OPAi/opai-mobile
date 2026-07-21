import { protectedStorage } from "@/storage/protected/protectedStorage";
import { isRecord } from "@/storage/protected/protectedStorageValidation";
import type { DescriptionStore, SavedDescription } from "./descriptionTypes";

function isDescription(value: unknown): value is SavedDescription {
  return isRecord(value) && typeof value.id === "string" && (value.kind === "person" || value.kind === "vehicle") && typeof value.text === "string" && typeof value.title === "string" && typeof value.createdAt === "string" && typeof value.updatedAt === "string";
}
function isStore(value: unknown): value is DescriptionStore {
  return isRecord(value) && value.version === 1 && typeof value.userId === "string" && Array.isArray(value.descriptions) && value.descriptions.every(isDescription);
}
function options(userId: string) { return { namespace: "saved-descriptions", schemaVersion: 1, userId, validate: isStore }; }

export const descriptionRepository = {
  async clear(userId: string) { await protectedStorage.remove(options(userId)); },
  async list(userId: string) { return (await protectedStorage.load(options(userId)))?.data.descriptions ?? []; },
  async save(userId: string, descriptions: SavedDescription[]) { await protectedStorage.save(options(userId), { descriptions, userId, version: 1 }); },
  async upsert(userId: string, description: SavedDescription) {
    if (!isDescription(description)) throw new Error("Description is invalid.");
    const descriptions = await this.list(userId);
    await this.save(userId, [description, ...descriptions.filter((item) => item.id !== description.id)]);
  }
};

