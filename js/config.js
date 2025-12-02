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

