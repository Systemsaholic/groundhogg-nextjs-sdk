import { createContext } from "react";
import type { GroundhoggSDK } from "./sdk";

export const GroundhoggContext = createContext<GroundhoggSDK | null>(null);
