import { createContext, useContext } from "react";
import { GroundhoggSDK } from "./sdk";

export const GroundhoggContext = createContext<GroundhoggSDK | null>(null);
GroundhoggContext.displayName = "GroundhoggContext";

export function useGroundhogg(): GroundhoggSDK {
  const context = useContext(GroundhoggContext);
  if (!context) {
    throw new Error("useGroundhogg must be used within a GroundhoggProvider");
  }
  return context;
}
