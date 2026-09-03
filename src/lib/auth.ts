import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Root admin emails are loaded from ROOT_ADMIN_EMAIL env var (comma-separated).
 * NEVER hard-code email addresses in source code.
 * Example: ROOT_ADMIN_EMAIL="admin@lexnova.in,backup@lexnova.in"
 */
function getRootAdminEmails(): string[] {
  const raw = process.env.ROOT_ADMIN_EMAIL || '';
  return raw
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

const ROOT_ADMIN_EMAILS = getRootAdminEmails();

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email:    { label: "Email",    type: "email"    },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const emailLower = credentials.email.toLowerCase().trim();
        const user = await prisma.user.findUnique({
          where: { email: emailLower },
        });

        if (!user || !user.passwordHash) return null;

        // ── Account lockout ──────────────────────────────────
        if (user.lockedUntil && user.lockedUntil > new Date()) {
          throw new Error("ACCOUNT_LOCKED");
        }

        // ── Email verification check ─────────────────────────
        if (!user.emailVerified) {
          throw new Error("EMAIL_NOT_VERIFIED");
        }

        // ── Active account check ─────────────────────────────
        if (!user.isActive) {
          throw new Error("ACCOUNT_DISABLED");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isValid) {
          const attempts = user.loginAttempts + 1;
          const shouldLock = attempts >= MAX_LOGIN_ATTEMPTS;
          await prisma.user.update({
            where: { id: user.id },
            data: {
              loginAttempts: attempts,
              lockedUntil: shouldLock
                ? new Date(Date.now() + LOCKOUT_DURATION_MS)
                : null,
            },
          });
          return null;
        }

        // ── Reset on success ─────────────────────────────────
        const isRootAdmin = ROOT_ADMIN_EMAILS.includes(emailLower);
        const finalRole = isRootAdmin ? "SUPER_ADMIN" : user.role;

        await prisma.user.update({
          where: { id: user.id },
          data: {
            loginAttempts: 0,
            lockedUntil: null,
            ...(isRootAdmin && user.role !== "SUPER_ADMIN" ? { role: "SUPER_ADMIN" } : {}),
          },
        });

        return {
          id:    user.id,
          name:  user.name,
          email: user.email,
          role:  finalRole,
        };
      },
    }),
    GoogleProvider({
      clientId:     process.env.GOOGLE_CLIENT_ID     || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      // Auto-verify Google users and upsert them
      if (account?.provider === "google" && user.email) {
        const emailLower = user.email.toLowerCase().trim();
        const isRootAdmin = ROOT_ADMIN_EMAILS.includes(emailLower);

        const existing = await prisma.user.findUnique({
          where: { email: emailLower },
        });

        if (!existing) {
          await prisma.user.create({
            data: {
              email:         emailLower,
              name:          user.name,
              emailVerified: new Date(),
              role:          isRootAdmin ? "SUPER_ADMIN" : "USER",
              isActive:      true,
            },
          });
        } else {
          await prisma.user.update({
            where: { id: existing.id },
            data: {
              emailVerified: existing.emailVerified || new Date(),
              ...(isRootAdmin ? { role: "SUPER_ADMIN", isActive: true } : {}),
            },
          });
        }
      }
      return true;
    },

    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id   = user.id;
        token.role = (user as any).role ?? (ROOT_ADMIN_EMAILS.includes(user.email?.toLowerCase() || "") ? "SUPER_ADMIN" : "USER");
      } else if (token.email && ROOT_ADMIN_EMAILS.includes(token.email.toLowerCase())) {
        token.role = "SUPER_ADMIN";
      }
      // Allow client to update session data
      if (trigger === "update" && session) {
        token.name = session.name;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id   = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },

  events: {
    async signIn({ user, account, isNewUser }) {
      console.log(`[Auth] Sign in: ${user.email} via ${account?.provider} (new=${isNewUser})`);
    },
    async signOut({ token }) {
      console.log(`[Auth] Sign out: ${token?.email}`);
    },
  },

  pages: {
    signIn: "/auth/login",
    error:  "/auth/error",
  },

  session: {
    strategy: "jwt",
    maxAge:   7 * 24 * 60 * 60, // 7 days
    updateAge: 24 * 60 * 60,    // Refresh session every 24h
  },

  jwt: {
    maxAge: 7 * 24 * 60 * 60, // Match session maxAge
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NEXTAUTH_DEBUG === "true",
};
