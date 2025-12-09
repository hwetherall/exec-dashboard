/**
 * Application Configuration
 * Note: In production, use environment variables via a backend proxy
 */

const CONFIG = {
    // OpenRouter API Key
    OPENROUTER_API_KEY: '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',
    
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
        }
    ],
    
    // Get default model
    getDefaultModel() {
        return this.MODELS.find(m => m.isDefault) || this.MODELS[0];
    }
};

window.APP_CONFIG = CONFIG;

