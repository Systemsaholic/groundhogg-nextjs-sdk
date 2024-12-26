import { createContext, useContext, useEffect, useState } from "react";
import type { ContactData, TrackingEvent, APIResponse } from "../types";
import { GroundhoggSDK } from "../sdk";
import { GroundhoggError } from "../errors";

export const GroundhoggContext = createContext<GroundhoggSDK | null>(null);

export function useGroundhogg() {
  const sdk = useContext(GroundhoggContext);
  if (!sdk) {
    throw new Error("useGroundhogg must be used within a GroundhoggProvider");
  }
  return sdk;
}

interface UseContactReturn {
  contact: ContactData | null;
  loading: boolean;
  error: Error | null;
  updateContact: (
    data: Partial<ContactData>,
  ) => Promise<APIResponse<ContactData>>;
}

export function useContact(): UseContactReturn {
  const sdk = useGroundhogg();
  const [contact, setContact] = useState<ContactData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchContact() {
      try {
        const response = await sdk.client.getContact();
        setContact(response.data ?? null);
        setError(null);
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Failed to fetch contact");
        setError(error);
        setContact(null);
      } finally {
        setLoading(false);
      }
    }

    void fetchContact();
  }, [sdk]);

  const updateContact = async (
    data: Partial<ContactData>,
  ): Promise<APIResponse<ContactData>> => {
    setLoading(true);
    try {
      const response = await sdk.client.updateContact(data);
      setContact(response.data ?? null);
      setError(null);
      return response;
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Failed to update contact");
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    contact,
    loading,
    error,
    updateContact,
  };
}

interface UseTrackingReturn {
  trackEvent: (event: string, data?: Record<string, unknown>) => Promise<void>;
  lastEvent: TrackingEvent | null;
  error: Error | null;
}

export function useTracking(): UseTrackingReturn {
  const sdk = useGroundhogg();
  const [lastEvent, setLastEvent] = useState<TrackingEvent | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const trackEvent = async (event: string, data?: Record<string, unknown>) => {
    try {
      const trackingEvent = { event, data };
      await sdk.tracker.track(trackingEvent);
      setLastEvent(trackingEvent);
      setError(null);
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Failed to track event");
      setError(error);
      throw error;
    }
  };

  return {
    trackEvent,
    lastEvent,
    error,
  };
}

export function usePageTracking() {
  const { trackEvent } = useTracking();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleRouteChange = (url: string) => {
      void trackEvent("page_view", { path: url });
    };

    // Track initial page view
    handleRouteChange(window.location.pathname);

    // Setup route change listener for client-side navigation
    window.addEventListener("popstate", () =>
      handleRouteChange(window.location.pathname),
    );

    return () => {
      window.removeEventListener("popstate", () =>
        handleRouteChange(window.location.pathname),
      );
    };
  }, [trackEvent]);
}
