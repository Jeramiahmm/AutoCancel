import { PrismaAdapter } from "@auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import {
  env,
  hasEmailMagicLink,
  hasGoogleOAuth,
  isDemoModeEnabled,
} from "@/src/lib/env";
import { prisma } from "@/src/server/db";
import { ensureDemoUser } from "@/src/server/services/demo-service";

const providers: NextAuthOptions["providers"] = [
  CredentialsProvider({
    id: "demo",
    name: "Try Demo",
    credentials: {},
    authorize: async () => {
      if (!isDemoModeEnabled()) {
        return null;
      }

      const user = await ensureDemoUser();
      return {
        id: user.id,
        email: user.email,
        name: user.name ?? "Demo User",
      };
    },
  }),
];

if (hasEmailMagicLink()) {
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
}

if (hasGoogleOAuth()) {
  providers.push(
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID as string,
      clientSecret: env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/gmail.readonly",
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  );
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "database",
  },
  pages: {
    signIn: "/auth/signin",
  },
  providers,
  callbacks: {
    session: async ({ session, user }) => {
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { id: true, tier: true, timezone: true, isDemo: true },
      });

      if (session.user && dbUser) {
        session.user.id = dbUser.id;
        session.user.tier = dbUser.tier;
        session.user.timezone = dbUser.timezone;
        session.user.isDemo = dbUser.isDemo;
      }

      return session;
    },
  },
};

export function getAuthSession() {
  return getServerSession(authOptions);
}
