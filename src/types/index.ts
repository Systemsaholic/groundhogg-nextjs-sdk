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
  /** Contact's ID */
  id: number;
  /** Contact's email address */
  email?: string;
  /** Contact's first name */
  firstName?: string;
  /** Contact's last name */
  lastName?: string;
  /** Contact's phone number */
  phone?: string;
  /** Contact's tags */
  tags?: string[];
  /** Any additional contact fields */
  [key: string]: number | string | string[] | undefined;
}

/**
 * API Response structure
 */
export interface APIResponse<T> {
  /** Whether the request was successful */
  success: boolean;
  /** Response data */
  data?: T;
  /** Error message if request failed */
  error?: string;
}
