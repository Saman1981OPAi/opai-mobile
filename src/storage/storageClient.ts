import AsyncStorage from "@react-native-async-storage/async-storage";

export const storageClient = {
  async getJson<T>(key: string): Promise<T | null> {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  },

  async setJson<T>(key: string, value: T): Promise<void> {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  },

  async remove(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  },

  async multiRemove(keys: string[]): Promise<void> {
    await Promise.all(keys.map((key) => AsyncStorage.removeItem(key)));
  }
};
