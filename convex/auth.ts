import { defineAuth } from "@convex-dev/auth/server";
import { WorkOS } from "@convex-dev/auth/providers/WorkOS";

export const { auth, signIn, signOut, store } = defineAuth({
  providers: [WorkOS],
});

