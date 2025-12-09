/**
 * Hypothesis Tracker Module
 * Handles UI rendering, state management, and localStorage persistence
 */

const HypothesisTracker = (function() {
    // Version for data migration - increment when hypothesis structure changes
    const CURRENT_VERSION = '2.0';
    
    // localStorage keys
    const STORAGE_KEYS = {
        hypotheses: 'kajima_hypotheses',
        recommendation: 'kajima_recommendation',
        version: 'kajima_version'
    };
    
    /**
     * Check version and clear old data if needed
     */
    function checkVersionAndMigrate() {
        const storedVersion = localStorage.getItem(STORAGE_KEYS.version);
        if (storedVersion !== CURRENT_VERSION) {
            console.log(`Migrating from v${storedVersion || '1.x'} to v${CURRENT_VERSION}: Clearing old hypothesis data`);
            localStorage.removeItem(STORAGE_KEYS.hypotheses);
            localStorage.removeItem(STORAGE_KEYS.recommendation);
            localStorage.setItem(STORAGE_KEYS.version, CURRENT_VERSION);
            return true; // Migration occurred
        }
        return false;
    }

    // Internal state
    let state = {
        hypotheses: [],
        recommendation: null,
        filters: {
            category: 'all',
            status: 'all',
            type: 'all',
            owner: 'all'
        },
        expandedCards: new Set(),
        isLoading: false,
        error: null
    };

    // Icons for the UI
    const icons = {
        refresh: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>`,
        chevronDown: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`,
        chevronUp: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>`,
        check: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
        x: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
        question: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
        warning: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
        arrowRight: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`,
        filter: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>`,
        target: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>`
    };

    /**
     * Initialize the tracker
     */
    function init() {
        checkVersionAndMigrate();
        loadState();
    }

    /**
     * Load state from localStorage
     */
    function loadState() {
        const savedHypotheses = localStorage.getItem(STORAGE_KEYS.hypotheses);
        const savedRecommendation = localStorage.getItem(STORAGE_KEYS.recommendation);

        if (savedHypotheses) {
            try {
                state.hypotheses = JSON.parse(savedHypotheses);
            } catch (e) {
                console.error('Failed to parse saved hypotheses:', e);
                state.hypotheses = JSON.parse(JSON.stringify(initialHypotheses));
            }
        } else {
            // Initialize from hardcoded data
            state.hypotheses = JSON.parse(JSON.stringify(initialHypotheses));
            saveHypotheses();
        }

        if (savedRecommendation) {
            try {
                state.recommendation = JSON.parse(savedRecommendation);
            } catch (e) {
                console.error('Failed to parse saved recommendation:', e);
                state.recommendation = null;
            }
        }
    }

    /**
     * Save hypotheses to localStorage
     */
    function saveHypotheses() {
        localStorage.setItem(STORAGE_KEYS.hypotheses, JSON.stringify(state.hypotheses));
    }

    /**
     * Save recommendation to localStorage
     */
    function saveRecommendation(recommendation) {
        state.recommendation = recommendation;
        localStorage.setItem(STORAGE_KEYS.recommendation, JSON.stringify(recommendation));
    }

    /**
     * Update a hypothesis
     */
    function updateHypothesis(id, updates) {
        const index = state.hypotheses.findIndex(h => h.id === id);
        if (index === -1) return;

        state.hypotheses[index] = {
            ...state.hypotheses[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        saveHypotheses();

        // Trigger re-render of the specific card
        rerenderCard(id);

        // Trigger LLM refresh if outcome changed
        if (updates.outcome !== undefined) {
            HypothesisScorer.triggerAutoRefresh();
        }
    }

    /**
     * Get filtered hypotheses
     */
    function getFilteredHypotheses() {
        return state.hypotheses.filter(h => {
            if (state.filters.category !== 'all' && h.category !== state.filters.category) return false;
            if (state.filters.status !== 'all' && h.status !== state.filters.status) return false;
            if (state.filters.type !== 'all' && h.type !== state.filters.type) return false;
            if (state.filters.owner !== 'all') {
                const owner = h.owner || h.suggestedOwner;
                if (owner !== state.filters.owner) return false;
            }
            return true;
        });
    }

    /**
     * Main render function
     */
    function render() {
        loadState(); // Ensure state is fresh
        
        const container = document.getElementById('contentContainer');
        if (!container) return;

        const killCriteria = getFilteredHypotheses().filter(h => h.type === HypothesisType.KILL_CRITERIA);
        const weighted = getFilteredHypotheses().filter(h => h.type === HypothesisType.WEIGHTED);

        container.innerHTML = `
            <section class="chapter-header">
                <p class="eyebrow">${I18n.t('tracker.due_diligence')}</p>
                <h2 class="chapter-title">${I18n.t('tracker.title')}</h2>
                <p class="chapter-summary">${I18n.t('tracker.summary')}</p>
            </section>

            ${renderRecommendationPanel()}
            ${renderFilterBar()}
            
            <div class="hypothesis-sections">
                <section class="hypothesis-section kill-criteria">
                    <div class="section-header">
                        <div class="section-header-content">
                            <h3 class="section-title">
                                <span class="section-icon kill">${icons.warning}</span>
                                ${I18n.t('tracker.kill_criteria')}
                            </h3>
                            <p class="section-description">${I18n.t('tracker.kill_desc')}</p>
                        </div>
                        <span class="section-count">${killCriteria.length} hypotheses</span>
                    </div>
                    <div class="hypothesis-cards" id="killCriteriaCards">
                        ${killCriteria.length > 0 
                            ? killCriteria.map(h => renderHypothesisCard(h)).join('') 
                            : '<div class="empty-state">No hypotheses found.</div>'}
                    </div>
                </section>

                <section class="hypothesis-section weighted">
                    <div class="section-header">
                        <div class="section-header-content">
                            <h3 class="section-title">
                                <span class="section-icon weight">${icons.target}</span>
                                ${I18n.t('tracker.weighted')}
                            </h3>
                            <p class="section-description">${I18n.t('tracker.weighted_desc')}</p>
                        </div>
                        <span class="section-count">${weighted.length} hypotheses</span>
                    </div>
                    <div class="hypothesis-cards" id="weightedCards">
                        ${weighted.length > 0 
                            ? weighted.map(h => renderHypothesisCard(h)).join('') 
                            : '<div class="empty-state">No hypotheses found.</div>'}
                    </div>
                </section>
            </div>
        `;

        setupGlobalEventListeners();
    }

    /**
     * Get current state
     */
    function getState() {
        return state;
    }

    /**
     * Show loading state
     */
    function showLoading() {
        state.isLoading = true;
        state.error = null;
        rerenderRecommendationPanel();
    }

    /**
     * Hide loading state
     */
    function hideLoading() {
        state.isLoading = false;
        rerenderRecommendationPanel();
    }

    /**
     * Show error message
     */
    function showError(message) {
        state.isLoading = false;
        state.error = message;
        rerenderRecommendationPanel();
    }

    /**
     * Update recommendation display
     */
    function updateRecommendationDisplay(recommendation) {
        saveRecommendation(recommendation);
        state.isLoading = false;
        state.error = null;
        rerenderRecommendationPanel();
    }

    /**
     * Re-render just the recommendation panel
     */
    function rerenderRecommendationPanel() {
        const container = document.querySelector('.tracker-rec-panel');
        if (container) {
            container.outerHTML = renderRecommendationPanel();
            // Re-attach listener
            const refreshBtn = document.getElementById('refreshRecBtn');
            if (refreshBtn) {
                refreshBtn.addEventListener('click', () => {
                    HypothesisScorer.triggerAutoRefresh();
                });
            }
        } else {
            // Fallback if panel doesn't exist (e.g. first load)
            render(); 
        }
    }

    /**
     * Render recommendation panel
     */
    function renderRecommendationPanel() {
        if (state.isLoading) {
            return `
                <div class="tracker-rec-panel">
                    <div class="rec-content" style="width: 100%; text-align: center; padding: 2rem;">
                        <div class="chat-loading-dot" style="display: inline-block; margin: 0 2px;"></div>
                        <div class="chat-loading-dot" style="display: inline-block; margin: 0 2px;"></div>
                        <div class="chat-loading-dot" style="display: inline-block; margin: 0 2px;"></div>
                        <p style="margin-top: 1rem; color: var(--text-secondary);">Generating AI Recommendation...</p>
                    </div>
                </div>
            `;
        }

        if (state.error) {
            return `
                <div class="tracker-rec-panel" style="border-color: var(--danger-color); background: #fef2f2;">
                    <div class="rec-content">
                        <h3 style="color: var(--danger-color);">Error</h3>
                        <p>${state.error}</p>
                        <button class="btn-secondary btn-sm" onclick="HypothesisScorer.triggerAutoRefresh()" style="margin-top: 1rem;">
                            Retry
                        </button>
                    </div>
                </div>
            `;
        }

        // If no recommendation from LLM, show default or loading
        const rec = state.recommendation || {
            score: '...',
            label: I18n.t('common.loading'),
            title: 'AI Assessment Pending',
            logic: 'Interact with hypotheses to generate an updated recommendation.'
        };

        // Ensure fields exist to avoid "undefined"
        const score = rec.score || rec.verdict?.replace(/_/g, ' ') || '...';
        const label = rec.label || (rec.confidence ? `${rec.confidence} CONFIDENCE` : '') || '';
        const title = rec.title || 'Recommendation';
        const logic = rec.logic || rec.reasoning || '';

        return `
            <div class="tracker-rec-panel">
                <div class="rec-score-box">
                    <div class="rec-score">${score}</div>
                    <div class="rec-label-small">${label}</div>
                </div>
                <div class="rec-content">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <h3>${title}</h3>
                        <button class="btn-secondary btn-sm" id="refreshRecBtn" title="Force Refresh">
                            ${icons.refresh}
                        </button>
                    </div>
                    <p class="rec-logic">${logic}</p>
                </div>
            </div>
        `;
    }

    /**
     * Render filter bar
     */
    function renderFilterBar() {
        return `
            <div class="filter-bar">
                <span class="filter-icon">${icons.filter}</span>
                <span class="filter-label">${I18n.t('tracker.filters')}:</span>
                
                <select class="filter-select" id="filterCategory">
                    <option value="all">${I18n.t('tracker.filter_category')}: ${I18n.t('tracker.all')}</option>
                    ${Object.values(HypothesisCategory).map(c => `<option value="${c}" ${state.filters.category === c ? 'selected' : ''}>${c}</option>`).join('')}
                </select>

                <select class="filter-select" id="filterStatus">
                    <option value="all">${I18n.t('tracker.filter_status')}: ${I18n.t('tracker.all')}</option>
                    ${Object.entries(StatusConfig).map(([k, v]) => `<option value="${k}" ${state.filters.status === k ? 'selected' : ''}>${I18n.t('status.' + k.toLowerCase()) || v.label}</option>`).join('')}
                </select>

                <div style="margin-left: auto; display: flex; gap: 0.5rem;">
                    <button class="btn-secondary" onclick="alert('Export feature pending')">${I18n.t('tracker.btn_export')}</button>
                    <button class="btn-primary" onclick="alert('Add feature pending')">+ ${I18n.t('tracker.btn_add')}</button>
                </div>
            </div>
        `;
    }

    /**
     * Render a single hypothesis card
     */
    function renderHypothesisCard(h) {
        const isExpanded = state.expandedCards.has(h.id);
        const statusConfig = StatusConfig[h.status];
        const outcomeConfig = OutcomeConfig[h.outcome];
        const owner = h.owner || h.suggestedOwner;
        
        // Use i18n for labels
        const statusLabel = I18n.t('status.' + h.status.toLowerCase()) || statusConfig.label;
        const outcomeLabel = I18n.t('outcome.' + h.outcome.toLowerCase()) || outcomeConfig.label;

        return `
            <div class="h-card ${isExpanded ? 'expanded' : ''}" id="card-${h.id}">
                <div class="card-summary" onclick="HypothesisTracker.toggleCard('${h.id}')">
                    <span class="h-id">${h.id}</span>
                    <div class="h-content">
                        <h4>${h.title}</h4>
                        <div class="h-meta">
                            <span>${h.category}</span>
                            <span>•</span>
                            <span>${owner}</span>
                        </div>
                    </div>
                    <div class="h-status">
                        <span class="status-pill" style="background: ${statusConfig.color}20; color: ${statusConfig.color}">
                            ${statusLabel}
                        </span>
                    </div>
                    <div class="h-outcome">
                        <div class="outcome-pill" 
                             style="background: ${outcomeConfig.color};" 
                             title="${outcomeLabel}">
                            ${outcomeConfig.icon}
                        </div>
                    </div>
                    <div class="expand-icon">
                        ${isExpanded ? icons.chevronUp : icons.chevronDown}
                    </div>
                </div>
                ${isExpanded ? renderExpandedContent(h) : ''}
            </div>
        `;
    }

    /**
     * Render expanded card content
     */
    function renderExpandedContent(h) {
        const statusOptions = Object.entries(StatusConfig).map(([key, config]) => {
            const label = I18n.t('status.' + key.toLowerCase()) || config.label;
            return `<label class="radio-option ${h.status === key ? 'active' : ''}">
                <input type="radio" name="status-${h.id}" value="${key}" ${h.status === key ? 'checked' : ''}>
                <span class="radio-label">${label}</span>
            </label>`;
        }).join('');

        const outcomeOptions = Object.entries(OutcomeConfig).map(([key, config]) => {
            const label = I18n.t('outcome.' + key.toLowerCase()) || config.label;
            return `<label class="radio-option outcome-radio ${key} ${h.outcome === key ? 'active' : ''}">
                <input type="radio" name="outcome-${h.id}" value="${key}" ${h.outcome === key ? 'checked' : ''}>
                <span class="radio-icon">${config.icon}</span>
                <span class="radio-label">${label}</span>
            </label>`;
        }).join('');

        return `
            <div class="card-expanded">
                <div class="expanded-section description">
                    <p class="description-text">${h.description}</p>
                </div>

                <div class="expanded-section assignment">
                    <h5>${I18n.t('tracker.assignment')}</h5>
                    <div class="assignment-fields">
                        <div class="field-group">
                            <label for="owner-${h.id}">${I18n.t('tracker.owner')}</label>
                            <input type="text" 
                                   id="owner-${h.id}" 
                                   class="field-input owner-input" 
                                   value="${h.owner || ''}" 
                                   placeholder="${h.suggestedOwner || I18n.t('tracker.placeholder_owner')}"
                                   data-hypothesis="${h.id}">
                        </div>
                        <div class="field-group">
                            <label for="due-${h.id}">${I18n.t('tracker.due_date')}</label>
                            <input type="date" 
                                   id="due-${h.id}" 
                                   class="field-input date-input" 
                                   value="${h.dueDate || ''}"
                                   data-hypothesis="${h.id}">
                        </div>
                    </div>
                </div>

                <div class="expanded-section status-section">
                    <h5>${I18n.t('tracker.status')}</h5>
                    <div class="radio-group status-radios" data-hypothesis="${h.id}">
                        ${statusOptions}
                    </div>
                </div>

                <div class="expanded-section outcome-section">
                    <h5>${I18n.t('tracker.outcome')}</h5>
                    <div class="radio-group outcome-radios" data-hypothesis="${h.id}">
                        ${outcomeOptions}
                    </div>
                </div>

                <div class="expanded-section notes-section">
                    <h5>${I18n.t('tracker.notes')}</h5>
                    <textarea class="notes-textarea" 
                              id="notes-${h.id}" 
                              placeholder="${I18n.t('tracker.placeholder_notes')}"
                              data-hypothesis="${h.id}">${h.notes || ''}</textarea>
                </div>

                <div class="expanded-section validation-section">
                    <div class="validation-info">
                        <span class="validation-label">${I18n.t('tracker.validation')}:</span>
                        <p class="validation-text">${h.validationMethod || I18n.t('tracker.not_specified')}</p>
                    </div>
                    ${h.successGate ? `
                    <div class="gate-info success-gate">
                        <span class="gate-label">✓ Success Gate:</span>
                        <p class="gate-text">${h.successGate}</p>
                    </div>
                    ` : ''}
                    ${h.failureAction ? `
                    <div class="gate-info failure-action">
                        <span class="gate-label">✗ If Failed:</span>
                        <p class="gate-text">${h.failureAction}</p>
                    </div>
                    ` : ''}
                    <div class="source-info">
                        <span class="source-label">${I18n.t('tracker.source')}:</span>
                        <span class="source-text">${h.sourceSection || I18n.t('tracker.not_specified')}</span>
                    </div>
                </div>

                ${h.updatedAt ? `
                    <div class="card-footer">
                        <span class="updated-at">${I18n.t('tracker.last_updated')}: ${getTimeAgo(new Date(h.updatedAt))}</span>
                    </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * Re-render a specific card
     */
    function rerenderCard(id) {
        const hypothesis = state.hypotheses.find(h => h.id === id);
        if (!hypothesis) return;

        const card = document.getElementById(`card-${id}`);
        if (!card) return;

        const newCard = document.createElement('div');
        newCard.innerHTML = renderHypothesisCard(hypothesis);
        const newCardElement = newCard.firstElementChild;
        
        card.replaceWith(newCardElement);
        
        // Re-setup event listeners for this card
        setupCardEventListeners(newCardElement);
    }

    /**
     * Setup event listeners
     */
    function setupGlobalEventListeners() {
        const filters = ['filterCategory', 'filterStatus'];
        filters.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('change', (e) => {
                    const key = id.replace('filter', '').toLowerCase();
                    state.filters[key] = e.target.value;
                    render(); // Full re-render on filter change
                });
            }
        });

        const refreshBtn = document.getElementById('refreshRecBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                HypothesisScorer.triggerAutoRefresh();
            });
        }

        // Setup listeners for existing expanded cards
        document.querySelectorAll('.h-card.expanded').forEach(card => {
            setupCardEventListeners(card);
        });
    }

    /**
     * Setup listeners for a specific card
     */
    function setupCardEventListeners(cardElement) {
        // Status Radios
        cardElement.querySelectorAll('.status-radios input').forEach(radio => {
            radio.addEventListener('change', (e) => {
                const id = e.target.name.split('-')[1];
                updateHypothesis(id, { status: e.target.value });
            });
        });

        // Outcome Radios
        cardElement.querySelectorAll('.outcome-radios input').forEach(radio => {
            radio.addEventListener('change', (e) => {
                const id = e.target.name.split('-')[1];
                updateHypothesis(id, { outcome: e.target.value });
            });
        });

        // Inputs
        cardElement.querySelectorAll('input[type="text"], input[type="date"], textarea').forEach(input => {
            input.addEventListener('change', (e) => {
                const id = e.target.dataset.hypothesis;
                const field = e.target.id.split('-')[0]; // owner, due, notes
                let fieldName = field;
                if (field === 'due') fieldName = 'dueDate';
                
                updateHypothesis(id, { [fieldName]: e.target.value });
            });
        });
    }

    /**
     * Toggle card expansion
     */
    function toggleCard(id) {
        if (state.expandedCards.has(id)) {
            state.expandedCards.delete(id);
        } else {
            state.expandedCards.add(id);
        }
        rerenderCard(id);
    }

    /**
     * Get time ago string
     */
    function getTimeAgo(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        let interval = seconds / 31536000;

        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return "just now";
    }

    // Public API
    return {
        init,
        render,
        updateHypothesis,
        saveRecommendation,
        getHypotheses: () => state.hypotheses,
        toggleCard,
        // Scorer API
        getState,
        showLoading,
        hideLoading,
        showError,
        updateRecommendationDisplay
    };
})();
