# Groundhogg Next.js SDK

A Next.js SDK for integrating with Groundhogg CRM.

## Installation

```bash
npm install groundhogg-nextjs-sdk
# or
yarn add groundhogg-nextjs-sdk
# or
bun add groundhogg-nextjs-sdk
```

## Usage

1. Initialize the SDK:

```typescript
import { GroundhoggSDK } from 'groundhogg-nextjs-sdk';

const sdk = new GroundhoggSDK({
  apiEndpoint: process.env.NEXT_PUBLIC_GROUNDHOGG_API_URL,
  clientOptions: {
    debug: process.env.NODE_ENV === 'development',
  },
});
```

2. Wrap your app with the provider:

```typescript
import { GroundhoggProvider } from 'groundhogg-nextjs-sdk';

function App({ children }) {
  return (
    <GroundhoggProvider>{children}</GroundhoggProvider>
  );
}
```

3. Use the hooks in your components:

```typescript
import { useContact, useTracking } from 'groundhogg-nextjs-sdk';

function ContactForm() {
  const { contact, updateContact } = useContact();
  const { trackEvent } = useTracking();

  // Use the hooks...
}
```

## Features

- Contact management (create, read, update)
- Event tracking
- Automatic page view tracking
- Cross-tab contact synchronization
- TypeScript support

## Development

```bash
# Install dependencies
bun install

# Build
bun run build

# Watch mode
bun run dev
```

## License

MIT # Groundhogg Next.js SDK Improvements
