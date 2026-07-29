import { safeGetItem, safeSetItem, safeRemoveItem } from "@/utils/storage";
export const safeGetItem = (key: string): string | null => {
  try {
    return safeGetItem(key);
  } catch (e) {
    return null;
  }
};

export const safeSetItem = (key: string, value: string): void => {
  try {
    safeSetItem(key, value);
  } catch (e) {
    // Ignore
  }
};

export const safeRemoveItem = (key: string): void => {
  try {
    safeRemoveItem(key);
  } catch (e) {
    // Ignore
  }
};
