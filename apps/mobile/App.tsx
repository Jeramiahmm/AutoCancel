import { useMemo, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const CARD_BG = "rgba(255,255,255,0.86)";

export default function App() {
  const [apiBaseUrl, setApiBaseUrl] = useState("http://localhost:3000");
  const [linkToken, setLinkToken] = useState("");
  const [status, setStatus] = useState("Waiting to register for push notifications.");

  const normalizedBaseUrl = useMemo(() => apiBaseUrl.replace(/\/$/, ""), [apiBaseUrl]);

  async function registerForPush() {
    try {
      if (!Device.isDevice) {
        Alert.alert("Physical device required", "Push notifications do not work on most simulators.");
        return;
      }

      const permission = await Notifications.getPermissionsAsync();
      let finalStatus = permission.status;

      if (finalStatus !== "granted") {
        const requested = await Notifications.requestPermissionsAsync();
        finalStatus = requested.status;
      }

      if (finalStatus !== "granted") {
        Alert.alert("Permission denied", "Enable notifications in settings to receive reminders.");
        return;
      }

      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.HIGH,
        });
      }

      const expoPushToken = (await Notifications.getExpoPushTokenAsync()).data;

      const response = await fetch(`${normalizedBaseUrl}/api/mobile/push-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${linkToken}`,
        },
        body: JSON.stringify({
          token: expoPushToken,
          platform: Platform.OS === "ios" ? "IOS" : "ANDROID",
          deviceLabel: Device.modelName ?? "Unknown device",
        }),
      });

      const data = await response.json();

      if (!response.ok || data?.success === false) {
        throw new Error(data?.error ?? "Registration failed");
      }

      setStatus("Push registration successful. You will now receive AutoCancel reminder notifications.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unexpected registration failure");
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.badge}>AutoCancel mobile companion</Text>
        <Text style={styles.title}>Native push setup</Text>
        <Text style={styles.subtitle}>
          Paste the mobile link token from your web dashboard, then register this device for native reminders.
        </Text>

        <View style={styles.card}>
          <Text style={styles.label}>API base URL</Text>
          <TextInput
            style={styles.input}
            value={apiBaseUrl}
            onChangeText={setApiBaseUrl}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>Mobile link token</Text>
          <TextInput
            style={[styles.input, styles.tokenInput]}
            value={linkToken}
            onChangeText={setLinkToken}
            autoCapitalize="none"
            autoCorrect={false}
            multiline
          />

          <Pressable style={styles.button} onPress={registerForPush}>
            <Text style={styles.buttonText}>Register this device</Text>
          </Pressable>

          <Text style={styles.status}>{status}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f8fcfe",
  },
  container: {
    padding: 20,
    gap: 14,
  },
  badge: {
    alignSelf: "flex-start",
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: "#5f6d79",
    backgroundColor: "#eef5f8",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  title: {
    fontSize: 34,
    lineHeight: 38,
    color: "#122330",
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 15,
    color: "#4f6271",
    lineHeight: 22,
  },
  card: {
    marginTop: 10,
    borderRadius: 20,
    padding: 16,
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: "#d8e3ea",
    gap: 8,
  },
  label: {
    fontSize: 12,
    color: "#5f6d79",
    fontWeight: "600",
    marginTop: 8,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: "#c7d5de",
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: "#ffffff",
    color: "#10212f",
  },
  tokenInput: {
    minHeight: 80,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  button: {
    marginTop: 10,
    borderRadius: 999,
    backgroundColor: "#0c7d8d",
    alignItems: "center",
    justifyContent: "center",
    height: 46,
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  status: {
    marginTop: 8,
    color: "#2e4352",
    fontSize: 13,
    lineHeight: 20,
  },
});
