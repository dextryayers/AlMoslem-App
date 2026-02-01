import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { API_BASE_URL } from "../../../lib/backend";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        try {
          const res = await fetch(`${API_BASE_URL}/api/login`, {
            method: 'POST',
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" }
          });

          // Log detail error jika gagal
          if (!res.ok) {
            const errorText = await res.text();
            console.error(`Login Failed: ${res.status} - ${errorText}`);
            console.error(`Request to: ${API_BASE_URL}/api/login`);
            return null;
          }

          const data = await res.json();

          if (res.ok && data.user) {
            return {
              id: data.user.id.toString(),
              name: data.user.name,
              email: data.user.email,
              image: data.user.image,
              accessToken: data.token, // Store backend token
            };
          }
          return null;
        } catch (error) {
          console.error("Login error:", error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        console.log("Attempting Google Sign-In sync with backend:", API_BASE_URL);
        try {
          // Sync with backend
          const response = await fetch(`${API_BASE_URL}/api/google-login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              googleId: user.id,
              image: user.image,
            }),
          });
          
          if (!response.ok) {
            const errorText = await response.text();
            console.error(`Failed to sync user with backend. Status: ${response.status}, Body: ${errorText}`);
            return false; 
          }
          
          const data = await response.json();
          console.log("Backend sync successful:", data);
          
          if (data.requiresOtp) {
             console.log("User requires OTP verification. Redirecting...");
             return `/verify-email?email=${encodeURIComponent(user.email || '')}`;
          }

          // Attach backend token and ID
          // @ts-ignore
          user.accessToken = data.token;
          // @ts-ignore
          user.dbId = data.user.id;
          
          return true;
        } catch (error) {
          console.error("Error syncing with backend:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        // @ts-ignore
        token.accessToken = user.accessToken;
        // @ts-ignore
        token.dbId = user.dbId || user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // @ts-ignore
      session.accessToken = token.accessToken;
      if (session.user) {
         // @ts-ignore
        session.user.dbId = token.dbId;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt",
  }
});

export { handler as GET, handler as POST };
