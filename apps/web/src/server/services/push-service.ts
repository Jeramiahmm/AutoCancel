import webpush from "web-push";
import { Expo } from "expo-server-sdk";
import { env } from "@/src/lib/env";

try {
  webpush.setVapidDetails(env.VAPID_SUBJECT, env.VAPID_PUBLIC_KEY, env.VAPID_PRIVATE_KEY);
} catch {
  // Allow local builds with placeholder env vars; runtime delivery still requires valid keys.
}

const expo = new Expo({ accessToken: env.EXPO_ACCESS_TOKEN });

export async function sendWebPush(endpoint: {
  endpoint: string;
  auth: string;
  p256dh: string;
}, payload: Record<string, string>) {
  await webpush.sendNotification(
    {
      endpoint: endpoint.endpoint,
      keys: {
        auth: endpoint.auth,
        p256dh: endpoint.p256dh,
      },
    },
    JSON.stringify(payload),
  );
}

export async function sendMobilePush(tokens: string[], payload: { title: string; body: string }) {
  const validTokens = tokens.filter((token) => Expo.isExpoPushToken(token));
  if (!validTokens.length) {
    return;
  }

  const chunks = expo.chunkPushNotifications(
    validTokens.map((token) => ({
      to: token,
      title: payload.title,
      body: payload.body,
      sound: "default",
      data: payload,
    })),
  );

  for (const chunk of chunks) {
    await expo.sendPushNotificationsAsync(chunk);
  }
}
