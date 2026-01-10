import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Resend from "next-auth/providers/resend"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db"
import { html } from "@/lib/email-template"
import type { Session } from "next-auth"
import type { User as PrismaUser } from "@/lib/prisma"

// Extend session and token types to include role
declare module "next-auth" {
  interface Session {
    user: Session["user"] & {
      id: string
      role: "USER" | "ADMIN"
    }
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true, 
    }),
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY,
      from: "onboarding@resend.dev", // Update to your domain when ready
      async sendVerificationRequest({ identifier: to, url, provider }) {
        const { host } = new URL(url);
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${provider.apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: provider.from,
            to,
            subject: `Sign in to ${host}`,
            html: html({ url, host }), // Use your custom HTML here
          }),
        });

        if (!res.ok) {
          throw new Error("Resend error: " + JSON.stringify(await res.json()));
        }
      },
    }),
  ],
  pages: {
    signIn: "/login", 
    verifyRequest: "/login/verify",
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = (user as PrismaUser).role as "USER" | "ADMIN";
      }
      return session;
    },
  },
})