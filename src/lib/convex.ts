import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithAuthKit } from "@convex-dev/workos/react";
import { useAuth } from "@workos-inc/authkit-react";
import { ReactNode } from "react";

const convexUrl = import.meta.env.VITE_CONVEX_URL;
if (!convexUrl) {
  throw new Error("Missing VITE_CONVEX_URL environment variable");
}

export const convex = new ConvexReactClient(convexUrl);

export function ConvexProvider({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();

  return (
    <ConvexProviderWithAuthKit
      client={convex}
      useAuth={() => ({
        isLoading,
        isAuthenticated: !!user,
        fetchAccessToken: async () => {
          // WorkOS AuthKit handles token automatically
          return null;
        },
      })}
    >
      {children}
    </ConvexProviderWithAuthKit>
  );
}

