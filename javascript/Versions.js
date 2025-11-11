/**
 * Versions.js - Version information for Haunted Mansion Text Adventure
 * 
 * This file contains version information that is displayed in the game.
 * Update these values manually when creating new releases.
 */

class Versions {
    static getVersionInfo() {
        return {
            // Main version number (semantic versioning)
            version: "0.1.0",
            
            // Build date (update manually when releasing)
            buildDate: "2025-11-11",
            
            // Build number (increment for each release)
            buildNumber: 11,
            
            // Release name (optional, for named releases)
            releaseName: "Work-in-progress",
            
            // Git commit hash (update manually if desired)
            commitHash: null,
            
            // Environment info
            environment: "development"
        };
    }
    
    static getVersionString() {
        const info = this.getVersionInfo();
        return `v${info.version}`;
    }
    
    static getFullVersionString() {
        const info = this.getVersionInfo();
        let versionStr = `v${info.version}`;
        
        if (info.buildNumber) {
            versionStr += ` (build ${info.buildNumber})`;
        }
        
        if (info.buildDate) {
            versionStr += ` - ${info.buildDate}`;
        }
        
        if (info.releaseName) {
            versionStr += ` "${info.releaseName}"`;
        }
        
        return versionStr;
    }
    
    static getBuildInfo() {
        const info = this.getVersionInfo();
        return {
            version: info.version,
            buildDate: info.buildDate,
            buildNumber: info.buildNumber,
            commitHash: info.commitHash,
            environment: info.environment
        };
    }
    
    // For debugging/development - shows all version info
    static debugVersionInfo() {
        const info = this.getVersionInfo();
        console.log("=== Version Information ===");
        console.log(`Version: ${info.version}`);
        console.log(`Build Date: ${info.buildDate}`);
        console.log(`Build Number: ${info.buildNumber}`);
        console.log(`Release Name: ${info.releaseName}`);
        console.log(`Commit Hash: ${info.commitHash || 'Not set'}`);
        console.log(`Environment: ${info.environment}`);
        console.log("==========================");
    }
}

// Make it available globally
if (typeof window !== 'undefined') {
    window.Versions = Versions;
}

// Export for Node.js if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Versions;
}