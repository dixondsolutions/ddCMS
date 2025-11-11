import { createContext, useContext, ReactNode } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface TenantContextType {
  tenant: any;
  isLoading: boolean;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: ReactNode }) {
  const tenant = useQuery(api.queries.tenants.getCurrentTenant);
  const isLoading = tenant === undefined;

  return (
    <TenantContext.Provider value={{ tenant: tenant || null, isLoading }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
}

