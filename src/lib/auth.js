import GoogleProvider from "next-auth/providers/google";

/**
 * Only these Gmail addresses can access the admin panel.
 * Add or remove entries as needed.
 */
const ALLOWED_EMAILS = [
  "avcreations53@gmail.com",
  "itshussainlodhger@gmail.com",
];

/** @type {import("next-auth").AuthOptions} */
export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
  ],
  callbacks: {
    /**
     * Block sign-in for any email not in the allowlist.
     */
    async signIn({ user }) {
      return ALLOWED_EMAILS.includes(user.email?.toLowerCase());
    },
    /** Expose user info in the client-side session */
    async session({ session }) {
      return session;
    },
  },
  pages: {
    signIn: "/admin",   // redirect back to /admin for sign-in
    error: "/admin",    // show errors on the admin page itself
  },
  secret: process.env.NEXTAUTH_SECRET,
};
