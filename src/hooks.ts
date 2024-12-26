import { useContext, useEffect, useState, useCallback } from "react";
import type { ContactData, TrackingEvent } from "./types";
import type { GroundhoggSDK } from "./sdk";
import { GroundhoggContext } from "./context";

export { GroundhoggContext } from "./context";

export function useGroundhogg() {
  const sdk = useContext(GroundhoggContext);
  if (!sdk) {
    throw new Error("useGroundhogg must be used within a GroundhoggProvider");
  }
  return sdk;
}

export function useContact() {
  const sdk = useContext(GroundhoggContext);
  const [contact, setContact] = useState<ContactData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchContact = useCallback(async () => {
    if (!sdk) return;
    try {
      setLoading(true);
      setError(null);
      const response = await sdk.client.getContact();
      setContact(response.data ?? null);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch contact"),
      );
    } finally {
      setLoading(false);
    }
  }, [sdk]);

  const updateContact = useCallback(
    async (data: Partial<ContactData>) => {
      if (!sdk) return;
      try {
        setLoading(true);
        setError(null);
        const response = await sdk.client.updateContact(data);
        if (response.data) {
          setContact(response.data);
        }
        return response;
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to update contact"),
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [sdk],
  );

  useEffect(() => {
    void fetchContact();
  }, [fetchContact]);

  return { contact, loading, error, updateContact, refetch: fetchContact };
}

export function useTracking() {
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
      setError(err instanceof Error ? err : new Error("Failed to track event"));
      throw err;
    }
  };

  return { trackEvent, lastEvent, error };
}

export function usePageTracking() {
  const { trackEvent } = useTracking();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleRouteChange = (url: string) => {
      void trackEvent("page_view", { path: url });
    };

    handleRouteChange(window.location.pathname);
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
