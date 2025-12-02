/**
 * AI Chat Module
 * Provides document Q&A via OpenRouter API
 */

const ChatModule = (function() {
    // Internal Configuration (will be merged with APP_CONFIG)
    const DEFAULTS = {
        apiEndpoint: 'https://openrouter.ai/api/v1/chat/completions',
        storageKeys: {
            apiKey: 'openrouter_api_key',
            messages: 'chat_messages',
            selectedModel: 'selected_model'
        }
    };

    // State
    let state = {
        isOpen: false,
        isLoading: false,
        isExpanded: false,
        isResizing: false,
        panelWidth: 400,
        messages: [],
        documentContent: null,
        apiKey: null,
        selectedModel: null
    };

    // Icons
    const icons = {
        chat: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`,
        close: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
        send: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>`,
        settings: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`,
        clear: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`,
        copy: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`,
        check: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
        sparkle: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z"></path></svg>`,
        key: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>`,
        expand: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>`,
        collapse: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 14 10 14 10 20"></polyline><polyline points="20 10 14 10 14 4"></polyline><line x1="14" y1="10" x2="21" y2="3"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>`
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
            { id: 'x-ai/grok-4.1-fast:free', name: 'Grok 4.1 Fast', context: '128K', isDefault: true }
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
        const savedMessages = localStorage.getItem(DEFAULTS.storageKeys.messages);
        if (savedMessages) {
            try {
                state.messages = JSON.parse(savedMessages);
            } catch (e) {
                state.messages = [];
            }
        }

        // Load document content
        await loadDocument();

        // Render UI components
        renderChatToggle();
        renderChatPanel();
        renderSettingsModal();

        // Setup event listeners
        setupEventListeners();
    }

    /**
     * Load the Kajima document
     */
    async function loadDocument() {
        try {
            const response = await fetch('Example Inputs/Kajima.md');
            if (response.ok) {
                state.documentContent = await response.text();
                console.log('Document loaded successfully');
            } else {
                console.error('Failed to load document');
            }
        } catch (error) {
            console.error('Error loading document:', error);
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
            <span class="chat-toggle-label">Ask AI</span>
        `;
        toggle.setAttribute('aria-label', 'Open AI Chat');
        document.body.appendChild(toggle);
    }

    /**
     * Render the main chat panel
     */
    function renderChatPanel() {
        const panel = document.createElement('div');
        panel.id = 'chatPanel';
        panel.className = 'chat-panel';
        panel.innerHTML = `
            <div class="chat-resize-handle" id="chatResizeHandle" title="Drag to resize"></div>
            <div class="chat-panel-header">
                <div class="chat-panel-title">
                    <span class="chat-ai-icon">${icons.sparkle}</span>
                    <span>Document Assistant</span>
                </div>
                <div class="chat-panel-actions">
                    <button class="chat-action-btn" id="chatExpandBtn" title="Expand">
                        ${icons.expand}
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
                        placeholder="Ask about the investment memo..."
                        rows="1"
                    ></textarea>
                    <button id="chatSendBtn" class="chat-send-btn" disabled>
                        ${icons.send}
                    </button>
                </div>
                <p class="chat-input-hint">Press Enter to send, Shift+Enter for new line</p>
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
                <h3>Investment Memo Assistant</h3>
                <p>I have access to the complete Kajima Wellbeing Real Estate Initiative document. Ask me anything about the investment opportunity, risks, market analysis, or recommendations.</p>
                <div class="starter-questions">
                    <p class="starter-label">Try asking:</p>
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
                        <span>Chat Settings</span>
                    </div>
                    <button class="chat-modal-close" id="modalCloseBtn">
                        ${icons.close}
                    </button>
                </div>
                <div class="chat-modal-body">
                    <div class="form-group">
                        <label for="modelSelect">AI Model</label>
                        <select id="modelSelect" class="form-select">
                            ${modelOptions}
                        </select>
                        <p class="form-hint">
                            ${currentModel.description || 'Select the AI model to use'}
                        </p>
                    </div>
                    ${!hasConfigKey ? `
                    <div class="form-group">
                        <label for="apiKeyInput">OpenRouter API Key</label>
                        <input 
                            type="password" 
                            id="apiKeyInput" 
                            class="form-input"
                            placeholder="sk-or-v1-..."
                            value="${state.apiKey || ''}"
                        />
                        <p class="form-hint">
                            Get your API key from <a href="https://openrouter.ai/keys" target="_blank" rel="noopener">openrouter.ai/keys</a>
                        </p>
                    </div>
                    ` : `
                    <div class="form-group">
                        <label>API Key</label>
                        <div class="api-key-status">
                            <span class="status-dot active"></span>
                            <span>Configured via application settings</span>
                        </div>
                    </div>
                    `}
                </div>
                <div class="chat-modal-footer">
                    <button class="btn-secondary" id="modalCancelBtn">Cancel</button>
                    <button class="btn-primary" id="modalSaveBtn">Save Settings</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    /**
     * Setup all event listeners
     */
    function setupEventListeners() {
        // Toggle button
        document.getElementById('chatToggle').addEventListener('click', togglePanel);
        
        // Close button
        document.getElementById('chatCloseBtn').addEventListener('click', closePanel);
        
        // Expand button
        document.getElementById('chatExpandBtn').addEventListener('click', toggleExpand);
        
        // Settings button
        document.getElementById('chatSettingsBtn').addEventListener('click', openSettings);
        
        // Clear button
        document.getElementById('chatClearBtn').addEventListener('click', clearConversation);
        
        // Send button
        document.getElementById('chatSendBtn').addEventListener('click', sendMessage);
        
        // Input handling
        const input = document.getElementById('chatInput');
        input.addEventListener('input', handleInputChange);
        input.addEventListener('keydown', handleInputKeydown);
        
        // Resize handle
        setupResizeHandle();
        
        // Modal events
        document.getElementById('modalCloseBtn').addEventListener('click', closeSettings);
        document.getElementById('modalCancelBtn').addEventListener('click', closeSettings);
        document.getElementById('modalSaveBtn').addEventListener('click', saveSettings);
        document.querySelector('.chat-modal-backdrop').addEventListener('click', closeSettings);
        
        // Starter questions
        document.getElementById('chatMessages').addEventListener('click', (e) => {
            if (e.target.classList.contains('starter-question')) {
                const question = e.target.dataset.question;
                document.getElementById('chatInput').value = question;
                handleInputChange();
                sendMessage();
            }
            
            // Copy button handling
            if (e.target.closest('.copy-btn')) {
                const btn = e.target.closest('.copy-btn');
                const messageContent = btn.closest('.chat-message').querySelector('.message-content').innerText;
                copyToClipboard(messageContent, btn);
            }
        });
    }

    /**
     * Toggle chat panel visibility
     */
    function togglePanel() {
        state.isOpen = !state.isOpen;
        const panel = document.getElementById('chatPanel');
        const toggle = document.getElementById('chatToggle');
        
        if (state.isOpen) {
            panel.classList.add('open');
            toggle.classList.add('active');
            document.getElementById('chatInput').focus();
        } else {
            panel.classList.remove('open');
            toggle.classList.remove('active');
        }
    }

    /**
     * Close panel
     */
    function closePanel() {
        state.isOpen = false;
        document.getElementById('chatPanel').classList.remove('open');
        document.getElementById('chatToggle').classList.remove('active');
    }

    /**
     * Toggle expand/collapse
     */
    function toggleExpand() {
        state.isExpanded = !state.isExpanded;
        const panel = document.getElementById('chatPanel');
        const expandBtn = document.getElementById('chatExpandBtn');
        
        if (state.isExpanded) {
            panel.classList.add('expanded');
            expandBtn.innerHTML = icons.collapse;
            expandBtn.title = 'Collapse';
        } else {
            panel.classList.remove('expanded');
            expandBtn.innerHTML = icons.expand;
            expandBtn.title = 'Expand';
            // Reset to default or custom width
            panel.style.width = '';
        }
    }

    /**
     * Setup resize handle functionality
     */
    function setupResizeHandle() {
        const handle = document.getElementById('chatResizeHandle');
        const panel = document.getElementById('chatPanel');
        
        let startX, startWidth;
        
        function onMouseDown(e) {
            if (state.isExpanded) return; // Don't resize when expanded
            
            state.isResizing = true;
            startX = e.clientX;
            startWidth = panel.offsetWidth;
            
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
            document.body.style.cursor = 'ew-resize';
            document.body.style.userSelect = 'none';
            panel.classList.add('resizing');
        }
        
        function onMouseMove(e) {
            if (!state.isResizing) return;
            
            const diff = startX - e.clientX;
            const newWidth = Math.min(Math.max(startWidth + diff, 320), window.innerWidth * 0.8);
            panel.style.width = newWidth + 'px';
            state.panelWidth = newWidth;
        }
        
        function onMouseUp() {
            state.isResizing = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
            panel.classList.remove('resizing');
        }
        
        handle.addEventListener('mousedown', onMouseDown);
        
        // Touch support for mobile
        handle.addEventListener('touchstart', (e) => {
            if (state.isExpanded) return;
            const touch = e.touches[0];
            state.isResizing = true;
            startX = touch.clientX;
            startWidth = panel.offsetWidth;
            panel.classList.add('resizing');
        }, { passive: true });
        
        document.addEventListener('touchmove', (e) => {
            if (!state.isResizing) return;
            const touch = e.touches[0];
            const diff = startX - touch.clientX;
            const newWidth = Math.min(Math.max(startWidth + diff, 320), window.innerWidth * 0.8);
            panel.style.width = newWidth + 'px';
            state.panelWidth = newWidth;
        }, { passive: true });
        
        document.addEventListener('touchend', () => {
            if (state.isResizing) {
                state.isResizing = false;
                panel.classList.remove('resizing');
            }
        });
    }

    /**
     * Open settings modal
     */
    function openSettings() {
        const modal = document.getElementById('chatSettingsModal');
        modal.classList.add('open');
        
        // Update model selection
        const modelSelect = document.getElementById('modelSelect');
        if (modelSelect) {
            modelSelect.value = state.selectedModel.id;
        }
        
        // Update API key if input exists
        const apiKeyInput = document.getElementById('apiKeyInput');
        if (apiKeyInput) {
            apiKeyInput.value = localStorage.getItem(DEFAULTS.storageKeys.apiKey) || '';
        }
    }

    /**
     * Close settings modal
     */
    function closeSettings() {
        document.getElementById('chatSettingsModal').classList.remove('open');
    }

    /**
     * Save settings
     */
    function saveSettings() {
        // Save model selection
        const modelSelect = document.getElementById('modelSelect');
        if (modelSelect) {
            const selectedModelId = modelSelect.value;
            localStorage.setItem(DEFAULTS.storageKeys.selectedModel, selectedModelId);
            state.selectedModel = getModels().find(m => m.id === selectedModelId);
        }
        
        // Save API key if input exists
        const apiKeyInput = document.getElementById('apiKeyInput');
        if (apiKeyInput) {
            const key = apiKeyInput.value.trim();
            if (key) {
                localStorage.setItem(DEFAULTS.storageKeys.apiKey, key);
                state.apiKey = key;
            }
        }
        
        closeSettings();
        showNotification('Settings saved successfully');
    }

    /**
     * Handle input changes
     */
    function handleInputChange() {
        const input = document.getElementById('chatInput');
        const sendBtn = document.getElementById('chatSendBtn');
        
        // Auto-resize textarea
        input.style.height = 'auto';
        input.style.height = Math.min(input.scrollHeight, 120) + 'px';
        
        // Enable/disable send button
        sendBtn.disabled = !input.value.trim();
    }

    /**
     * Handle keyboard input
     */
    function handleInputKeydown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    }

    /**
     * Send message to API
     */
    async function sendMessage() {
        const input = document.getElementById('chatInput');
        const userMessage = input.value.trim();
        
        if (!userMessage || state.isLoading) return;
        
        // Refresh API key
        state.apiKey = getApiKey();
        
        if (!state.apiKey) {
            openSettings();
            showNotification('Please configure your API key', 'error');
            return;
        }

        if (!state.documentContent) {
            showNotification('Document not loaded. Please refresh the page.', 'error');
            return;
        }

        // Clear welcome message on first message
        if (state.messages.length === 0) {
            document.getElementById('chatMessages').innerHTML = '';
        }

        // Add user message
        const userMsg = { role: 'user', content: userMessage };
        state.messages.push(userMsg);
        appendMessage(userMsg);
        
        // Clear input
        input.value = '';
        handleInputChange();
        
        // Show loading
        state.isLoading = true;
        showTypingIndicator();
        
        try {
            const response = await callOpenRouter(userMessage);
            
            // Add AI response
            const aiMsg = { role: 'assistant', content: response };
            state.messages.push(aiMsg);
            appendMessage(aiMsg);
            
            // Save messages
            saveMessages();
            
        } catch (error) {
            console.error('API Error:', error);
            appendErrorMessage(error.message);
        } finally {
            state.isLoading = false;
            hideTypingIndicator();
        }
    }

    /**
     * Call OpenRouter API
     */
    async function callOpenRouter(userMessage) {
        const systemPrompt = `You are an expert investment analyst assistant. You have complete access to the following investment memo document. Answer questions accurately based on the document content. Be concise but thorough. Use markdown formatting for better readability (headings, bold, lists). If information is not in the document, say so clearly.

DOCUMENT:
${state.documentContent}`;

        const messages = [
            { role: 'system', content: systemPrompt },
            ...state.messages.slice(-10).map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: userMessage }
        ];

        const response = await fetch(DEFAULTS.apiEndpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${state.apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': window.location.origin,
                'X-Title': 'Investment Memo Dashboard'
            },
            body: JSON.stringify({
                model: state.selectedModel.id,
                messages: messages,
                temperature: 0.7,
                max_tokens: 2048
            })
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.error?.message || `API request failed: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || 'No response received.';
    }

    /**
     * Render a message
     */
    function renderMessage(msg) {
        const isUser = msg.role === 'user';
        const formattedContent = isUser ? escapeHtml(msg.content) : formatMarkdown(msg.content);
        
        return `
            <div class="chat-message ${isUser ? 'user' : 'assistant'}">
                <div class="message-avatar">
                    ${isUser ? 'You' : icons.sparkle}
                </div>
                <div class="message-body">
                    <div class="message-content">${formattedContent}</div>
                    ${!isUser ? `
                        <div class="message-actions">
                            <button class="copy-btn" title="Copy response">
                                ${icons.copy}
                                <span>Copy</span>
                            </button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    /**
     * Escape HTML for user messages
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Format markdown content to rich HTML
     */
    function formatMarkdown(content) {
        if (!content) return '';
        
        let html = content;
        
        // Escape HTML first to prevent XSS
        html = html
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        
        // Code blocks (must be before other processing)
        html = html.replace(/```(\w*)\n?([\s\S]*?)```/g, (match, lang, code) => {
            return `<pre class="code-block"><code>${code.trim()}</code></pre>`;
        });
        
        // Inline code
        html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
        
        // Headers (### Header -> <h3>)
        html = html.replace(/^### (.+)$/gm, '<h4 class="chat-heading">$1</h4>');
        html = html.replace(/^## (.+)$/gm, '<h3 class="chat-heading">$1</h3>');
        html = html.replace(/^# (.+)$/gm, '<h2 class="chat-heading">$1</h2>');
        
        // Bold (handle ** before *)
        html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        
        // Italic
        html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
        
        // Unordered lists - process line by line
        const lines = html.split('\n');
        let inList = false;
        let listItems = [];
        let result = [];
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const listMatch = line.match(/^[\*\-]\s+(.+)$/);
            
            if (listMatch) {
                if (!inList) {
                    inList = true;
                    listItems = [];
                }
                listItems.push(`<li>${listMatch[1]}</li>`);
            } else {
                if (inList) {
                    result.push(`<ul class="chat-list">${listItems.join('')}</ul>`);
                    inList = false;
                    listItems = [];
                }
                result.push(line);
            }
        }
        
        // Close any remaining list
        if (inList) {
            result.push(`<ul class="chat-list">${listItems.join('')}</ul>`);
        }
        
        html = result.join('\n');
        
        // Numbered lists
        const numberedLines = html.split('\n');
        inList = false;
        listItems = [];
        result = [];
        
        for (let i = 0; i < numberedLines.length; i++) {
            const line = numberedLines[i];
            const numMatch = line.match(/^\d+\.\s+(.+)$/);
            
            if (numMatch) {
                if (!inList) {
                    inList = true;
                    listItems = [];
                }
                listItems.push(`<li>${numMatch[1]}</li>`);
            } else {
                if (inList) {
                    result.push(`<ol class="chat-list numbered">${listItems.join('')}</ol>`);
                    inList = false;
                    listItems = [];
                }
                result.push(line);
            }
        }
        
        if (inList) {
            result.push(`<ol class="chat-list numbered">${listItems.join('')}</ol>`);
        }
        
        html = result.join('\n');
        
        // Paragraphs - convert double newlines to paragraph breaks
        html = html.replace(/\n\n+/g, '</p><p>');
        
        // Single newlines to <br> (but not inside lists or pre)
        html = html.replace(/\n/g, '<br>');
        
        // Clean up empty paragraphs and extra breaks
        html = html.replace(/<p><\/p>/g, '');
        html = html.replace(/<br><br>/g, '<br>');
        html = html.replace(/(<\/(?:ul|ol|h[234]|pre)>)<br>/g, '$1');
        html = html.replace(/<br>(<(?:ul|ol|h[234]|pre))/g, '$1');
        
        // Wrap in paragraph if not already wrapped
        if (!html.startsWith('<')) {
            html = `<p>${html}</p>`;
        }
        
        return html;
    }

    /**
     * Append a message to the chat
     */
    function appendMessage(msg) {
        const messagesContainer = document.getElementById('chatMessages');
        const messageHtml = renderMessage(msg);
        messagesContainer.insertAdjacentHTML('beforeend', messageHtml);
        scrollToBottom();
    }

    /**
     * Append an error message
     */
    function appendErrorMessage(error) {
        const messagesContainer = document.getElementById('chatMessages');
        messagesContainer.insertAdjacentHTML('beforeend', `
            <div class="chat-message error">
                <div class="message-body">
                    <div class="message-content error-content">
                        <strong>Error:</strong> ${escapeHtml(error)}
                    </div>
                </div>
            </div>
        `);
        scrollToBottom();
    }

    /**
     * Show typing indicator
     */
    function showTypingIndicator() {
        const messagesContainer = document.getElementById('chatMessages');
        messagesContainer.insertAdjacentHTML('beforeend', `
            <div class="chat-message assistant typing-indicator" id="typingIndicator">
                <div class="message-avatar">${icons.sparkle}</div>
                <div class="message-body">
                    <div class="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        `);
        scrollToBottom();
    }

    /**
     * Hide typing indicator
     */
    function hideTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.remove();
        }
    }

    /**
     * Scroll to bottom of messages
     */
    function scrollToBottom() {
        const messagesContainer = document.getElementById('chatMessages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    /**
     * Clear conversation
     */
    function clearConversation() {
        state.messages = [];
        localStorage.removeItem(DEFAULTS.storageKeys.messages);
        document.getElementById('chatMessages').innerHTML = renderWelcomeMessage();
        showNotification('Conversation cleared');
    }

    /**
     * Save messages to localStorage
     */
    function saveMessages() {
        localStorage.setItem(DEFAULTS.storageKeys.messages, JSON.stringify(state.messages));
    }

    /**
     * Copy to clipboard
     */
    async function copyToClipboard(text, button) {
        try {
            await navigator.clipboard.writeText(text);
            const originalHtml = button.innerHTML;
            button.innerHTML = `${icons.check}<span>Copied!</span>`;
            button.classList.add('copied');
            setTimeout(() => {
                button.innerHTML = originalHtml;
                button.classList.remove('copied');
            }, 2000);
        } catch (err) {
            showNotification('Failed to copy', 'error');
        }
    }

    /**
     * Show notification
     */
    function showNotification(message, type = 'success') {
        // Remove existing notification
        const existing = document.querySelector('.chat-notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = `chat-notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Public API
    return {
        init,
        toggle: togglePanel,
        open: () => { if (!state.isOpen) togglePanel(); },
        close: closePanel
    };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    ChatModule.init();
});

// Expose to window for external access
window.ChatModule = ChatModule;
