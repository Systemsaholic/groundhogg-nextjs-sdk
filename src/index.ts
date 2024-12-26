// Core SDK
export { GroundhoggSDK } from "./sdk";

// Client functionality
export { Client } from "./client";

// Tracking functionality
export { Tracker } from "./tracking";

// React hooks
export {
  useGroundhogg,
  useContact,
  useTracking,
  usePageTracking,
  GroundhoggContext,
} from "./hooks";

// Error types
export {
  GroundhoggError,
  ContactError,
  NetworkError,
  APIError,
} from "./errors";

// Type definitions
export type {
  SDKConfig,
  ClientOptions,
  TrackerOptions,
  TrackingEvent,
  ContactData,
  APIResponse,
} from "./types";
