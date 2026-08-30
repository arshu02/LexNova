import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

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

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
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
        await prisma.user.update({
          where: { id: user.id },
          data: { loginAttempts: 0, lockedUntil: null },
        });

        return {
          id:    user.id,
          name:  user.name,
          email: user.email,
          role:  user.role,
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
        const existing = await prisma.user.findUnique({
          where: { email: user.email },
        });
        if (!existing) {
          await prisma.user.create({
            data: {
              email:         user.email,
              name:          user.name,
              emailVerified: new Date(),
              role:          "USER",
            },
          });
        } else if (!existing.emailVerified) {
          await prisma.user.update({
            where: { id: existing.id },
            data:  { emailVerified: new Date() },
          });
        }
      }
      return true;
    },

    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id   = user.id;
        token.role = (user as any).role ?? "USER";
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
  debug: process.env.NODE_ENV === "development",
};
