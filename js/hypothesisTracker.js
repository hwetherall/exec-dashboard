/**
 * Hypothesis Tracker Module
 * Handles UI rendering, state management, and localStorage persistence
 */

const HypothesisTracker = (function() {
    // localStorage keys
    const STORAGE_KEYS = {
        hypotheses: 'kajima_hypotheses',
        recommendation: 'kajima_recommendation'
    };

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
        expandedCards: new Set()
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
        filter: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>`
    };

    /**
     * Initialize the tracker
     */
    function init() {
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
                <p class="eyebrow">Due Diligence</p>
                <h2 class="chapter-title">Hypothesis Tracker</h2>
                <p class="chapter-summary">Track and validate key investment hypotheses. Kill criteria must be validated before proceeding. The recommendation updates dynamically based on your assessments.</p>
            </section>

            ${renderRecommendationPanel()}
            ${renderFilterBar()}
            
            <div class="hypothesis-sections">
                <section class="hypothesis-section kill-criteria">
                    <div class="section-header">
                        <div class="section-header-content">
                            <h3 class="section-title">
                                <span class="section-icon kill">${icons.warning}</span>
                                Kill Criteria
                            </h3>
                            <p class="section-description">These hypotheses must be validated. If any is invalidated, the recommendation will be NO-GO.</p>
                        </div>
                        <span class="section-count">${killCriteria.length} hypotheses</span>
                    </div>
                    <div class="hypothesis-cards" id="killCriteriaCards">
                        ${killCriteria.length > 0 
                            ? killCriteria.map(h => renderHypothesisCard(h)).join('') 
                            : '<p class="no-results">No hypotheses match the current filters.</p>'}
                    </div>
                </section>

                <section class="hypothesis-section weighted">
                    <div class="section-header">
                        <div class="section-header-content">
                            <h3 class="section-title">
                                <span class="section-icon weighted">${icons.arrowRight}</span>
                                Weighted Hypotheses
                            </h3>
                            <p class="section-description">These contribute to the overall assessment but are not individually deal-breaking.</p>
                        </div>
                        <span class="section-count">${weighted.length} hypotheses</span>
                    </div>
                    <div class="hypothesis-cards" id="weightedCards">
                        ${weighted.length > 0 
                            ? weighted.map(h => renderHypothesisCard(h)).join('') 
                            : '<p class="no-results">No hypotheses match the current filters.</p>'}
                    </div>
                </section>
            </div>
        `;

        // Setup event listeners
        setupEventListeners();
    }

    /**
     * Render the recommendation panel
     */
    function renderRecommendationPanel() {
        const rec = state.recommendation;
        const allHypotheses = state.hypotheses;
        const killCriteria = allHypotheses.filter(h => h.type === HypothesisType.KILL_CRITERIA);
        const assessed = getAssessedCount(allHypotheses);
        const killCounts = countByOutcome(killCriteria);

        const hasRecommendation = rec && rec.verdict;
        const verdictClass = hasRecommendation ? rec.verdict.toLowerCase().replace(/_/g, '-') : 'pending';
        
        const verdictLabels = {
            'GO': 'GO',
            'NO_GO': 'NO GO',
            'CONTINUE_DD': 'CONTINUE DUE DILIGENCE',
            'PROCEED_WITH_CAUTION': 'PROCEED WITH CAUTION'
        };

        const verdictIcons = {
            'GO': icons.check,
            'NO_GO': icons.x,
            'CONTINUE_DD': icons.arrowRight,
            'PROCEED_WITH_CAUTION': icons.warning
        };

        const timeAgo = rec?.updatedAt ? getTimeAgo(new Date(rec.updatedAt)) : 'Never';

        return `
            <div class="recommendation-panel ${verdictClass}" id="recommendationPanel">
                <div class="recommendation-header">
                    <div class="recommendation-title">
                        <h3>Investment Recommendation</h3>
                        <p class="recommendation-subtitle">AI-powered analysis based on hypothesis outcomes</p>
                    </div>
                    <button class="refresh-btn" id="refreshRecommendation" title="Refresh recommendation">
                        ${icons.refresh}
                        <span>Refresh</span>
                    </button>
                </div>

                <div class="recommendation-content">
                    <div class="verdict-section">
                        <div class="verdict-badge ${verdictClass}">
                            <span class="verdict-icon">${hasRecommendation ? verdictIcons[rec.verdict] || '' : '?'}</span>
                            <span class="verdict-text">${hasRecommendation ? verdictLabels[rec.verdict] || rec.verdict : 'Not Yet Analyzed'}</span>
                        </div>
                        ${rec?.confidence ? `<span class="confidence-badge ${rec.confidence.toLowerCase()}">${rec.confidence} Confidence</span>` : ''}
                    </div>

                    ${hasRecommendation ? `
                        <div class="reasoning-section">
                            <p class="reasoning-text">${rec.reasoning || ''}</p>
                        </div>

                        ${rec.priorities?.length ? `
                            <div class="priorities-section">
                                <h4>Priority Actions</h4>
                                <ul class="priorities-list">
                                    ${rec.priorities.map(p => `<li>${p}</li>`).join('')}
                                </ul>
                            </div>
                        ` : ''}

                        ${rec.concerns?.length ? `
                            <div class="concerns-section">
                                <h4>Key Concerns</h4>
                                <ul class="concerns-list">
                                    ${rec.concerns.map(c => `<li>${c}</li>`).join('')}
                                </ul>
                            </div>
                        ` : ''}
                    ` : `
                        <div class="reasoning-section empty">
                            <p class="reasoning-text">Click "Refresh" to generate an AI-powered investment recommendation based on your hypothesis assessments.</p>
                        </div>
                    `}
                </div>

                <div class="recommendation-footer">
                    <div class="coverage-stats">
                        <div class="stat">
                            <span class="stat-label">Coverage</span>
                            <span class="stat-value">${assessed}/${allHypotheses.length} assessed</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">Kill Criteria</span>
                            <span class="stat-value">
                                <span class="kill-stat validated">${killCounts.validated} ✓</span>
                                <span class="kill-stat invalidated">${killCounts.invalidated} ✗</span>
                                <span class="kill-stat pending">${killCounts.pending} pending</span>
                            </span>
                        </div>
                    </div>
                    <div class="last-updated">
                        Last updated: ${timeAgo}
                    </div>
                </div>

                <div class="recommendation-loading" id="recommendationLoading" style="display: none;">
                    <div class="loading-spinner"></div>
                    <p>Analyzing hypotheses...</p>
                </div>
            </div>
        `;
    }

    /**
     * Render the filter bar
     */
    function renderFilterBar() {
        const categories = Object.entries(CategoryConfig);
        const statuses = Object.entries(StatusConfig);
        const owners = getUniqueOwners(state.hypotheses);

        // Count hypotheses per filter option
        const categoryCounts = {};
        const statusCounts = {};
        const typeCounts = { kill_criteria: 0, weighted: 0 };
        const ownerCounts = {};

        state.hypotheses.forEach(h => {
            categoryCounts[h.category] = (categoryCounts[h.category] || 0) + 1;
            statusCounts[h.status] = (statusCounts[h.status] || 0) + 1;
            typeCounts[h.type] = (typeCounts[h.type] || 0) + 1;
            const owner = h.owner || h.suggestedOwner;
            if (owner) ownerCounts[owner] = (ownerCounts[owner] || 0) + 1;
        });

        return `
            <div class="filter-bar" id="filterBar">
                <div class="filter-icon">${icons.filter}</div>
                
                <div class="filter-group">
                    <label for="filterCategory">Category</label>
                    <select id="filterCategory" class="filter-select">
                        <option value="all">All Categories (${state.hypotheses.length})</option>
                        ${categories.map(([key, config]) => 
                            `<option value="${key}" ${state.filters.category === key ? 'selected' : ''}>
                                ${config.label} (${categoryCounts[key] || 0})
                            </option>`
                        ).join('')}
                    </select>
                </div>

                <div class="filter-group">
                    <label for="filterStatus">Status</label>
                    <select id="filterStatus" class="filter-select">
                        <option value="all">All Statuses (${state.hypotheses.length})</option>
                        ${statuses.map(([key, config]) => 
                            `<option value="${key}" ${state.filters.status === key ? 'selected' : ''}>
                                ${config.label} (${statusCounts[key] || 0})
                            </option>`
                        ).join('')}
                    </select>
                </div>

                <div class="filter-group">
                    <label for="filterType">Type</label>
                    <select id="filterType" class="filter-select">
                        <option value="all">All Types (${state.hypotheses.length})</option>
                        <option value="kill_criteria" ${state.filters.type === 'kill_criteria' ? 'selected' : ''}>
                            Kill Criteria (${typeCounts.kill_criteria})
                        </option>
                        <option value="weighted" ${state.filters.type === 'weighted' ? 'selected' : ''}>
                            Weighted (${typeCounts.weighted})
                        </option>
                    </select>
                </div>

                <div class="filter-group">
                    <label for="filterOwner">Owner</label>
                    <select id="filterOwner" class="filter-select">
                        <option value="all">All Owners (${state.hypotheses.length})</option>
                        ${owners.map(owner => 
                            `<option value="${owner}" ${state.filters.owner === owner ? 'selected' : ''}>
                                ${owner} (${ownerCounts[owner] || 0})
                            </option>`
                        ).join('')}
                    </select>
                </div>

                <button class="filter-reset" id="resetFilters" ${Object.values(state.filters).every(v => v === 'all') ? 'disabled' : ''}>
                    Reset
                </button>
            </div>
        `;
    }

    /**
     * Render a hypothesis card
     */
    function renderHypothesisCard(hypothesis) {
        const h = hypothesis;
        const isExpanded = state.expandedCards.has(h.id);
        const categoryConfig = CategoryConfig[h.category];
        const statusConfig = StatusConfig[h.status];
        const outcomeConfig = OutcomeConfig[h.outcome];
        const displayOwner = h.owner || h.suggestedOwner || 'Unassigned';
        const displayDate = h.dueDate ? formatDate(h.dueDate) : (h.suggestedDueDays ? `+${h.suggestedDueDays} days` : 'No date');

        return `
            <div class="hypothesis-card ${isExpanded ? 'expanded' : ''} ${h.type}" data-id="${h.id}" id="card-${h.id}">
                <div class="card-header" data-toggle="${h.id}">
                    <div class="card-header-left">
                        <span class="category-tag" style="background-color: ${categoryConfig.color}20; color: ${categoryConfig.color}; border-color: ${categoryConfig.color}40;">
                            ${categoryConfig.label}
                        </span>
                        <h4 class="card-title">${h.title}</h4>
                    </div>
                    <div class="card-header-right">
                        <span class="expand-icon">${isExpanded ? icons.chevronUp : icons.chevronDown}</span>
                    </div>
                </div>

                <div class="card-meta">
                    <span class="meta-item owner">
                        <span class="meta-label">Owner:</span> ${displayOwner}
                    </span>
                    <span class="meta-divider">|</span>
                    <span class="meta-item due">
                        <span class="meta-label">Due:</span> ${displayDate}
                    </span>
                    <span class="meta-divider">|</span>
                    <span class="meta-item status">
                        <span class="status-dot" style="background-color: ${statusConfig.color};"></span>
                        ${statusConfig.label}
                    </span>
                </div>

                <div class="outcome-buttons" data-hypothesis="${h.id}">
                    ${renderOutcomeButtons(h)}
                </div>

                ${isExpanded ? renderExpandedContent(h) : ''}
            </div>
        `;
    }

    /**
     * Render outcome buttons
     */
    function renderOutcomeButtons(h) {
        const outcomes = [
            { key: HypothesisOutcome.PENDING, label: 'Pending', icon: '○' },
            { key: HypothesisOutcome.VALIDATED, label: 'Validated', icon: '✓' },
            { key: HypothesisOutcome.INVALIDATED, label: 'Invalidated', icon: '✗' },
            { key: HypothesisOutcome.PARTIALLY_VALIDATED, label: 'Partial', icon: '◐' },
            { key: HypothesisOutcome.INCONCLUSIVE, label: '?', icon: '?' }
        ];

        return outcomes.map(o => `
            <button class="outcome-btn ${o.key} ${h.outcome === o.key ? 'active' : ''}" 
                    data-outcome="${o.key}" 
                    data-hypothesis="${h.id}"
                    title="${o.label}">
                <span class="outcome-icon">${o.icon}</span>
                <span class="outcome-label">${o.label}</span>
            </button>
        `).join('');
    }

    /**
     * Render expanded card content
     */
    function renderExpandedContent(h) {
        const statusOptions = Object.entries(StatusConfig).map(([key, config]) => 
            `<label class="radio-option ${h.status === key ? 'active' : ''}">
                <input type="radio" name="status-${h.id}" value="${key}" ${h.status === key ? 'checked' : ''}>
                <span class="radio-label">${config.label}</span>
            </label>`
        ).join('');

        const outcomeOptions = Object.entries(OutcomeConfig).map(([key, config]) => 
            `<label class="radio-option outcome-radio ${key} ${h.outcome === key ? 'active' : ''}">
                <input type="radio" name="outcome-${h.id}" value="${key}" ${h.outcome === key ? 'checked' : ''}>
                <span class="radio-icon">${config.icon}</span>
                <span class="radio-label">${config.label}</span>
            </label>`
        ).join('');

        return `
            <div class="card-expanded">
                <div class="expanded-section description">
                    <p class="description-text">${h.description}</p>
                </div>

                <div class="expanded-section assignment">
                    <h5>Assignment</h5>
                    <div class="assignment-fields">
                        <div class="field-group">
                            <label for="owner-${h.id}">Owner</label>
                            <input type="text" 
                                   id="owner-${h.id}" 
                                   class="field-input owner-input" 
                                   value="${h.owner || ''}" 
                                   placeholder="${h.suggestedOwner || 'Assign owner...'}"
                                   data-hypothesis="${h.id}">
                        </div>
                        <div class="field-group">
                            <label for="due-${h.id}">Due Date</label>
                            <input type="date" 
                                   id="due-${h.id}" 
                                   class="field-input date-input" 
                                   value="${h.dueDate || ''}"
                                   data-hypothesis="${h.id}">
                        </div>
                    </div>
                </div>

                <div class="expanded-section status-section">
                    <h5>Status</h5>
                    <div class="radio-group status-radios" data-hypothesis="${h.id}">
                        ${statusOptions}
                    </div>
                </div>

                <div class="expanded-section outcome-section">
                    <h5>Outcome</h5>
                    <div class="radio-group outcome-radios" data-hypothesis="${h.id}">
                        ${outcomeOptions}
                    </div>
                </div>

                <div class="expanded-section notes-section">
                    <h5>Notes</h5>
                    <textarea class="notes-textarea" 
                              id="notes-${h.id}" 
                              placeholder="Add evidence, findings, links..."
                              data-hypothesis="${h.id}">${h.notes || ''}</textarea>
                </div>

                <div class="expanded-section validation-section">
                    <div class="validation-info">
                        <span class="validation-label">Validation Method:</span>
                        <p class="validation-text">${h.validationMethod || 'Not specified'}</p>
                    </div>
                    <div class="source-info">
                        <span class="source-label">Source:</span>
                        <span class="source-text">${h.sourceSection || 'Not specified'}</span>
                    </div>
                </div>

                ${h.updatedAt ? `
                    <div class="card-footer">
                        <span class="updated-at">Last updated: ${getTimeAgo(new Date(h.updatedAt))}</span>
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
    function setupEventListeners() {
        // Refresh recommendation button
        const refreshBtn = document.getElementById('refreshRecommendation');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                HypothesisScorer.generateRecommendation(state.hypotheses);
            });
        }

        // Filter changes
        const filterCategory = document.getElementById('filterCategory');
        const filterStatus = document.getElementById('filterStatus');
        const filterType = document.getElementById('filterType');
        const filterOwner = document.getElementById('filterOwner');
        const resetFilters = document.getElementById('resetFilters');

        if (filterCategory) {
            filterCategory.addEventListener('change', (e) => {
                state.filters.category = e.target.value;
                render();
            });
        }

        if (filterStatus) {
            filterStatus.addEventListener('change', (e) => {
                state.filters.status = e.target.value;
                render();
            });
        }

        if (filterType) {
            filterType.addEventListener('change', (e) => {
                state.filters.type = e.target.value;
                render();
            });
        }

        if (filterOwner) {
            filterOwner.addEventListener('change', (e) => {
                state.filters.owner = e.target.value;
                render();
            });
        }

        if (resetFilters) {
            resetFilters.addEventListener('click', () => {
                state.filters = { category: 'all', status: 'all', type: 'all', owner: 'all' };
                render();
            });
        }

        // Setup card event listeners
        document.querySelectorAll('.hypothesis-card').forEach(card => {
            setupCardEventListeners(card);
        });
    }

    /**
     * Setup event listeners for a specific card
     */
    function setupCardEventListeners(card) {
        const id = card.dataset.id;

        // Card toggle (expand/collapse)
        const header = card.querySelector('.card-header');
        if (header) {
            header.addEventListener('click', () => {
                if (state.expandedCards.has(id)) {
                    state.expandedCards.delete(id);
                } else {
                    state.expandedCards.add(id);
                }
                rerenderCard(id);
            });
        }

        // Outcome buttons (quick access)
        card.querySelectorAll('.outcome-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const outcome = btn.dataset.outcome;
                const hypothesisId = btn.dataset.hypothesis;
                updateHypothesis(hypothesisId, { outcome });
            });
        });

        // Owner input
        const ownerInput = card.querySelector('.owner-input');
        if (ownerInput) {
            ownerInput.addEventListener('change', (e) => {
                updateHypothesis(e.target.dataset.hypothesis, { owner: e.target.value });
            });
        }

        // Date input
        const dateInput = card.querySelector('.date-input');
        if (dateInput) {
            dateInput.addEventListener('change', (e) => {
                updateHypothesis(e.target.dataset.hypothesis, { dueDate: e.target.value || null });
            });
        }

        // Status radios
        card.querySelectorAll('.status-radios input[type="radio"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                const hypothesisId = e.target.closest('.radio-group').dataset.hypothesis;
                updateHypothesis(hypothesisId, { status: e.target.value });
            });
        });

        // Outcome radios (in expanded view)
        card.querySelectorAll('.outcome-radios input[type="radio"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                const hypothesisId = e.target.closest('.radio-group').dataset.hypothesis;
                updateHypothesis(hypothesisId, { outcome: e.target.value });
            });
        });

        // Notes textarea
        const notesTextarea = card.querySelector('.notes-textarea');
        if (notesTextarea) {
            // Debounce notes saving
            let notesTimeout;
            notesTextarea.addEventListener('input', (e) => {
                clearTimeout(notesTimeout);
                notesTimeout = setTimeout(() => {
                    updateHypothesis(e.target.dataset.hypothesis, { notes: e.target.value });
                }, 500);
            });
        }
    }

    /**
     * Show loading state on recommendation panel
     */
    function showLoading() {
        const loading = document.getElementById('recommendationLoading');
        const refreshBtn = document.getElementById('refreshRecommendation');
        if (loading) loading.style.display = 'flex';
        if (refreshBtn) refreshBtn.disabled = true;
    }

    /**
     * Hide loading state on recommendation panel
     */
    function hideLoading() {
        const loading = document.getElementById('recommendationLoading');
        const refreshBtn = document.getElementById('refreshRecommendation');
        if (loading) loading.style.display = 'none';
        if (refreshBtn) refreshBtn.disabled = false;
    }

    /**
     * Update recommendation display
     */
    function updateRecommendationDisplay(recommendation) {
        saveRecommendation(recommendation);
        
        // Re-render just the recommendation panel
        const panel = document.getElementById('recommendationPanel');
        if (panel) {
            const newPanel = document.createElement('div');
            newPanel.innerHTML = renderRecommendationPanel();
            panel.replaceWith(newPanel.firstElementChild);
            
            // Re-attach refresh button listener
            const refreshBtn = document.getElementById('refreshRecommendation');
            if (refreshBtn) {
                refreshBtn.addEventListener('click', () => {
                    HypothesisScorer.generateRecommendation(state.hypotheses);
                });
            }
        }
    }

    /**
     * Show error in recommendation panel
     */
    function showError(message) {
        const panel = document.getElementById('recommendationPanel');
        if (panel) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'recommendation-error';
            errorDiv.innerHTML = `<p>${message}</p>`;
            
            const content = panel.querySelector('.recommendation-content');
            if (content) {
                const existing = content.querySelector('.recommendation-error');
                if (existing) existing.remove();
                content.insertBefore(errorDiv, content.firstChild);
            }
        }
        hideLoading();
    }

    // Utility functions
    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    function getTimeAgo(date) {
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
        return formatDate(date.toISOString());
    }

    // Public API
    return {
        init,
        render,
        updateHypothesis,
        saveRecommendation,
        updateRecommendationDisplay,
        showLoading,
        hideLoading,
        showError,
        getState: () => state
    };
})();

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    HypothesisTracker.init();
});

// Expose to window
window.HypothesisTracker = HypothesisTracker;

