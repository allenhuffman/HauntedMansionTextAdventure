#!/bin/bash

# update-version.sh - Simple script to update version information
# Usage: ./update-version.sh [version] [release-name]
# Examples: 
#   ./update-version.sh                          # Just increment build number and update date
#   ./update-version.sh 1.1.0                   # Update version, increment build, update date
#   ./update-version.sh 1.1.0 "Bug Fix Release" # Full update with release name

VERSION_FILE="Versions.js"

if [ ! -f "$VERSION_FILE" ]; then
    echo "Error: $VERSION_FILE not found!"
    exit 1
fi

# Get parameters
NEW_VERSION="$1"
RELEASE_NAME="$2"
BUILD_DATE=$(date +%Y-%m-%d)

# If no version provided, just increment build number and update date
if [ -z "$NEW_VERSION" ]; then
    UPDATE_MODE="build_only"
    echo "No version specified - incrementing build number and updating date only"
else
    UPDATE_MODE="full"
fi

# Read current build number
CURRENT_BUILD=$(grep -o 'buildNumber: [0-9]*,' "$VERSION_FILE" | grep -o '[0-9]*' | head -1)
if [ -z "$CURRENT_BUILD" ]; then
    CURRENT_BUILD=0
fi
NEW_BUILD=$((CURRENT_BUILD + 1))

if [ "$UPDATE_MODE" = "build_only" ]; then
    echo "Updating build information:"
    echo "  Build Date: $BUILD_DATE"
    echo "  Build Number: $NEW_BUILD"
else
    echo "Updating version information:"
    echo "  Version: $NEW_VERSION"
    echo "  Build Date: $BUILD_DATE"
    echo "  Build Number: $NEW_BUILD"
    if [ -n "$RELEASE_NAME" ]; then
        echo "  Release Name: $RELEASE_NAME"
    fi
fi

# Create a temporary file for updates
TEMP_FILE=$(mktemp)
cp "$VERSION_FILE" "$TEMP_FILE"

# Always update build date and build number
sed "s/buildDate: \"[^\"]*\"/buildDate: \"$BUILD_DATE\"/" "$TEMP_FILE" > "$TEMP_FILE.tmp" && mv "$TEMP_FILE.tmp" "$TEMP_FILE"
sed "s/buildNumber: [0-9]*,/buildNumber: $NEW_BUILD,/" "$TEMP_FILE" > "$TEMP_FILE.tmp" && mv "$TEMP_FILE.tmp" "$TEMP_FILE"

# Only update version and release name in full mode
if [ "$UPDATE_MODE" = "full" ]; then
    sed "s/version: \"[^\"]*\"/version: \"$NEW_VERSION\"/" "$TEMP_FILE" > "$TEMP_FILE.tmp" && mv "$TEMP_FILE.tmp" "$TEMP_FILE"
    
    if [ -n "$RELEASE_NAME" ]; then
        sed "s/releaseName: \"[^\"]*\"/releaseName: \"$RELEASE_NAME\"/" "$TEMP_FILE" > "$TEMP_FILE.tmp" && mv "$TEMP_FILE.tmp" "$TEMP_FILE"
    fi
fi

# Replace the original file
mv "$TEMP_FILE" "$VERSION_FILE"

if [ "$UPDATE_MODE" = "build_only" ]; then
    echo "Build information updated successfully!"
else
    echo "Version updated successfully!"
fi
echo ""
echo "Updated $VERSION_FILE with:"
grep -E "(version:|buildDate:|buildNumber:|releaseName:)" "$VERSION_FILE"