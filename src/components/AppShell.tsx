import { ScrollView, StyleSheet, Text, View } from "react-native";
import { ActiveAiPanel } from "@/components/ActiveAiPanel";
import { BottomNav } from "@/components/BottomNav";
import { ModuleScreen } from "@/screens/ModuleScreen";
import { modules } from "@/data/modules";
import { colors, spacing, typography } from "@/theme/tokens";
import type { AppModule, ModuleId } from "@/types/navigation";

type AppShellProps = {
  activeModule: AppModule;
  onSelectModule: (module: ModuleId) => void;
};

export function AppShell({ activeModule, onSelectModule }: AppShellProps) {
  return (
    <View style={styles.shell}>
      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>OPA<Text style={styles.logoBlue}>i</Text></Text>
          <Text style={styles.subtitle}>Operational Police Ai</Text>
        </View>
        <View style={styles.flagBadge} accessibilityLabel="Canadian police officer focus">
          <View style={styles.flagRed} />
          <View style={styles.flagWhite}>
            <Text style={styles.maple}>CA</Text>
          </View>
          <View style={styles.flagRed} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ActiveAiPanel activeModule={activeModule} />
        <ModuleScreen module={activeModule} onSelectModule={onSelectModule} />
      </ScrollView>

      <BottomNav activeModule={activeModule.id} modules={modules.filter((module) => module.priority === "primary")} onSelectModule={onSelectModule} />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
    padding: spacing.md,
    paddingBottom: 120
  },
  flagBadge: {
    width: 54,
    height: 34,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    flexDirection: "row",
    overflow: "hidden"
  },
  flagRed: {
    flex: 1,
    backgroundColor: colors.canadianRed
  },
  flagWhite: {
    flex: 1.7,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.textPrimary
  },
  header: {
    alignItems: "center",
    borderBottomColor: "rgba(10,132,255,0.2)",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md
  },
  logo: {
    color: colors.textPrimary,
    fontSize: typography.title,
    fontWeight: "900",
    letterSpacing: 0
  },
  logoBlue: {
    color: colors.primaryBlue
  },
  maple: {
    color: colors.canadianRed,
    fontSize: 16,
    fontWeight: "900"
  },
  shell: {
    backgroundColor: colors.background,
    flex: 1
  },
  subtitle: {
    color: colors.accentBlue,
    fontSize: typography.caption,
    fontWeight: "700",
    letterSpacing: 1.4,
    marginTop: 2,
    textTransform: "uppercase"
  }
});
