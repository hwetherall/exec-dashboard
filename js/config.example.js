/**
 * Application Configuration Template
 * 
 * Copy this file to config.js and add your actual API key.
 * 
 * Note: config.js is in .gitignore and will not be committed to version control.
 * In production, use environment variables via a backend proxy.
 */

const CONFIG = {
    // OpenRouter API Key
    // Get your API key from: https://openrouter.ai/keys
    OPENROUTER_API_KEY: 'YOUR_API_KEY_HERE',
    
    // Available Models
    MODELS: [
        {
            id: 'x-ai/grok-4.1-fast:free',
            name: 'Grok 4.1 Fast',
            context: '2M',
            description: 'Fast and free model',
            isDefault: true
        },
        {
            id: 'google/gemini-3-pro-preview',
            name: 'Gemini 3 Pro Preview',
            context: '1M',
            description: 'Large context window'
        },
        {
            id: 'anthropic/claude-sonnet-4',
            name: 'Claude Sonnet 4',
            context: '200K',
            description: 'High quality reasoning model'
        }
    ],
    
    // Get default model
    getDefaultModel() {
        return this.MODELS.find(m => m.isDefault) || this.MODELS[0];
    }
};

window.APP_CONFIG = CONFIG;

