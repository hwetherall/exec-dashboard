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
            id: 'google/gemini-2.0-flash-001',
            name: 'Gemini 2.0 Flash',
            context: '1M',
            description: 'Fast model with large context window',
            isDefault: true
        },
        {
            id: 'anthropic/claude-3.5-sonnet',
            name: 'Claude 3.5 Sonnet',
            context: '200K',
            description: 'High quality reasoning'
        },
        {
            id: 'openai/gpt-4o-mini',
            name: 'GPT-4o Mini',
            context: '128K',
            description: 'Fast and affordable'
        }
    ],
    
    // Get default model
    getDefaultModel() {
        return this.MODELS.find(m => m.isDefault) || this.MODELS[0];
    }
};

window.APP_CONFIG = CONFIG;

