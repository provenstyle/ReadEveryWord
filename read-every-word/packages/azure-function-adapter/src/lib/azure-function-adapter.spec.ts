import { azureFunctionAdapter } from './azure-function-adapter.js';

describe('azureFunctionAdapter', () => {
  it('should work', () => {
    expect(azureFunctionAdapter()).toEqual('azure-function-adapter');
  });
});
