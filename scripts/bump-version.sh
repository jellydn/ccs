#!/usr/bin/env bash
# Bump CCS version
# Usage: ./scripts/bump-version.sh [major|minor|patch]

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CCS_DIR="$(dirname "$SCRIPT_DIR")"
VERSION_FILE="$CCS_DIR/VERSION"

# Check VERSION file exists
if [[ ! -f "$VERSION_FILE" ]]; then
    echo "✗ Error: VERSION file not found at $VERSION_FILE"
    exit 1
fi

# Read current version
CURRENT_VERSION=$(cat "$VERSION_FILE")
echo "Current version: $CURRENT_VERSION"

# Parse version
if [[ ! "$CURRENT_VERSION" =~ ^([0-9]+)\.([0-9]+)\.([0-9]+)$ ]]; then
    echo "✗ Error: Invalid version format in VERSION file"
    echo "Expected: MAJOR.MINOR.PATCH (e.g., 1.2.3)"
    exit 1
fi

MAJOR="${BASH_REMATCH[1]}"
MINOR="${BASH_REMATCH[2]}"
PATCH="${BASH_REMATCH[3]}"

# Determine bump type
BUMP_TYPE="${1:-patch}"

case "$BUMP_TYPE" in
    major)
        MAJOR=$((MAJOR + 1))
        MINOR=0
        PATCH=0
        ;;
    minor)
        MINOR=$((MINOR + 1))
        PATCH=0
        ;;
    patch)
        PATCH=$((PATCH + 1))
        ;;
    *)
        echo "✗ Error: Invalid bump type '$BUMP_TYPE'"
        echo "Usage: $0 [major|minor|patch]"
        exit 1
        ;;
esac

NEW_VERSION="$MAJOR.$MINOR.$PATCH"

echo "New version: $NEW_VERSION"
echo ""
echo "This will update hardcoded versions in:"
echo "  1. VERSION file"
echo "  2. lib/ccs (bash executable)"
echo "  3. lib/ccs.ps1 (PowerShell executable)"
echo "  4. package.json (via sync-version.js)"
echo "  5. installers/install.sh"
echo "  6. installers/install.ps1"
echo ""
read -p "Continue? (y/N) " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 0
fi

# Update VERSION file
echo "$NEW_VERSION" > "$VERSION_FILE"
echo "✓ Updated VERSION file to $NEW_VERSION"

# Update ccs (bash executable)
CCS_BASH="$CCS_DIR/lib/ccs"
if [[ -f "$CCS_BASH" ]]; then
    sed -i.bak "s/^CCS_VERSION=\".*\"/CCS_VERSION=\"$NEW_VERSION\"/" "$CCS_BASH"
    rm -f "$CCS_BASH.bak"
    echo "✓ Updated lib/ccs (bash executable)"
else
    echo "⚠  lib/ccs not found, skipping"
fi

# Update ccs.ps1 (PowerShell executable)
CCS_PS1="$CCS_DIR/lib/ccs.ps1"
if [[ -f "$CCS_PS1" ]]; then
    sed -i.bak "s/^\$CcsVersion = \".*\"/\$CcsVersion = \"$NEW_VERSION\"/" "$CCS_PS1"
    rm -f "$CCS_PS1.bak"
    echo "✓ Updated lib/ccs.ps1 (PowerShell executable)"
else
    echo "⚠  lib/ccs.ps1 not found, skipping"
fi

# Update installers/install.sh
INSTALL_SH="$CCS_DIR/installers/install.sh"
if [[ -f "$INSTALL_SH" ]]; then
    sed -i.bak "s/^CCS_VERSION=\".*\"/CCS_VERSION=\"$NEW_VERSION\"/" "$INSTALL_SH"
    rm -f "$INSTALL_SH.bak"
    echo "✓ Updated installers/install.sh"
else
    echo "⚠  installers/install.sh not found, skipping"
fi

# Update installers/install.ps1
INSTALL_PS1="$CCS_DIR/installers/install.ps1"
if [[ -f "$INSTALL_PS1" ]]; then
    sed -i.bak "s/^\$CcsVersion = \".*\"/\$CcsVersion = \"$NEW_VERSION\"/" "$INSTALL_PS1"
    rm -f "$INSTALL_PS1.bak"
    echo "✓ Updated installers/install.ps1"
else
    echo "⚠  installers/install.ps1 not found, skipping"
fi

# Sync version to package.json
echo "Syncing version to package.json..."
if node "$SCRIPT_DIR/sync-version.js"; then
    echo "✓ Synced version to package.json"
else
    echo "✗ Error: Failed to sync version to package.json"
    exit 1
fi

echo ""
echo "✓ Version bumped to $NEW_VERSION"
echo ""
echo "Next steps:"
echo "  1. Review changes: git diff"
echo "  2. Commit: git add VERSION package.json lib/ccs lib/ccs.ps1 installers/install.sh installers/install.ps1"
echo "  3. Commit: git commit -m \"chore: bump version to $NEW_VERSION\""
echo "  4. Tag: git tag v$NEW_VERSION"
echo "  5. Push: git push origin main && git push origin v$NEW_VERSION"
