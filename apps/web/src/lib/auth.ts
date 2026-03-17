import { PrismaAdapter } from "@auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import { env, hasEmailMagicLink, hasGoogleOAuth } from "@/src/lib/env";
import { prisma } from "@/src/server/db";

const providers: NextAuthOptions["providers"] = [];

if (hasEmailMagicLink()) {
  try {
    providers.push(
      EmailProvider({
        server: {
          host: env.SMTP_HOST,
          port: Number(env.SMTP_PORT),
          auth: {
            user: env.SMTP_USER,
            pass: env.SMTP_PASSWORD,
          },
        },
        from: env.SMTP_FROM,
        maxAge: 10 * 60,
      }),
    );
  } catch (error) {
    console.error("Email provider configuration failed", error);
  }
}

if (hasGoogleOAuth()) {
  const clientId = env.GOOGLE_CLIENT_ID;
  const clientSecret = env.GOOGLE_CLIENT_SECRET;

  if (clientId && clientSecret) {
    try {
      providers.push(
        GoogleProvider({
          clientId,
          clientSecret,
          authorization: {
            params: {
              scope: "openid email profile https://www.googleapis.com/auth/gmail.readonly",
              access_type: "offline",
              prompt: "consent",
            },
          },
        }),
      );
    } catch (error) {
      console.error("Google provider configuration failed", error);
    }
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: env.NEXTAUTH_SECRET,
  session: {
    strategy: "database",
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  providers,
  callbacks: {
    redirect: async ({ url, baseUrl }) => {
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      try {
        const incoming = new URL(url);
        const allowed = new URL(baseUrl);
        if (incoming.origin === allowed.origin) {
          return url;
        }
      } catch {
        return baseUrl;
      }

      return baseUrl;
    },
    session: async ({ session, user }) => {
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { id: true, tier: true, timezone: true },
      });

      if (session.user && dbUser) {
        session.user.id = dbUser.id;
        session.user.tier = dbUser.tier;
        session.user.timezone = dbUser.timezone;
      }

      return session;
    },
  },
  logger: {
    error(code, metadata) {
      console.error("[auth.error]", code, metadata);
    },
    warn(code) {
      console.warn("[auth.warn]", code);
    },
  },
};

export function getAuthSession() {
  return getServerSession(authOptions);
}
