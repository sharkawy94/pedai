// import type { NextAuthConfig } from "next-auth"
// import GoogleProvider from "next-auth/providers/google"
// import CredentialsProvider from "next-auth/providers/credentials"
// import { DrizzleAdapter } from "@auth/drizzle-adapter"
// import { db } from "@/lib/db"
// import { eq } from "drizzle-orm"
// import { users } from "@/lib/db/schema"
// import bcrypt from "bcrypt"

// export const authConfig: NextAuthConfig = {
//   adapter: DrizzleAdapter(db),
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),
//     CredentialsProvider({
//       name: "credentials",
//       credentials: {
//         email: { label: "Email", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) {
//           return null
//         }

//         const user = await db.query.users.findFirst({
//           where: eq(users.email, credentials.email),
//         })

//         if (!user || !user.password) {
//           return null
//         }

//         const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

//         if (!isPasswordValid) {
//           return null
//         }

//         return {
//           id: user.id.toString(),
//           email: user.email,
//           name: user.name,
//         }
//       },
//     }),
//   ],
//   pages: {
//     signIn: "/auth/signin",
//   },
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id
//         token.email = user.email
//       }
//       return token
//     },
//     async session({ session, token }) {
//       if (session.user) {
//         session.user.id = token.id as string
//       }
//       return session
//     },
//   },
//   session: {
//     strategy: "jwt",
//   },
// }
