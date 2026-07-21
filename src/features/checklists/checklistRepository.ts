import { protectedStorage } from "@/storage/protected/protectedStorage";
import { CHECKLIST_STORE_VERSION, type ChecklistInstance, type ChecklistStore } from "./checklistTypes";
import { isChecklistStore } from "./checklistValidation";

function options(userId: string) { return { namespace: "checklist-instances", schemaVersion: CHECKLIST_STORE_VERSION, userId, validate: isChecklistStore }; }

export const checklistRepository = {
  async clear(userId: string) { await protectedStorage.remove(options(userId)); },
  async list(userId: string) { return (await protectedStorage.load(options(userId)))?.data.instances ?? []; },
  async save(userId: string, instances: ChecklistInstance[]) {
    const store: ChecklistStore = { instances, userId, version: CHECKLIST_STORE_VERSION };
    if (!isChecklistStore(store)) throw new Error("Checklist progress is invalid.");
    await protectedStorage.save(options(userId), store);
  },
  async upsert(userId: string, instance: ChecklistInstance) {
    const instances = await this.list(userId);
    await this.save(userId, [instance, ...instances.filter((item) => item.id !== instance.id)]);
  }
};

