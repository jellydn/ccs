'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { showError, expandPath, isPathSafe } = require('./helpers');

// Detect Claude CLI executable
function detectClaudeCli() {
  // Priority 1: CCS_CLAUDE_PATH environment variable
  if (process.env.CCS_CLAUDE_PATH) {
    const ccsPath = expandPath(process.env.CCS_CLAUDE_PATH);
    if (fs.existsSync(ccsPath) && isExecutable(ccsPath)) {
      return ccsPath;
    }
    // Invalid CCS_CLAUDE_PATH - continue to fallbacks
  }

  // Priority 2: Check if claude in PATH
  try {
    const claudePath = execSync(
      process.platform === 'win32' ? 'where claude' : 'which claude',
      { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }
    ).trim().split('\n')[0];

    if (claudePath && fs.existsSync(claudePath)) {
      return claudePath;
    }
  } catch (e) {
    // Not in PATH, continue to common locations
  }

  // Priority 3: Check common installation locations
  const commonLocations = getCommonLocations();

  for (const location of commonLocations) {
    const expandedPath = expandPath(location);
    if (fs.existsSync(expandedPath) && isExecutable(expandedPath)) {
      return expandedPath;
    }
  }

  // Not found
  return null;
}

// Get platform-specific common locations
function getCommonLocations() {
  const home = require('os').homedir();

  if (process.platform === 'win32') {
    return [
      path.join(process.env.LOCALAPPDATA || '', 'Claude', 'claude.exe'),
      path.join(process.env.PROGRAMFILES || '', 'Claude', 'claude.exe'),
      'C:\\Program Files\\Claude\\claude.exe',
      'D:\\Program Files\\Claude\\claude.exe',
      path.join(home, '.local', 'bin', 'claude.exe')
    ];
  } else if (process.platform === 'darwin') {
    return [
      '/usr/local/bin/claude',
      path.join(home, '.local/bin/claude'),
      '/opt/homebrew/bin/claude'
    ];
  } else {
    return [
      '/usr/local/bin/claude',
      path.join(home, '.local/bin/claude'),
      '/usr/bin/claude'
    ];
  }
}

// Check if file is executable
function isExecutable(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.X_OK);
    return true;
  } catch (e) {
    return false;
  }
}

// Validate Claude CLI path
function validateClaudeCli(claudePath) {
  // Check 1: Empty path
  if (!claudePath) {
    throw new Error('No path provided');
  }

  // Check 2: File exists
  if (!fs.existsSync(claudePath)) {
    throw new Error(`File not found: ${claudePath}`);
  }

  // Check 3: Is regular file (not directory)
  const stats = fs.statSync(claudePath);
  if (!stats.isFile()) {
    throw new Error(`Path is a directory: ${claudePath}`);
  }

  // Check 4: Is executable
  if (!isExecutable(claudePath)) {
    throw new Error(`File is not executable: ${claudePath}\n\nTry: chmod +x ${claudePath}`);
  }

  // Check 5: Path safety (prevent injection)
  if (!isPathSafe(claudePath)) {
    throw new Error(`Path contains unsafe characters: ${claudePath}\n\nAllowed: alphanumeric, path separators, spaces, hyphens, underscores, dots`);
  }

  return true;
}

// Show Claude not found error
function showClaudeNotFoundError() {
  const envVarStatus = process.env.CCS_CLAUDE_PATH || '(not set)';
  const isWindows = process.platform === 'win32';

  const errorMsg = `Claude CLI not found

Searched:
  - CCS_CLAUDE_PATH: ${envVarStatus}
  - System PATH: not found
  - Common locations: not found

Solutions:
  1. Add Claude CLI to PATH:

     ${isWindows
       ? '# Find where Claude is installed\n     Get-ChildItem -Path C:\\,D:\\ -Filter claude.exe -Recurse\n\n     # Add to PATH\n     $env:Path += \';D:\\path\\to\\claude\\directory\'\n     [Environment]::SetEnvironmentVariable(\'Path\', $env:Path, \'User\')'
       : '# Find where Claude is installed\n     sudo find / -name claude 2>/dev/null\n\n     # Add to PATH\n     export PATH="/path/to/claude/bin:$PATH"\n     echo \'export PATH="/path/to/claude/bin:$PATH"\' >> ~/.bashrc\n     source ~/.bashrc'
     }

  2. Or set custom path:

     ${isWindows
       ? '$env:CCS_CLAUDE_PATH = \'D:\\full\\path\\to\\claude.exe\'\n     [Environment]::SetEnvironmentVariable(\'CCS_CLAUDE_PATH\', \'D:\\full\\path\\to\\claude.exe\', \'User\')'
       : 'export CCS_CLAUDE_PATH="/full/path/to/claude"\n     echo \'export CCS_CLAUDE_PATH="/full/path/to/claude"\' >> ~/.bashrc\n     source ~/.bashrc'
     }

  3. Or install Claude CLI:

     https://docs.claude.com/en/docs/claude-code/installation

Verify installation:
  ccs --version`;

  showError(errorMsg);
}

module.exports = {
  detectClaudeCli,
  validateClaudeCli,
  showClaudeNotFoundError
};