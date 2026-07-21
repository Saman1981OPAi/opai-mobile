import { protectedStorage } from "@/storage/protected/protectedStorage";
import { NOTEBOOK_SCHEMA_VERSION, type NotebookStore, type ShiftNotebookEntry } from "./notebookTypes";
import { isNotebookStore, validateNotebookEntry } from "./notebookValidation";

const namespace = "shift-notebook";

function options(userId: string) {
  return { namespace, schemaVersion: NOTEBOOK_SCHEMA_VERSION, userId, validate: isNotebookStore };
}

export const notebookRepository = {
  async clear(userId: string) {
    await protectedStorage.remove(options(userId));
  },

  async list(userId: string) {
    return (await protectedStorage.load(options(userId)))?.data.entries ?? [];
  },

  async remove(userId: string, id: string) {
    await this.save(userId, (await this.list(userId)).filter((entry) => entry.id !== id));
  },

  async save(userId: string, entries: ShiftNotebookEntry[]) {
    entries.forEach(validateNotebookEntry);
    const store: NotebookStore = { entries, userId, version: NOTEBOOK_SCHEMA_VERSION };
    await protectedStorage.save(options(userId), store);
  },

  async upsert(userId: string, entry: ShiftNotebookEntry) {
    validateNotebookEntry(entry);
    const entries = await this.list(userId);
    await this.save(userId, [entry, ...entries.filter((item) => item.id !== entry.id)]);
  }
};
