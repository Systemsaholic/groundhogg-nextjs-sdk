import { TrackingEvent, TrackerOptions } from './types';

export class Tracker {
  private apiEndpoint: string;
  private contactId?: number;
  private options: TrackerOptions;

  constructor(apiEndpoint: string, options: TrackerOptions = {}) {
    this.apiEndpoint = apiEndpoint;
    this.options = {
      autoTrackPageViews: true,
      debug: false,
      ...options,
    };
  }

  setContact(contactId: number) {
    this.contactId = contactId;
    return this;
  }

  async track({ event, data = {} }: Omit<TrackingEvent, 'contactId'>) {
    try {
      if (this.options.debug) {
        console.log('Tracking:', { event, data, contactId: this.contactId });
      }

      const response = await fetch(`${this.apiEndpoint}/wp-json/nextjs-groundhogg/v1/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          event,
          contact_id: this.contactId,
          data: {
            ...data,
            url: window.location.href,
            referrer: document.referrer,
            timestamp: new Date().toISOString(),
          },
        }),
      });

      return response.json();
    } catch (error) {
      if (this.options.debug) {
        console.error('Tracking failed:', error);
      }
    }
  }

  // Convenience methods
  pageView = (data = {}) => this.track({ event: 'page_view', data });
  formView = (formId: string, data = {}) => 
    this.track({ event: 'form_view', data: { form_id: formId, ...data } });
  formSubmission = (formId: string, formData: Record<string, any>) =>
    this.track({ event: 'form_submission', data: { form_id: formId, form_data: formData } });
} 