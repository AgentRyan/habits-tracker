import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.id) {
        try {
          // Dynamically import to avoid Firebase initialization at build time
          const { db } = await import("./firebase");
          const { doc, setDoc, getDoc, serverTimestamp } = await import("firebase/firestore");
          const userRef = doc(db, "users", user.id);
          const userSnap = await getDoc(userRef);
          if (!userSnap.exists()) {
            await setDoc(userRef, {
              displayName: user.name ?? "",
              email: user.email ?? "",
              photoURL: user.image ?? "",
              createdAt: serverTimestamp(),
              currentStreak: 0,
              longestStreak: 0,
              lastActiveDate: "",
            });
          }
        } catch (e) {
          console.error("Firestore user upsert failed", e);
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        (session.user as { id?: string }).id = token.sub;
      }
      return session;
    },
    async jwt({ token }) {
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
};

export default NextAuth(authOptions);
