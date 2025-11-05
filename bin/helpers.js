'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

// Color formatting (TTY-aware)
const useColors = process.stderr.isTTY && !process.env.NO_COLOR;
const colors = useColors ? {
  red: '\x1b[0;31m',
  yellow: '\x1b[1;33m',
  cyan: '\x1b[0;36m',
  green: '\x1b[0;32m',
  bold: '\x1b[1m',
  reset: '\x1b[0m'
} : { red: '', yellow: '', cyan: '', green: '', bold: '', reset: '' };

// Error formatting
function showError(message) {
  console.error('');
  console.error(colors.red + colors.bold + '╔═════════════════════════════════════════════╗' + colors.reset);
  console.error(colors.red + colors.bold + '║  ERROR                                      ║' + colors.reset);
  console.error(colors.red + colors.bold + '╚═════════════════════════════════════════════╝' + colors.reset);
  console.error('');
  console.error(colors.red + message + colors.reset);
  console.error('');
}

// Path expansion (~ and env vars)
function expandPath(pathStr) {
  // Handle tilde expansion
  if (pathStr.startsWith('~/') || pathStr.startsWith('~\\')) {
    pathStr = path.join(os.homedir(), pathStr.slice(2));
  }

  // Expand environment variables (Windows and Unix)
  pathStr = pathStr.replace(/\$\{([^}]+)\}/g, (_, name) => process.env[name] || '');
  pathStr = pathStr.replace(/\$([A-Z_][A-Z0-9_]*)/gi, (_, name) => process.env[name] || '');

  // Windows %VAR% style
  if (process.platform === 'win32') {
    pathStr = pathStr.replace(/%([^%]+)%/g, (_, name) => process.env[name] || '');
  }

  return path.normalize(pathStr);
}

// Validate profile name (alphanumeric, dash, underscore only)
function validateProfileName(profile) {
  return /^[a-zA-Z0-9_-]+$/.test(profile);
}

// Validate path safety (prevent injection)
function isPathSafe(pathStr) {
  // Allow: alphanumeric, path separators, space, dash, underscore, dot, colon, tilde
  return !/[;|&<>`$*?\[\]'"()]/.test(pathStr);
}

module.exports = {
  colors,
  showError,
  expandPath,
  validateProfileName,
  isPathSafe
};