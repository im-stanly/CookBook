import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

class CrossPlatformStorage {
  async getItemAsync(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      // Use localStorage for web
      return localStorage.getItem(key);
    } else {
      // Use SecureStore for mobile
      return await SecureStore.getItemAsync(key);
    }
  }

  async setItemAsync(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      // Use localStorage for web
      localStorage.setItem(key, value);
    } else {
      // Use SecureStore for mobile
      await SecureStore.setItemAsync(key, value);
    }
  }

  async deleteItemAsync(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      // Use localStorage for web
      localStorage.removeItem(key);
    } else {
      // Use SecureStore for mobile
      await SecureStore.deleteItemAsync(key);
    }
  }
}

export const storage = new CrossPlatformStorage();
