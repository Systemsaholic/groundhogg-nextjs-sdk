import type { ReactNode } from "react";
import * as React from "react";
import { Client } from "../client";
import { Tracker } from "../tracking";
import { GroundhoggContext } from "../hooks";
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

  // Initialize with contact
  setContact(contactId: number) {
    this.tracker.setContact(contactId);
    this.client.setContact(contactId);
    return this;
  }

  // React hooks provider
  Provider = ({ children }: { children: ReactNode }) => {
    return React.createElement(
      GroundhoggContext.Provider,
      { value: this },
      children,
    );
  };
}
