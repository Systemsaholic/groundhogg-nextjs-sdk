import type { ReactNode } from "react";

/**
 * Configuration options for the Groundhogg SDK
 */
export interface SDKConfig {
  /** The WordPress site URL where Groundhogg is installed */
  apiEndpoint: string;
  /** Options for the tracking functionality */
  trackerOptions?: TrackerOptions;
  /** Options for the client functionality */
  clientOptions?: ClientOptions;
}

/**
 * Options for tracking functionality
 */
export interface TrackerOptions {
  /** Automatically track page views */
  autoTrackPageViews?: boolean;
  /** Enable debug logging */
  debug?: boolean;
  /** Custom tracking endpoint path */
  trackingEndpoint?: string;
}

/**
 * Options for client functionality
 */
export interface ClientOptions {
  /** Enable debug logging */
  debug?: boolean;
  /** Custom storage key for contact ID */
  storageKey?: string;
  /** Custom API version */
  apiVersion?: string;
}

/**
 * Structure of a tracking event
 */
export interface TrackingEvent {
  /** Name of the event */
  event: string;
  /** Associated contact ID */
  contactId?: number;
  /** Additional event data */
  data?: Record<string, unknown>;
}

/**
 * Contact data structure
 */
export interface ContactData {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  tags?: string[];
}

/**
 * API Response structure
 */
export interface APIResponse<T> {
  success: boolean;
  data: T | null;
  message?: string;
}

export interface ProviderProps {
  children: ReactNode;
}

export interface Client {
  getContact(id: number): Promise<APIResponse<ContactData>>;
  listContacts(): Promise<APIResponse<ContactData[]>>;
  setContact(id: number): void;
  updateContact(data: Partial<ContactData>): Promise<APIResponse<ContactData>>;
}

export interface Tracker {
  setContact(id: number): void;
  trackEvent(event: string, data?: Record<string, unknown>): void;
  trackPageView(url?: string): void;
}
