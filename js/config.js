/**
 * Application Configuration
 * Note: In production, use environment variables via a backend proxy
 */

const CONFIG = {
    // Toggle AI recommendations on/off
    ENABLE_AI_RECOMMENDATIONS: true,
    
    // OpenRouter API Key
    OPENROUTER_API_KEY: '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',
    
    // Available Models
    MODELS: [
        {
            id: 'meta-llama/llama-4-maverick',
            name: 'Llama 4 Maverick (Groq)',
            context: '128K',
            description: 'Super rapid via Groq infrastructure'
           
        },
        {
            id: 'x-ai/grok-4.1-fast',
            name: 'Grok 4.1 Fast',
            context: '2M',
            description: 'Fast and powerful model',
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

