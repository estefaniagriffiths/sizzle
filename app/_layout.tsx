import { Stack } from 'expo-router'
import { Tabs } from 'expo-router';

export default function WelcomeLayout() {
return (
    <Stack
        screenOptions={{
          headerShown: false,
        }}
    >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="SignInScreen" options={{ headerShown: false }} />
        <Stack.Screen name="SignUpScreen" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" />
    </Stack>
  )
}
