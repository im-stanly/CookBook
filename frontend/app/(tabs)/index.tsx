import { HelloWave } from '@/components/HelloWave';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    <ThemedView style={{ flex: 1 }}>
      <HelloWave />
      <ThemedText>Home Screen Placeholder</ThemedText>
    </ThemedView>
  );
}
