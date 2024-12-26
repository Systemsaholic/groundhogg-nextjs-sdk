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
  
  // Additional tracking methods
  emailOpen = (emailId: string, data = {}) =>
    this.track({ event: 'email_open', data: { email_id: emailId, ...data } });
  
  emailClick = (emailId: string, linkUrl: string, data = {}) =>
    this.track({ event: 'email_click', data: { email_id: emailId, link_url: linkUrl, ...data } });
  
  buttonClick = (buttonId: string, data = {}) =>
    this.track({ event: 'button_click', data: { button_id: buttonId, ...data } });
  
  customEvent = (eventName: string, data = {}) =>
    this.track({ event: eventName, data });
  
  productView = (productId: string, data = {}) =>
    this.track({ event: 'product_view', data: { product_id: productId, ...data } });
  
  addToCart = (productId: string, quantity: number, data = {}) =>
    this.track({ event: 'add_to_cart', data: { product_id: productId, quantity, ...data } });
  
  purchase = (orderId: string, amount: number, data = {}) =>
    this.track({ event: 'purchase', data: { order_id: orderId, amount, ...data } });
  
  videoPlay = (videoId: string, data = {}) =>
    this.track({ event: 'video_play', data: { video_id: videoId, ...data } });
  
  videoProgress = (videoId: string, progress: number, data = {}) =>
    this.track({ event: 'video_progress', data: { video_id: videoId, progress, ...data } });
  
  videoComplete = (videoId: string, data = {}) =>
    this.track({ event: 'video_complete', data: { video_id: videoId, ...data } });
  
  fileDownload = (fileId: string, fileName: string, data = {}) =>
    this.track({ event: 'file_download', data: { file_id: fileId, file_name: fileName, ...data } });
} 