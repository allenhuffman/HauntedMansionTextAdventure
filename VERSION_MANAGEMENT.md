# Manual Version Management

This project uses a simple manual versioning system for tracking releases.

## Files

- **`javascript/Versions.js`** - Contains version information displayed in the game
- **`javascript/update-version.sh`** - Shell script to help update version information

## Usage

### Viewing Version Information

In the game:
- Type `VERSION` to see detailed version information
- Version info is also displayed at the bottom of the game window

### Updating Version Information

#### Method 1: Using the update script (recommended)

```bash
# Navigate to the javascript directory
cd javascript

# Quick build increment (just increment build number and update date)
./update-version.sh

# Update to a new version without a release name
./update-version.sh 1.2.0

# Update to a new version with a release name
./update-version.sh 1.1.0 "Bug Fix Release"
```

The script will automatically:
- Update the version number
- Set the build date to today
- Increment the build number
- Update the release name (if provided)

#### Method 2: Manual editing

Edit `javascript/Versions.js` directly and update:
- `version`: Semantic version number (e.g., "1.1.0")
- `buildDate`: Build date in YYYY-MM-DD format
- `buildNumber`: Increment for each release
- `releaseName`: Optional descriptive name for the release
- `commitHash`: Optional git commit hash (if using git)

## Version Display

The version information appears in two places:
1. At the bottom of the game window (shows short version)
2. When typing `VERSION` command in game (shows full details)

## Example Workflows

### Quick Development Build
```bash
# Navigate to the javascript directory
cd javascript

# After making small changes, just increment build number
./update-version.sh

# Test your changes...
```

### Full Release
```bash
# Navigate to the javascript directory
cd javascript

# After making changes and testing
./update-version.sh 1.1.0 "Added new sound effects"

# Commit your changes (if using git)
cd ..
git add .
git commit -m "Release v1.1.0: Added new sound effects"
git tag v1.1.0

# Deploy your updated game
```

## Future Automation

This manual system can be enhanced with:
- GitHub Actions for automated versioning
- Git hooks to auto-update version on commit
- Build scripts that inject version information at build time