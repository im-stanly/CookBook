import { Stack } from "expo-router";

export default function RootLayout() {
  return (
	<Stack>
	  <Stack.Screen name="index" options={{ title: "Home", headerShown: false, }} />
	  <Stack.Screen name="recipes" options={{ title: "Recipe", headerShown: false, presentation: "formSheet"}} />
	</Stack>
  );
}