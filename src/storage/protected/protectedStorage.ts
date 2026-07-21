import AsyncStorage from "@react-native-async-storage/async-storage";
import { getRandomBytesAsync } from "expo-crypto";
import { protectedKeyService } from "./protectedKeyService";
import { createProtectedStorageEngine } from "./protectedStorageEngine";

export const protectedStorage = createProtectedStorageEngine({
  adapter: AsyncStorage,
  keyProvider: protectedKeyService,
  randomBytes: getRandomBytesAsync
});

