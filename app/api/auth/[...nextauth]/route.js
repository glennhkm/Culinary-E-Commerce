import { db } from "@/lib/prismaConnect/db";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

const login = async (credentials) => {
  try {
    const user = await db.users.findUnique({
      where: {
        email: credentials.email,
      },
    });
    if (!user) throw new Error("Username atau password anda salah!");

    const isPasswordMatch = await bcrypt.compare(credentials.password, user.password);
    if (!isPasswordMatch) throw new Error("Username atau password anda salah!");

    return user;
  } catch (error) {
    console.log("ERROR LOGIN: ", error.message);
    throw new Error(error.message);
  }
};

export const authOptions = {
  pages: {
    signIn: "/auth/sign-in",
  },
  providers: [
    CredentialsProvider({
      name: "Sign In",
      credentials: {},
      async authorize(credentials) {
        const user = await login(credentials);
        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, trigger, session, user }) {
      if (trigger === "update" && session) {
        return { ...token, ...session?.user };
      }
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.fullName = user.fullName;
        token.profilePictureKey = user.profilePictureKey;
        token.profilePictureUrl = user.profilePictureUrl;
        token.phoneNumber = user.phoneNumber;
        token.address = user.address;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
