import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { AppHeader } from "@/components/ui/AppHeader";
import { DisclaimerBanner } from "@/components/ui/DisclaimerBanner";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  getGuideById,
  getUnsupportedModelResponse
} from "@/features/deviceTesting/deviceTestingAssistantService";
import { deviceTestingCategories } from "@/features/deviceTesting/deviceTestingGuides";
import { DeviceModelSelector } from "@/features/deviceTesting/DeviceModelSelector";
import { DeviceSafetyNotice } from "@/features/deviceTesting/DeviceSafetyNotice";
import { DeviceTestAssistantScreen } from "@/features/deviceTesting/DeviceTestAssistantScreen";
import { QualifiedTechnicianGate } from "@/features/deviceTesting/QualifiedTechnicianGate";
import { UnsupportedDeviceNotice } from "@/features/deviceTesting/UnsupportedDeviceNotice";
import { UseOfForceReference } from "@/features/deviceTesting/UseOfForceReference";
import type { DeviceModelOption, DeviceTestCategory, DeviceTestGuide } from "@/features/deviceTesting/deviceTestingTypes";
import { colors, radius, spacing, typography } from "@/theme/tokens";

type DeviceTestingMode = "categories" | "models" | "assistant" | "unsupported" | "qualifiedGate" | "useOfForce";

type UnsupportedState = {
  manufacturer: string;
  model: string;
  refusal: string;
  warning: string;
};

export function DeviceTestingScreen({ isTablet }: { isTablet: boolean }) {
  const [mode, setMode] = useState<DeviceTestingMode>("categories");
  const [selectedCategory, setSelectedCategory] = useState<DeviceTestCategory>("lidar");
  const [selectedGuide, setSelectedGuide] = useState<DeviceTestGuide | null>(null);
  const [unsupported, setUnsupported] = useState<UnsupportedState | null>(null);
  const [qualifiedTechnicianConfirmed, setQualifiedTechnicianConfirmed] = useState(false);

  const selectCategory = (category: DeviceTestCategory) => {
    setSelectedCategory(category);
    setUnsupported(null);
    setSelectedGuide(null);
    if (category === "useOfForce") {
      setMode("useOfForce");
      return;
    }
    setMode("models");
  };

  const selectModel = (option: DeviceModelOption) => {
    if (!option.supported || !option.guideId) {
      setUnsupported(getUnsupportedModelResponse(option.category, option.manufacturer, option.model));
      setMode("unsupported");
      return;
    }

    const guide = getGuideById(option.guideId);
    if (!guide) {
      setUnsupported(getUnsupportedModelResponse(option.category, option.manufacturer, option.model));
      setMode("unsupported");
      return;
    }

    setSelectedGuide(guide);
    if (guide.requiresQualifiedTechnician && !qualifiedTechnicianConfirmed) {
      setMode("qualifiedGate");
      return;
    }
    setMode("assistant");
  };

  const returnToCategories = () => {
    setMode("categories");
    setSelectedGuide(null);
    setUnsupported(null);
  };

  return (
    <View style={styles.wrap}>
      {mode !== "assistant" ? <AppHeader title={mode === "useOfForce" ? "Use of Force" : "Device Testing"} /> : null}

      {mode === "categories" ? (
        <>
          <View style={styles.hero}>
            <View style={styles.heroCopy}>
              <Text style={styles.heroTitle}>Device Testing</Text>
              <Text style={styles.heroSub}>Verified local guides. No prompt needed.</Text>
            </View>
            <View style={styles.heroIcon}>
              <MaterialCommunityIcons name="shield-check-outline" size={34} color={colors.primaryBlue} />
            </View>
          </View>
          <DeviceSafetyNotice />

          <SectionHeader icon="tools" title="Equipment Testing" />
          <View style={[styles.grid, isTablet ? styles.gridTablet : null]}>
            {deviceTestingCategories
              .filter((category) => category.section === "equipment")
              .map((category) => (
                <CategoryCard key={category.id} category={category} onPress={() => selectCategory(category.id)} />
              ))}
          </View>

          <SectionHeader icon="shield-alert-outline" title="Operational Reference" />
          <View style={styles.grid}>
            {deviceTestingCategories
              .filter((category) => category.section === "reference")
              .map((category) => (
                <CategoryCard key={category.id} category={category} onPress={() => selectCategory(category.id)} />
              ))}
          </View>

          <DisclaimerBanner message="Device Testing requires no camera, microphone, Bluetooth, location, contacts, local network access, or police-system credentials." />
        </>
      ) : null}

      {mode === "models" ? (
        <>
          <BackLink label="Device Testing" onPress={returnToCategories} />
          <SectionHeader icon="format-list-checks" title="Select Exact Model" />
          <Text style={styles.helper}>Model selection is required before OPAi displays any equipment-specific guide.</Text>
          <DeviceModelSelector category={selectedCategory} onSelectModel={selectModel} />
          <DisclaimerBanner message="OPAi never substitutes another device model's procedure and never invents missing instructions." />
        </>
      ) : null}

      {mode === "unsupported" && unsupported ? (
        <UnsupportedDeviceNotice
          manufacturer={unsupported.manufacturer}
          model={unsupported.model}
          onBack={() => setMode("models")}
          onReturn={returnToCategories}
          refusal={unsupported.refusal}
          warning={unsupported.warning}
        />
      ) : null}

      {mode === "qualifiedGate" ? (
        <QualifiedTechnicianGate
          onConfirm={() => {
            setQualifiedTechnicianConfirmed(true);
            setMode("assistant");
          }}
          onReturn={() => setMode("models")}
        />
      ) : null}

      {mode === "assistant" && selectedGuide ? (
        <DeviceTestAssistantScreen guide={selectedGuide} onBack={() => setMode("models")} />
      ) : null}

      {mode === "useOfForce" ? (
        <>
          <BackLink label="Device Testing" onPress={returnToCategories} />
          <UseOfForceReference />
          <DisclaimerBanner message="This reference is non-prescriptive. OPAi does not recommend a force option, create a threat score, or determine whether force is reasonable." />
        </>
      ) : null}
    </View>
  );
}

function BackLink({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.backLink}>
      <MaterialCommunityIcons name="chevron-left" size={24} color={colors.primaryBlue} />
      <Text style={styles.backText}>{label}</Text>
    </Pressable>
  );
}

function CategoryCard({
  category,
  onPress
}: {
  category: (typeof deviceTestingCategories)[number];
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityHint="Shows model-specific reference procedures for testing police equipment"
      accessibilityLabel={`Open ${category.title}`}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.categoryCard, pressed ? styles.pressed : null]}
    >
      <View style={styles.categoryIcon}>
        <MaterialCommunityIcons name={category.icon} size={28} color={colors.primaryBlue} />
      </View>
      <View style={styles.categoryCopy}>
        <Text numberOfLines={2} adjustsFontSizeToFit style={styles.categoryTitle}>{category.compactTitle}</Text>
        <Text numberOfLines={2} style={styles.categoryDescription}>{category.description}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={22} color={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backLink: {
    alignItems: "center",
    alignSelf: "flex-start",
    flexDirection: "row",
    gap: spacing.xs,
    minHeight: 44
  },
  backText: {
    color: colors.primaryBlue,
    fontSize: typography.small,
    fontWeight: "900"
  },
  categoryCard: {
    alignItems: "center",
    backgroundColor: "rgba(6,29,56,0.76)",
    borderColor: "rgba(77,163,255,0.22)",
    borderRadius: radius.lg,
    borderWidth: 1,
    flexBasis: "48%",
    flexDirection: "row",
    flexGrow: 1,
    gap: spacing.sm,
    minHeight: 82,
    minWidth: 156,
    padding: spacing.base
  },
  categoryCopy: {
    flex: 1,
    minWidth: 0
  },
  categoryDescription: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: "700",
    lineHeight: 17
  },
  categoryIcon: {
    alignItems: "center",
    backgroundColor: "rgba(10,132,255,0.14)",
    borderRadius: radius.md,
    height: 46,
    justifyContent: "center",
    width: 46
  },
  categoryTitle: {
    color: colors.textPrimary,
    fontSize: typography.small,
    fontWeight: "900"
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  gridTablet: {
    justifyContent: "flex-start"
  },
  helper: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: "700",
    lineHeight: 20
  },
  hero: {
    alignItems: "center",
    backgroundColor: "rgba(7,23,42,0.78)",
    borderColor: "rgba(77,163,255,0.24)",
    borderRadius: radius.xl,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.md
  },
  heroCopy: {
    flex: 1,
    minWidth: 0
  },
  heroIcon: {
    alignItems: "center",
    backgroundColor: "rgba(10,132,255,0.14)",
    borderRadius: radius.xl,
    height: 62,
    justifyContent: "center",
    width: 62
  },
  heroSub: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: "800",
    lineHeight: 20
  },
  heroTitle: {
    color: colors.textPrimary,
    fontSize: typography.h1,
    fontWeight: "900"
  },
  pressed: {
    opacity: 0.76,
    transform: [{ translateY: 1 }]
  },
  wrap: {
    gap: spacing.md
  }
});
