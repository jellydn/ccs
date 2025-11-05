# CCS Test Suite

## Organization

- `native/` - Traditional installation (curl|bash, irm|iex)
  - `unix/` - Unix/Linux/macOS native tests
  - `windows/` - Windows PowerShell tests
- `npm/` - npm package tests
  - `postinstall.test.js` - Postinstall behavior tests
  - `cli.test.js` - CLI argument parsing tests
  - `cross-platform.test.js` - Cross-platform compatibility tests
- `unit/` - Node.js unit tests
- `integration/` - Integration tests
- `shared/` - Shared utilities and test data

## Running Tests

- All tests: `npm test`
- npm package tests only: `npm run test:npm`
- Native installation tests only: `npm run test:native`
- Unit tests only: `npm run test:unit`
- Integration tests only: `npm run test:integration`
- Master test suite (backward compatible): `npm run test:edge-cases`

## Test Structure

### Native Tests
Test the traditional installation methods where CCS is installed via:
- Unix/Linux/macOS: `curl | bash`
- Windows: `irm | iex` (PowerShell)

These tests use bash/PowerShell scripts and test the `lib/ccs` and `lib/ccs.ps1` files.

### npm Tests
Test the npm package installation where CCS is installed via:
- npm: `npm install -g @kaitranntt/ccs`

These tests use Node.js/mocha framework and test the `bin/ccs.js` file.

### Shared Utilities
Common test code, data, and helper functions are stored in `shared/` to avoid duplication across test suites.