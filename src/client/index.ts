import type { ClientOptions, ContactData, APIResponse } from "../types";
import { GroundhoggError } from "../errors";

export class Client {
  private apiEndpoint: string;
  private contactId?: number;
  private options: Required<ClientOptions>;
  private storageKey: string;
  private apiVersion: string;

  constructor(apiEndpoint: string, options: ClientOptions = {}) {
    this.apiEndpoint = apiEndpoint.replace(/\/$/, "");
    this.options = {
      debug: false,
      storageKey: "groundhogg_contact_id",
      apiVersion: "v4",
      ...options,
    };
    this.storageKey = this.options.storageKey;
    this.apiVersion = this.options.apiVersion;

    // Try to restore contactId from storage
    this.restoreContact();
    // Listen for cross-window contact updates
    this.listenForContactUpdates();
  }

  private restoreContact() {
    try {
      const storedId = localStorage.getItem(this.storageKey);
      if (storedId) {
        const id = parseInt(storedId, 10);
        if (!isNaN(id)) {
          this.contactId = id;
        }
      }
    } catch (e) {
      this.logError("Failed to restore contact:", e);
    }
  }

  private listenForContactUpdates() {
    window.addEventListener("storage", (event) => {
      if (event.key === this.storageKey && event.newValue) {
        const id = parseInt(event.newValue, 10);
        if (!isNaN(id)) {
          this.contactId = id;
        }
      }
    });
  }

  private logError(message: string, error: unknown) {
    if (this.options.debug) {
      console.error(message, error);
    }
  }

  private logDebug(...args: unknown[]) {
    if (this.options.debug) {
      console.log(...args);
    }
  }

  setContact(contactId: number) {
    this.contactId = contactId;
    try {
      localStorage.setItem(this.storageKey, contactId.toString());
    } catch (e) {
      this.logError("Failed to store contact:", e);
    }
    return this;
  }

  async createContact(data: ContactData): Promise<APIResponse<ContactData>> {
    try {
      const response = await this.request<ContactData>("/contacts", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (response.success && typeof response.data?.id === "number") {
        this.setContact(response.data.id);
      }

      return response;
    } catch (error) {
      throw new GroundhoggError(
        "Failed to create contact",
        "CREATE_CONTACT_ERROR",
      );
    }
  }

  async updateContact(
    data: Partial<ContactData>,
  ): Promise<APIResponse<ContactData>> {
    if (!this.contactId) {
      throw new GroundhoggError("No contact set", "NO_CONTACT_ERROR");
    }

    try {
      return await this.request<ContactData>(`/contacts/${this.contactId}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    } catch (error) {
      throw new GroundhoggError(
        "Failed to update contact",
        "UPDATE_CONTACT_ERROR",
      );
    }
  }

  async getContact(): Promise<APIResponse<ContactData | null>> {
    if (!this.contactId) return { success: true, data: null };

    try {
      return await this.request<ContactData>(`/contacts/${this.contactId}`);
    } catch (error) {
      throw new GroundhoggError("Failed to fetch contact", "GET_CONTACT_ERROR");
    }
  }

  private async request<T>(
    path: string,
    options: RequestInit = {},
  ): Promise<APIResponse<T>> {
    const url = `${this.apiEndpoint}/wp-json/gh/${this.apiVersion}${path}`;
    this.logDebug("Making request to:", url, options);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new GroundhoggError(
          data.message || "API request failed",
          data.code || "API_ERROR",
          response.status,
        );
      }

      return {
        success: true,
        data: data as T,
      };
    } catch (error) {
      if (error instanceof GroundhoggError) {
        throw error;
      }

      throw new GroundhoggError("Network request failed", "NETWORK_ERROR");
    }
  }
}
