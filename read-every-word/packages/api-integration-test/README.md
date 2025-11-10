# API Integration Tests

This package contains integration tests for the tRPC API using the **direct call API** approach.

## Why Direct Call API?

For tRPC integration testing, we use the direct call API instead of HTTP server because:

- ✅ **Faster execution** - No HTTP overhead
- ✅ **Simpler setup** - No need to start/stop servers
- ✅ **Better error handling** - Direct access to tRPC errors
- ✅ **Type safety** - Full TypeScript support
- ✅ **Easier mocking** - Can mock dependencies directly

## Usage

### Basic Test Setup

```typescript
import { createTestCaller, createMockConfig } from './lib/api-integration-test.js';

describe('My tRPC Tests', () => {
  let caller: ReturnType<typeof createTestCaller>;

  beforeEach(() => {
    const config = createMockConfig({
      // Override config for testing
    });
    caller = createTestCaller(config);
  });

  it('should call tRPC procedure', async () => {
    const result = await caller.readingRecord.count({
      authId: '123e4567-e89b-12d3-a456-426614174000',
      readingCycleId: '123e4567-e89b-12d3-a456-426614174001'
    });

    expect(result).toBeDefined();
  });
});
```

### Using Test Scenarios

```typescript
import { createTestScenario } from './lib/scenarios.js';

describe('With Test Scenarios', () => {
  it('should work with valid data', async () => {
    const { caller, scenarios } = createTestScenario();

    const result = await caller.readingRecord.count(scenarios.validUuids);
    expect(result).toBeDefined();
  });
});
```

## Running Tests

```bash
# Run all tests
npm test

# Run with watch mode
npm test -- --watch

# Run specific test file
npm test -- api-integration-test.spec.ts
```

## When to Use HTTP Server Instead

Use the HTTP server approach when you need to test:

- End-to-end request/response cycle
- Middleware (CORS, authentication, etc.)
- Actual HTTP behavior (status codes, headers)
- Network-level integration

For most tRPC testing scenarios, the direct call API is the better choice.