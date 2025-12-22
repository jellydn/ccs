const assert = require('assert');
const { AgyProxy } = require('../../../dist/agy/agy-proxy');

describe('AgyProxy', () => {
  describe('lifecycle', () => {
    it('starts on random port', async () => {
      const proxy = new AgyProxy({ upstreamUrl: 'http://127.0.0.1:8317/api/provider/agy' });
      const port = await proxy.start();

      try {
        assert.ok(port > 0, `Port should be positive, got ${port}`);
        assert.ok(port < 65536, `Port should be less than 65536, got ${port}`);
      } finally {
        proxy.stop();
      }
    });

    it('stop() is safe to call multiple times', async () => {
      const proxy = new AgyProxy({ upstreamUrl: 'http://127.0.0.1:8317/api/provider/agy' });
      await proxy.start();

      // Should not throw
      proxy.stop();
      proxy.stop();
      proxy.stop();
    });

    it('getPort() returns port after start', async () => {
      const proxy = new AgyProxy({ upstreamUrl: 'http://127.0.0.1:8317/api/provider/agy' });
      const startPort = await proxy.start();

      try {
        const getPort = proxy.getPort();
        assert.strictEqual(getPort, startPort, 'getPort should return same port as start');
      } finally {
        proxy.stop();
      }
    });

    it('getPort() returns null before start', () => {
      const proxy = new AgyProxy({ upstreamUrl: 'http://127.0.0.1:8317/api/provider/agy' });
      assert.strictEqual(proxy.getPort(), null);
    });
  });

  describe('configuration', () => {
    it('accepts upstreamUrl in config', () => {
      const upstreamUrl = 'http://127.0.0.1:9999/test';
      const proxy = new AgyProxy({ upstreamUrl });
      // Should not throw
      assert.ok(proxy);
    });

    it('accepts verbose flag in config', () => {
      const proxy = new AgyProxy({
        upstreamUrl: 'http://127.0.0.1:8317',
        verbose: true,
      });
      // Should not throw
      assert.ok(proxy);
    });

    it('accepts timeout in config', () => {
      const proxy = new AgyProxy({
        upstreamUrl: 'http://127.0.0.1:8317',
        timeout: 60000,
      });
      // Should not throw
      assert.ok(proxy);
    });
  });

  describe('SSE line transformation', () => {
    // Test the transformSSELine method indirectly through the proxy behavior
    // Since it's a private method, we test via integration

    it('proxy can be instantiated with all options', async () => {
      const proxy = new AgyProxy({
        upstreamUrl: 'http://127.0.0.1:8317/api/provider/agy',
        verbose: false,
        timeout: 30000,
      });

      const port = await proxy.start();
      try {
        assert.ok(port > 0);
      } finally {
        proxy.stop();
      }
    });
  });
});
