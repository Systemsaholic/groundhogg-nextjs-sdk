import type { ReactNode } from "react";
import { Client } from "../client";
import { Tracker } from "../tracking";
import type { SDKConfig } from "../types";

export class GroundhoggSDK {
  private apiEndpoint: string;
  public tracker: Tracker;
  public client: Client;

  constructor(config: SDKConfig) {
    this.apiEndpoint = config.apiEndpoint.replace(/\/$/, "");
    this.tracker = new Tracker(this.apiEndpoint, config.trackerOptions);
    this.client = new Client(this.apiEndpoint, config.clientOptions);
  }

  setContact(contactId: number): this {
    this.tracker.setContact(contactId);
    this.client.setContact(contactId);
    return this;
  }
}
