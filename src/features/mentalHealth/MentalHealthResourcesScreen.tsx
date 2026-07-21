import { StyleSheet, View } from "react-native";
import { AppText as Text } from "@/components/ui/Typography";
import { DisclaimerBanner } from "@/components/ui/DisclaimerBanner";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CrisisSupportNotice } from "@/features/mentalHealth/CrisisSupportNotice";
import { MentalHealthResourceCard } from "@/features/mentalHealth/MentalHealthResourceCard";
import {
  mentalHealthDirectoryDisclaimer,
  mentalHealthResources,
  mentalHealthResourceSections
} from "@/features/mentalHealth/mentalHealthResources";
import { mentalHealthNextReviewDate, mentalHealthVerificationDate } from "@/features/mentalHealth/mentalHealthSourceRegister";
import { colors, spacing } from "@/theme/tokens";

export function MentalHealthResourcesScreen() {
  return (
    <View style={styles.screen}>
      <CrisisSupportNotice />
      <DisclaimerBanner message={mentalHealthDirectoryDisclaimer} />

      {mentalHealthResourceSections.map((section) => {
        const resources = mentalHealthResources.filter((resource) => resource.section === section.id);
        if (resources.length === 0) return null;
        return (
          <View key={section.id} style={styles.section}>
            <SectionHeader icon="heart-circle-outline" title={section.title} />
            <View style={styles.list}>
              {resources.map((resource) => <MentalHealthResourceCard key={resource.id} resource={resource} />)}
            </View>
          </View>
        );
      })}

      <Text style={styles.verification}>
        Sources verified {mentalHealthVerificationDate}. Scheduled review {mentalHealthNextReviewDate} and before every public release.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.base },
  screen: { gap: spacing.lg },
  section: { gap: spacing.sm },
  verification: { color: colors.textMuted, fontSize: 12, lineHeight: 18, textAlign: "center" }
});
