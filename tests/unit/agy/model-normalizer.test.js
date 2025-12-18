const assert = require('assert');
const { normalizeModelId, MODEL_ID_MAP } = require('../../../dist/agy/model-normalizer');

describe('Model Normalizer', () => {
  describe('normalizeModelId', () => {
    it('normalizes claude-sonnet-4-5-thinking to claude-sonnet-4-5-20250929', () => {
      assert.strictEqual(
        normalizeModelId('claude-sonnet-4-5-thinking'),
        'claude-sonnet-4-5-20250929'
      );
    });

    it('normalizes claude-opus-4-5-thinking to claude-opus-4-5-20251101', () => {
      assert.strictEqual(
        normalizeModelId('claude-opus-4-5-thinking'),
        'claude-opus-4-5-20251101'
      );
    });

    it('normalizes claude-sonnet-4-5 to claude-sonnet-4-5-20250929', () => {
      assert.strictEqual(
        normalizeModelId('claude-sonnet-4-5'),
        'claude-sonnet-4-5-20250929'
      );
    });

    it('normalizes claude-opus-4-5 to claude-opus-4-5-20251101', () => {
      assert.strictEqual(
        normalizeModelId('claude-opus-4-5'),
        'claude-opus-4-5-20251101'
      );
    });

    it('passes through unknown models unchanged', () => {
      assert.strictEqual(
        normalizeModelId('some-other-model'),
        'some-other-model'
      );
    });

    it('passes through already-valid Anthropic model IDs', () => {
      assert.strictEqual(
        normalizeModelId('claude-sonnet-4-5-20250929'),
        'claude-sonnet-4-5-20250929'
      );
    });

    it('handles empty string', () => {
      assert.strictEqual(normalizeModelId(''), '');
    });
  });

  describe('MODEL_ID_MAP', () => {
    it('exports the model ID mapping object', () => {
      assert.ok(typeof MODEL_ID_MAP === 'object');
      assert.ok(Object.keys(MODEL_ID_MAP).length >= 4);
    });

    it('contains all expected mappings', () => {
      assert.ok('claude-sonnet-4-5-thinking' in MODEL_ID_MAP);
      assert.ok('claude-opus-4-5-thinking' in MODEL_ID_MAP);
      assert.ok('claude-sonnet-4-5' in MODEL_ID_MAP);
      assert.ok('claude-opus-4-5' in MODEL_ID_MAP);
    });
  });
});
