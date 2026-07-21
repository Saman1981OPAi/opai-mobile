import { useMemo, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FlatList, Modal, Pressable, StyleSheet, View } from "react-native";
import { AppText as Text, AppInputText as TextInput } from "@/components/ui/Typography";
import { searchCanadianWeatherCities } from "@/services/weather/canadianWeatherCities";
import type { WeatherCity } from "@/services/weather/weatherTypes";
import { colors, radius, spacing, typography } from "@/theme/tokens";

type Props = {
  onClose: () => void;
  onSelect: (city: WeatherCity) => void;
  visible: boolean;
};

export function WeatherCityPickerModal({ onClose, onSelect, visible }: Props) {
  const [query, setQuery] = useState("");
  const cities = useMemo(() => searchCanadianWeatherCities(query), [query]);

  return (
    <Modal animationType="slide" onRequestClose={onClose} presentationStyle="pageSheet" visible={visible}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <View style={styles.headerCopy}>
            <Text maxFontSizeMultiplier={1.4} style={styles.title}>Canadian city</Text>
            <Text maxFontSizeMultiplier={1.4} style={styles.subtitle}>Weather stays on this device.</Text>
          </View>
          <Pressable accessibilityLabel="Close city picker" accessibilityRole="button" onPress={onClose} style={styles.iconButton}>
            <MaterialCommunityIcons color={colors.textPrimary} name="close" size={24} />
          </Pressable>
        </View>

        <View style={styles.searchBox}>
          <MaterialCommunityIcons color={colors.accentBlue} name="magnify" size={21} />
          <TextInput
            accessibilityLabel="Search Canadian cities"
            autoCapitalize="words"
            onChangeText={setQuery}
            placeholder="Search city or province"
            placeholderTextColor={colors.textMuted}
            style={styles.searchInput}
            value={query}
          />
        </View>

        <FlatList
          contentContainerStyle={styles.list}
          data={cities}
          keyboardShouldPersistTaps="handled"
          keyExtractor={(item) => `${item.city}-${item.province}`}
          ListEmptyComponent={<Text style={styles.empty}>No bundled Canadian city matches that search.</Text>}
          renderItem={({ item }) => (
            <Pressable
              accessibilityLabel={`Use ${item.city}, ${item.province} for weather`}
              accessibilityRole="button"
              onPress={() => onSelect(item)}
              style={({ pressed }) => [styles.cityRow, pressed ? styles.pressed : null]}
            >
              <MaterialCommunityIcons color={colors.primaryBlue} name="map-marker-outline" size={23} />
              <View style={styles.cityCopy}>
                <Text maxFontSizeMultiplier={1.4} style={styles.cityName}>{item.city}</Text>
                <Text maxFontSizeMultiplier={1.4} style={styles.province}>{item.province}</Text>
              </View>
              <MaterialCommunityIcons color={colors.textMuted} name="chevron-right" size={23} />
            </Pressable>
          )}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  cityCopy: { flex: 1, minWidth: 0 },
  cityName: { color: colors.textPrimary, fontSize: typography.body, fontWeight: "700" },
  cityRow: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 64,
    padding: spacing.md
  },
  empty: { color: colors.textMuted, fontSize: typography.small, padding: spacing.lg, textAlign: "center" },
  header: { alignItems: "center", flexDirection: "row", gap: spacing.md, justifyContent: "space-between" },
  headerCopy: { flex: 1, minWidth: 0 },
  iconButton: {
    alignItems: "center",
    borderColor: colors.border,
    borderRadius: radius.full,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    width: 44
  },
  list: { gap: spacing.sm, paddingBottom: spacing.xxl },
  pressed: { opacity: 0.72 },
  province: { color: colors.textMuted, fontSize: typography.caption, marginTop: 2 },
  screen: { backgroundColor: colors.background, flex: 1, gap: spacing.md, padding: spacing.lg, paddingTop: spacing.xl },
  searchBox: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 50,
    paddingHorizontal: spacing.md
  },
  searchInput: { color: colors.textPrimary, flex: 1, fontSize: typography.body, minWidth: 0 },
  subtitle: { color: colors.textMuted, fontSize: typography.caption, marginTop: 2 },
  title: { color: colors.textPrimary, fontSize: typography.h3, fontWeight: "700" }
});
