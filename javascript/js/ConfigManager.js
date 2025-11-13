/**
 * ConfigManager - Centralized configuration management
 * Provides validation, type-safe access, and schema management for game configuration
 */
class ConfigManager {
    constructor() {
        this.config = {};
        this.isLoaded = false;
        this.validationErrors = [];
    }

    /**
     * Load configuration from global window.gameConfig
     * @returns {boolean} True if config loaded successfully
     */
    loadConfig() {
        try {
            this.config = window.gameConfig || {};
            this.isLoaded = true;
            this.validateConfig();
            return true;
        } catch (error) {
            console.error("ConfigManager: Failed to load config:", error);
            this.validationErrors.push("Failed to load configuration: " + error.message);
            return false;
        }
    }

    /**
     * Validate configuration against expected schema
     * @returns {boolean} True if config is valid
     */
    validateConfig() {
        this.validationErrors = [];
        const config = this.config;

        // Required string fields with defaults
        const requiredStrings = [
            'title', 'welcome_message', 'quit_message',
            'restart_message', 'continue_message', 'version_fallback'
        ];

        for (const field of requiredStrings) {
            if (config[field] !== undefined && typeof config[field] !== 'string') {
                this.validationErrors.push(`Field '${field}' must be a string, got ${typeof config[field]}`);
            }
        }

        // Data files validation
        if (config.data_files) {
            const requiredDataFiles = ['map', 'items', 'audio'];
            for (const file of requiredDataFiles) {
                if (config.data_files[file] !== undefined && typeof config.data_files[file] !== 'string') {
                    this.validationErrors.push(`data_files.${file} must be a string, got ${typeof config.data_files[file]}`);
                }
            }
        }

        // Log validation results
        if (this.validationErrors.length > 0) {
            console.warn("ConfigManager: Configuration validation errors:", this.validationErrors);
            return false;
        } else {
            console.log("ConfigManager: Configuration validated successfully");
            return true;
        }
    }

    /**
     * Get configuration value with type safety and fallback
     * @param {string} key - Dot-notation key (e.g., 'data_files.map')
     * @param {*} fallback - Fallback value if key not found
     * @param {string} expectedType - Expected type for validation
     * @returns {*} Configuration value or fallback
     */
    get(key, fallback = null, expectedType = null) {
        const keys = key.split('.');
        let value = this.config;

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                value = undefined;
                break;
            }
        }

        // Type validation if specified
        if (value !== undefined && expectedType && typeof value !== expectedType) {
            console.warn(`ConfigManager: Type mismatch for '${key}': expected ${expectedType}, got ${typeof value}`);
            return fallback;
        }

        return value !== undefined ? value : fallback;
    }

    /**
     * Get string value with fallback
     * @param {string} key - Configuration key
     * @param {string} fallback - Fallback string
     * @returns {string} Configuration value
     */
    getString(key, fallback = '') {
        return this.get(key, fallback, 'string');
    }

    /**
     * Get data file path with fallback
     * @param {string} fileType - Type of data file ('map', 'items', 'audio')
     * @returns {string} File path
     */
    getDataFile(fileType) {
        const defaultFiles = {
            map: 'data/hm_map.json',
            items: 'data/hm_items.json',
            audio: 'data/hm_audio.json'
        };
        return this.get(`data_files.${fileType}`, defaultFiles[fileType] || '', 'string');
    }

    /**
     * Get game title
     * @returns {string} Game title
     */
    getTitle() {
        return this.getString('title', 'Haunted Mansion Text Adventure');
    }

    /**
     * Get welcome message
     * @returns {string} Welcome message
     */
    getWelcomeMessage() {
        return this.getString('welcome_message', 'Welcome, foolish mortal, to the Haunted Mansion Adventure Game.');
    }

    /**
     * Get quit message
     * @returns {string} Quit message
     */
    getQuitMessage() {
        return this.getString('quit_message', 'Thanks for playing the Haunted Mansion!');
    }

    /**
     * Get restart message
     * @returns {string} Restart message
     */
    getRestartMessage() {
        return this.getString('restart_message', 'Restarting the haunted adventure...');
    }

    /**
     * Get continue message
     * @returns {string} Continue message
     */
    getContinueMessage() {
        return this.getString('continue_message', 'Good! Continue your haunted adventure...');
    }

    /**
     * Get version fallback message
     * @returns {string} Version fallback message
     */
    getVersionFallback() {
        return this.getString('version_fallback', 'Haunted Mansion Text Adventure - JavaScript Version');
    }

    /**
     * Check if configuration is loaded and valid
     * @returns {boolean} True if config is loaded and valid
     */
    isValid() {
        return this.isLoaded && this.validationErrors.length === 0;
    }

    /**
     * Get validation errors
     * @returns {Array<string>} Array of validation error messages
     */
    getValidationErrors() {
        return [...this.validationErrors];
    }

    /**
     * Get full configuration object (for debugging)
     * @returns {Object} Complete configuration object
     */
    getAll() {
        return { ...this.config };
    }

    /**
     * Debug method to log configuration status
     */
    debug() {
        console.log("=== ConfigManager Debug ===");
        console.log("Loaded:", this.isLoaded);
        console.log("Valid:", this.isValid());
        console.log("Errors:", this.validationErrors);
        console.log("Config:", this.config);
        console.log("===========================");
    }
}

// Create global instance
window.configManager = new ConfigManager();

// Make ConfigManager available globally
window.ConfigManager = ConfigManager;