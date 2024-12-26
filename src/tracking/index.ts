import type { TrackerOptions, TrackingEvent } from "../types";
import { GroundhoggError } from "../errors";

export class Tracker {
  private apiEndpoint: string;
  private contactId?: number;
  private options: Required<TrackerOptions>;

  constructor(apiEndpoint: string, options: TrackerOptions = {}) {
    this.apiEndpoint = apiEndpoint.replace(/\/$/, "");
    this.options = {
      autoTrackPageViews: true,
      debug: false,
      trackingEndpoint: "/wp-json/nextjs-groundhogg/v1/track",
      ...options,
    };
  }

  setContact(contactId: number) {
    this.contactId = contactId;
    return this;
  }

  private logDebug(...args: unknown[]) {
    if (this.options.debug) {
      console.log("[Groundhogg Tracker]:", ...args);
    }
  }

  async track({ event, data = {} }: Omit<TrackingEvent, "contactId">) {
    try {
      this.logDebug("Tracking event:", {
        event,
        data,
        contactId: this.contactId,
      });

      const response = await fetch(
        `${this.apiEndpoint}${this.options.trackingEndpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            event,
            contact_id: this.contactId,
            data: {
              ...data,
              url:
                typeof window !== "undefined"
                  ? window.location.href
                  : undefined,
              referrer:
                typeof window !== "undefined" ? document.referrer : undefined,
              timestamp: new Date().toISOString(),
            },
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new GroundhoggError(
          errorData.message || "Failed to track event",
          "TRACKING_ERROR",
          response.status,
        );
      }

      return response.json();
    } catch (error) {
      this.logDebug("Tracking failed:", error);
      if (error instanceof GroundhoggError) {
        throw error;
      }
      throw new GroundhoggError("Failed to track event", "TRACKING_ERROR");
    }
  }

  // Convenience methods
  pageView = (data = {}) => this.track({ event: "page_view", data });

  formView = (formId: string, data = {}) =>
    this.track({ event: "form_view", data: { form_id: formId, ...data } });

  formSubmission = (formId: string, formData: Record<string, unknown>) =>
    this.track({
      event: "form_submission",
      data: { form_id: formId, form_data: formData },
    });
}
