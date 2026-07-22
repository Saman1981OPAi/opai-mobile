import { checklistRepository } from "@/features/checklists/checklistRepository";
import { assistantRepository } from "@/features/assistant/assistantRepository";
import { descriptionRepository } from "@/features/descriptions/descriptionRepository";
import { notebookRepository } from "@/features/notebook/notebookRepository";
import { protectedReportRepository } from "@/features/reports/protectedReportRepository";
import { timelineRepository } from "@/features/timeline/timelineRepository";
import { attachmentVault } from "@/storage/attachments/attachmentVault";
import { protectedKeyService } from "./protectedKeyService";

export const protectedUserDataService = {
  async clearAll(userId: string) {
    await Promise.all([
      attachmentVault.clearUser(userId),
      assistantRepository.clearUserData(userId),
      checklistRepository.clear(userId),
      descriptionRepository.clear(userId),
      notebookRepository.clear(userId),
      protectedReportRepository.clear(userId),
      timelineRepository.clear(userId)
    ]);
    await protectedKeyService.deleteKey(userId);
  }
};
