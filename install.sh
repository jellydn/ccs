#!/usr/bin/env bash
set -euo pipefail

INSTALL_DIR="${INSTALL_DIR:-$HOME/.local/bin}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Installing ccs to $INSTALL_DIR..."
echo ""

# Create install dir if needed
mkdir -p "$INSTALL_DIR"

# Make executable first
chmod +x "$SCRIPT_DIR/ccs"

# Symlink ccs script
ln -sf "$SCRIPT_DIR/ccs" "$INSTALL_DIR/ccs"

# Verify installation
if [[ ! -L "$INSTALL_DIR/ccs" ]]; then
  echo "❌ Error: Failed to create symlink at $INSTALL_DIR/ccs"
  echo "Check directory permissions and try again."
  exit 1
fi

# Check if in PATH
if [[ ":$PATH:" != *":$INSTALL_DIR:"* ]]; then
  echo "⚠️  Warning: $INSTALL_DIR is not in PATH"
  echo ""
  echo "Add to your shell profile (~/.bashrc or ~/.zshrc):"
  echo "  export PATH=\"\$HOME/.local/bin:\$PATH\""
  echo ""
fi

echo "✅ Installation complete!"
echo ""
echo "Next steps:"
echo "1. Copy example config: cp $SCRIPT_DIR/.ccs.example.json ~/.ccs.json"
echo "2. Edit ~/.ccs.json with your profile mappings"
echo "3. Run: ccs <profile>"
echo ""
echo "Example:"
echo "  ccs glm"
echo "  ccs sonnet --verbose"
