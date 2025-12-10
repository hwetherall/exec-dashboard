/**
 * AI Chat Module
 * Provides document Q&A via OpenRouter API
 */

const ChatModule = (function() {
    // Internal Configuration (will be merged with APP_CONFIG)
    const DEFAULTS = {
        apiEndpoint: 'https://openrouter.ai/api/v1/chat/completions',
        storageKeys: {
            messages: 'kajima_chat_messages',
            apiKey: 'kajima_chat_api_key',
            selectedModel: 'kajima_chat_model'
        }
    };

    // Internal state
    let state = {
        isOpen: false,
        isExpanded: false,
        messages: [],
        apiKey: null,
        selectedModel: null,
        isLoading: false
    };

    const icons = {
        chat: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`,
        close: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
        send: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>`,
        sparkle: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"></path></svg>`,
        settings: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`,
        trash: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`,
        user: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
        key: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>`,
        expand: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>`,
        collapse: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 14 10 14 10 20"></polyline><polyline points="20 10 14 10 14 4"></polyline><line x1="14" y1="10" x2="21" y2="3"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>`,
        clear: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`
    };

    // Suggested starter questions
    const starterQuestions = [
        "What is the investment recommendation?",
        "What are the main risks identified?",
        "Summarize the key opportunities",
        "What is the market size (TAM)?"
    ];

    /**
     * Get API key (from config or localStorage)
     */
    function getApiKey() {
        // First check config for hardcoded key
        if (window.APP_CONFIG?.OPENROUTER_API_KEY) {
            return window.APP_CONFIG.OPENROUTER_API_KEY;
        }
        // Fall back to localStorage
        return localStorage.getItem(DEFAULTS.storageKeys.apiKey);
    }

    /**
     * Get available models
     */
    function getModels() {
        return window.APP_CONFIG?.MODELS || [
            { id: 'google/gemini-2.0-flash-001', name: 'Gemini 2.0 Flash', context: '1M', isDefault: true }
        ];
    }

    /**
     * Get selected model
     */
    function getSelectedModel() {
        const savedModelId = localStorage.getItem(DEFAULTS.storageKeys.selectedModel);
        const models = getModels();
        
        if (savedModelId) {
            const found = models.find(m => m.id === savedModelId);
            if (found) return found;
        }
        
        return models.find(m => m.isDefault) || models[0];
    }

    /**
     * Initialize the chat module
     */
    async function init() {
        // Load API key
        state.apiKey = getApiKey();
        
        // Load selected model
        state.selectedModel = getSelectedModel();
        
        // Load saved messages
        const saved = localStorage.getItem(DEFAULTS.storageKeys.messages);
        if (saved) {
            try {
                state.messages = JSON.parse(saved);
            } catch (e) {
                console.error("Failed to parse chat history", e);
            }
        }

        // Load document context
        await loadDocument();

        // Render initial UI
        renderChatToggle();
        
        // Add language change listener
        if (window.I18n) {
            window.I18n.onLanguageChange(() => {
                if (state.isOpen) {
                    // Re-render chat panel to update labels
                    // We need to preserve the current view state
                    const panel = document.getElementById('chatPanel');
                    if (panel) {
                        // Just update texts that can be updated without full re-render
                        // Or full re-render. Let's do full re-render for simplicity
                        panel.remove();
                        renderChatPanel();
                        const newPanel = document.getElementById('chatPanel');
                        newPanel.style.display = 'flex';
                        
                        // Re-attach events
                        setupEventListeners();
                    }
                }
                
                // Update toggle button
                const toggle = document.getElementById('chatToggle');
                if (toggle) {
                    toggle.innerHTML = `
                        <span class="chat-toggle-icon">${icons.chat}</span>
                        <span class="chat-toggle-label">${I18n.t('chat.ask_ai')}</span>
                    `;
                }
            });
        }
    }

    /**
     * Load the markdown content to use as context
     */
    async function loadDocument() {
        try {
            // In a real app, we'd fetch the markdown file
            // For this prototype, we'll use the data object
            // We'll convert the data object to a string representation for context
            state.documentContext = JSON.stringify(window.memoData, null, 2);
        } catch (error) {
            console.error("Failed to load document context:", error);
            state.documentContext = "Error loading document context.";
        }
    }

    /**
     * Render the chat toggle button
     */
    function renderChatToggle() {
        const toggle = document.createElement('button');
        toggle.id = 'chatToggle';
        toggle.className = 'chat-toggle';
        toggle.innerHTML = `
            <span class="chat-toggle-icon">${icons.chat}</span>
            <span class="chat-toggle-label">${I18n.t('chat.ask_ai')}</span>
        `;
        toggle.setAttribute('aria-label', I18n.t('chat.ask_ai'));
        document.body.appendChild(toggle);
        
        toggle.addEventListener('click', toggleChat);
    }

    /**
     * Render the main chat panel
     */
    function renderChatPanel() {
        const panel = document.createElement('div');
        panel.id = 'chatPanel';
        panel.className = `chat-panel ${state.isExpanded ? 'expanded' : ''}`;
        panel.innerHTML = `
            <div class="chat-resize-handle" id="chatResizeHandle" title="Drag to resize"></div>
            <div class="chat-panel-header">
                <div class="chat-panel-title">
                    <span class="chat-ai-icon">${icons.sparkle}</span>
                    <span>${I18n.t('chat.title')}</span>
                </div>
                <div class="chat-panel-actions">
                    <button class="chat-action-btn" id="chatExpandBtn" title="Expand">
                        ${state.isExpanded ? icons.collapse : icons.expand}
                    </button>
                    <button class="chat-action-btn" id="chatClearBtn" title="Clear conversation">
                        ${icons.clear}
                    </button>
                    <button class="chat-action-btn" id="chatSettingsBtn" title="Settings">
                        ${icons.settings}
                    </button>
                    <button class="chat-action-btn" id="chatCloseBtn" title="Close">
                        ${icons.close}
                    </button>
                </div>
            </div>
            <div class="chat-messages" id="chatMessages">
                ${renderWelcomeMessage()}
            </div>
            <div class="chat-input-area">
                <div class="chat-input-wrapper">
                    <textarea 
                        id="chatInput" 
                        class="chat-input" 
                        placeholder="${I18n.t('chat.placeholder')}"
                        rows="1"
                    ></textarea>
                    <button id="chatSendBtn" class="chat-send-btn" disabled>
                        ${icons.send}
                    </button>
                </div>
                <p class="chat-input-hint">${I18n.t('chat.hint')}</p>
            </div>
        `;
        document.body.appendChild(panel);
    }

    /**
     * Render welcome message with starter questions
     */
    function renderWelcomeMessage() {
        if (state.messages.length > 0) {
            return state.messages.map(msg => renderMessage(msg)).join('');
        }

        const starterButtons = starterQuestions
            .map(q => `<button class="starter-question" data-question="${q}">${q}</button>`)
            .join('');

        return `
            <div class="chat-welcome">
                <div class="chat-welcome-icon">${icons.sparkle}</div>
                <h3>${I18n.t('chat.welcome_title')}</h3>
                <p>${I18n.t('chat.welcome_text')}</p>
                <div class="starter-questions">
                    <p class="starter-label">${I18n.t('chat.try_asking')}</p>
                    ${starterButtons}
                </div>
            </div>
        `;
    }

    /**
     * Render settings modal
     */
    function renderSettingsModal() {
        const models = getModels();
        const currentModel = state.selectedModel;
        const hasConfigKey = !!window.APP_CONFIG?.OPENROUTER_API_KEY;
        
        const modelOptions = models.map(m => `
            <option value="${m.id}" ${m.id === currentModel.id ? 'selected' : ''}>
                ${m.name} (${m.context})
            </option>
        `).join('');

        const modal = document.createElement('div');
        modal.id = 'chatSettingsModal';
        modal.className = 'chat-modal';
        modal.innerHTML = `
            <div class="chat-modal-backdrop"></div>
            <div class="chat-modal-content">
                <div class="chat-modal-header">
                    <div class="chat-modal-title">
                        <span>${icons.settings}</span>
                        <span>${I18n.t('chat.settings')}</span>
                    </div>
                    <button class="chat-modal-close" id="modalCloseBtn">
                        ${icons.close}
                    </button>
                </div>
                <div class="chat-modal-body">
                    <div class="form-group">
                        <label for="modelSelect">${I18n.t('chat.model')}</label>
                        <select id="modelSelect" class="form-select">
                            ${modelOptions}
                        </select>
                        <p class="form-hint">
                            ${currentModel.description || 'Select the AI model to use'}
                        </p>
                    </div>
                    ${!hasConfigKey ? `
                    <div class="form-group">
                        <label for="apiKeyInput">${I18n.t('chat.api_key')}</label>
                        <input 
                            type="password" 
                            id="apiKeyInput" 
                            class="form-input"
                            placeholder="sk-or-v1-..."
                            value="${state.apiKey || ''}"
                        />
                        <p class="form-hint">
                            ${I18n.t('chat.get_key')} <a href="https://openrouter.ai/keys" target="_blank" rel="noopener">openrouter.ai/keys</a>
                        </p>
                    </div>
                    ` : `
                    <div class="form-group">
                        <label>${I18n.t('chat.api_key')}</label>
                        <div class="api-key-status">
                            <span class="status-dot active"></span>
                            <span>${I18n.t('chat.configured')}</span>
                        </div>
                    </div>
                    `}
                </div>
                <div class="chat-modal-footer">
                    <button class="btn-secondary" id="modalCancelBtn">${I18n.t('chat.cancel')}</button>
                    <button class="btn-primary" id="modalSaveBtn">${I18n.t('chat.save')}</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Modal Event Listeners
        const closeBtn = modal.querySelector('#modalCloseBtn');
        const cancelBtn = modal.querySelector('#modalCancelBtn');
        const saveBtn = modal.querySelector('#modalSaveBtn');
        const backdrop = modal.querySelector('.chat-modal-backdrop');
        
        const closeModal = () => modal.remove();
        
        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        backdrop.addEventListener('click', closeModal);
        
        saveBtn.addEventListener('click', () => {
            const modelSelect = modal.querySelector('#modelSelect');
            const apiKeyInput = modal.querySelector('#apiKeyInput');
            
            const newModelId = modelSelect.value;
            const newModel = models.find(m => m.id === newModelId);
            
            if (newModel) {
                state.selectedModel = newModel;
                localStorage.setItem(DEFAULTS.storageKeys.selectedModel, newModelId);
            }
            
            if (apiKeyInput) {
                const newKey = apiKeyInput.value.trim();
                if (newKey) {
                    state.apiKey = newKey;
                    localStorage.setItem(DEFAULTS.storageKeys.apiKey, newKey);
                }
            }
            
            closeModal();
        });
    }

    /**
     * Toggle chat panel
     */
    function toggleChat() {
        state.isOpen = !state.isOpen;
        
        let panel = document.getElementById('chatPanel');
        
        if (state.isOpen) {
            if (!panel) {
                renderChatPanel();
                setupEventListeners();
                panel = document.getElementById('chatPanel');
            }
            panel.style.display = 'flex';
            
            // Focus input
            setTimeout(() => {
                document.getElementById('chatInput')?.focus();
                scrollToBottom();
            }, 50);
        } else {
            if (panel) {
                panel.style.display = 'none';
            }
        }
    }

    /**
     * Setup event listeners for chat panel
     */
    function setupEventListeners() {
        const closeBtn = document.getElementById('chatCloseBtn');
        const expandBtn = document.getElementById('chatExpandBtn');
        const clearBtn = document.getElementById('chatClearBtn');
        const settingsBtn = document.getElementById('chatSettingsBtn');
        const sendBtn = document.getElementById('chatSendBtn');
        const input = document.getElementById('chatInput');
        const messagesContainer = document.getElementById('chatMessages');

        closeBtn?.addEventListener('click', toggleChat);
        
        expandBtn?.addEventListener('click', () => {
            state.isExpanded = !state.isExpanded;
            const panel = document.getElementById('chatPanel');
            panel.classList.toggle('expanded');
            expandBtn.innerHTML = state.isExpanded ? icons.collapse : icons.expand;
        });

        clearBtn?.addEventListener('click', () => {
            if (confirm('Clear all chat history?')) {
                state.messages = [];
                localStorage.removeItem(DEFAULTS.storageKeys.messages);
                messagesContainer.innerHTML = renderWelcomeMessage();
            }
        });

        settingsBtn?.addEventListener('click', renderSettingsModal);

        input?.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
            sendBtn.disabled = !this.value.trim();
        });

        input?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
            }
        });

        sendBtn?.addEventListener('click', handleSend);

        // Delegate click for starter questions
        messagesContainer?.addEventListener('click', (e) => {
            if (e.target.classList.contains('starter-question')) {
                const question = e.target.dataset.question;
                const input = document.getElementById('chatInput');
                if (input) {
                    input.value = question;
                    input.dispatchEvent(new Event('input'));
                    handleSend();
                }
            }
        });

        // Resize Handle Logic
        const resizeHandle = document.getElementById('chatResizeHandle');
        let isResizing = false;
        let startX, startY, startWidth, startHeight;

        resizeHandle?.addEventListener('mousedown', (e) => {
            isResizing = true;
            const panel = document.getElementById('chatPanel');
            startX = e.clientX;
            startY = e.clientY;
            startWidth = parseInt(document.defaultView.getComputedStyle(panel).width, 10);
            startHeight = parseInt(document.defaultView.getComputedStyle(panel).height, 10);
            document.documentElement.addEventListener('mousemove', doResize, false);
            document.documentElement.addEventListener('mouseup', stopResize, false);
        });

        function doResize(e) {
            if (!isResizing) return;
            const panel = document.getElementById('chatPanel');
            panel.style.width = (startWidth - (e.clientX - startX)) + 'px';
            panel.style.height = (startHeight - (e.clientY - startY)) + 'px';
        }

        function stopResize() {
            isResizing = false;
            document.documentElement.removeEventListener('mousemove', doResize, false);
            document.documentElement.removeEventListener('mouseup', stopResize, false);
        }
    }

    /**
     * Handle sending a message
     */
    async function handleSend() {
        const input = document.getElementById('chatInput');
        const text = input.value.trim();
        
        if (!text || state.isLoading) return;

        // Add user message
        addMessage({ role: 'user', content: text });
        
        // Clear input
        input.value = '';
        input.style.height = 'auto';
        
        // Set loading state
        state.isLoading = true;
        renderLoading();

        try {
            // Get response from AI
            const response = await fetchAIResponse(text);
            
            // Remove loading
            removeLoading();
            
            // Add AI message
            addMessage({ role: 'assistant', content: response });
            
        } catch (error) {
            console.error("Chat Error:", error);
            removeLoading();
            addMessage({ 
                role: 'assistant', 
                content: "I apologize, but I encountered an error connecting to the AI service. Please check your API key in settings." 
            });
        } finally {
            state.isLoading = false;
        }
    }

    /**
     * Add a message to state and UI
     */
    function addMessage(msg) {
        state.messages.push(msg);
        localStorage.setItem(DEFAULTS.storageKeys.messages, JSON.stringify(state.messages));
        
        const container = document.getElementById('chatMessages');
        
        // If this is the first message, clear the welcome screen
        if (state.messages.length === 1) {
            container.innerHTML = '';
        }

        // Append new message
        const msgDiv = document.createElement('div');
        msgDiv.innerHTML = renderMessage(msg);
        container.appendChild(msgDiv.firstElementChild);
        
        scrollToBottom();
    }

    /**
     * Render a single message
     */
    function renderMessage(msg) {
        const isUser = msg.role === 'user';
        const avatar = isUser ? icons.user : icons.sparkle;
        
        // Parse markdown-ish
        const formattedContent = msg.content
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\[(.*?)\]/g, '<span class="citation">$1</span>');

        return `
            <div class="chat-message ${isUser ? 'user' : 'ai'}">
                <div class="chat-avatar">
                    ${avatar}
                </div>
                <div class="chat-bubble">
                    <p>${formattedContent}</p>
                </div>
            </div>
        `;
    }

    /**
     * Render loading indicator
     */
    function renderLoading() {
        const container = document.getElementById('chatMessages');
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'chatLoading';
        loadingDiv.className = 'chat-message ai';
        loadingDiv.innerHTML = `
            <div class="chat-avatar">${icons.sparkle}</div>
            <div class="chat-bubble">
                <div class="chat-loading">
                    <div class="chat-loading-dot"></div>
                    <div class="chat-loading-dot"></div>
                    <div class="chat-loading-dot"></div>
                </div>
            </div>
        `;
        container.appendChild(loadingDiv);
        scrollToBottom();
    }

    function removeLoading() {
        const loading = document.getElementById('chatLoading');
        loading?.remove();
    }

    function scrollToBottom() {
        const container = document.getElementById('chatMessages');
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }

    /**
     * Fetch response from OpenRouter
     */
    async function fetchAIResponse(userMessage) {
        if (!state.apiKey) {
            throw new Error("No API Key configured");
        }

        // Prepare messages with context
        const systemPrompt = `You are a helpful investment analyst assistant. 
You have access to an Investment Memo for the "Kajima Wellbeing Real Estate Initiative". 
Answer questions based on the provided context. 
Keep answers concise and professional. 
If you don't know the answer based on the context, say so.

CONTEXT:
${state.documentContext}`;

        const messages = [
            { role: "system", content: systemPrompt },
            ...state.messages.slice(-5), // Context window of last 5 messages
            { role: "user", content: userMessage }
        ];

        const response = await fetch(DEFAULTS.apiEndpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${state.apiKey}`,
                'HTTP-Referer': window.location.href, // Required by OpenRouter
                'X-Title': 'Investment Memo Dashboard',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: state.selectedModel.id,
                messages: messages,
                temperature: 0.7,
                max_tokens: 1000
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'API Request failed');
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    // Public API
    return {
        init,
        toggle: toggleChat
    };
})();

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    ChatModule.init();
});
