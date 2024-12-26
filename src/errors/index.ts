export class GroundhoggError extends Error {
  constructor(
    message: string,
    public code: string,
    public status?: number,
    public cause?: unknown,
  ) {
    super(message);
    this.name = "GroundhoggError";
  }
}

export class ContactError extends GroundhoggError {
  constructor(message: string, code: string, cause?: unknown) {
    super(message, `CONTACT_${code}`, undefined, cause);
  }
}

export class NetworkError extends GroundhoggError {
  constructor(message: string, cause?: unknown) {
    super(message, "NETWORK_ERROR", undefined, cause);
  }
}

export class APIError extends GroundhoggError {
  constructor(message: string, code: string, status: number, cause?: unknown) {
    super(message, code, status, cause);
  }
}
