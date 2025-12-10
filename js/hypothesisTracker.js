/**
 * Validation Dashboard - Unified Hypothesis Tracker + Action Plan
 * A "WOW" experience for executives with real-time updates
 */

const HypothesisTracker = (function() {
    // Version for data migration
    const CURRENT_VERSION = '4.0';
    
    // localStorage keys
    const STORAGE_KEYS = {
        hypotheses: 'kajima_hypotheses_v4',
        recommendation: 'kajima_recommendation_v4',
        version: 'kajima_version'
    };
    
    // Action Plan data mapped to hypotheses
    const actionPlanMap = {
        "H001": {
            step: 1,
            title: "Validate Regulatory Viability (APPI)",
            rationale: "The core value proposition relies on biometric data and behavioral tracking. Japan's APPI may classify this as 'special care-required' data, requiring impractical individual consent.",
            activities: [
                "Commission a formal legal opinion on the specific sensor stack regarding workplace consent requirements",
                "Draft a 'Data Governance Charter' defining anonymization protocols for edge processing",
                "Confirm if a 'Safe Harbor' exists for aggregated data usage without individual opt-in"
            ],
            fallback: "If blocked, pivot immediately to 'Option A: Design Focus' (remove sensors).",
            timeline: "30 days",
            priority: "critical"
        },
        "H002": {
            step: 2,
            title: "Confirm Commercial Willingness to Pay",
            rationale: "There is currently zero direct evidence that Japanese corporate tenants will pay the projected 4.4–7.7% premium for monitoring technology versus standard design.",
            activities: [
                "Conduct deep-dive interviews with 10 corporate real estate directors targeting the 'Wellbeing Premium' hypothesis",
                "Pitch three distinct offer tiers (Design-only vs. Tech-enabled) to existing clients",
                "Secure non-binding Letters of Intent (LOIs) that explicitly itemize the technology premium"
            ],
            fallback: "If customers refuse premiums, pivot to 'Option C: Consulting Services.'",
            timeline: "60 days",
            priority: "critical"
        },
        "H003": {
            step: 3,
            title: "Validate Installation Unit Economics",
            rationale: "Installation cost estimates vary from ¥15M (model) to ¥83M (time-motion analysis). If costs exceed ¥50M, the LTV:CAC ratio drops below investable thresholds.",
            activities: [
                "Execute a limited 'Retrofit Pilot' in an existing Kajima facility to measure actual installation labor hours",
                "Audit the 'Technology Curator' supply chain to lock in hardware pricing with vendors like Omron or Honeywell",
                "Update the financial model with verified installation data"
            ],
            fallback: "If costs >¥50M, pause scaling until value engineering reduces labor intensity.",
            timeline: "45 days",
            priority: "critical"
        },
        "H004": {
            step: 4,
            title: "Appoint Commercial Leadership",
            rationale: "The current team is 'technically overweight' (R&D focus) and lacks a Product Manager or Commercial Lead to drive sales and product-market fit.",
            activities: [
                "Hire or appoint a 'Venture Lead' with P&L authority distinct from the construction division",
                "Recruit a Product Manager with B2B SaaS experience to own the roadmap and user experience",
                "Establish the 'Wellbeing Business Promotion Office' (WBPO) governance structure"
            ],
            fallback: "Do not release Tranche 2 funding (¥700M) until commercial leadership is in place.",
            timeline: "30 days",
            priority: "high"
        },
        "H005": {
            step: 5,
            title: "Decouple Hardware Architecture",
            rationale: "Embedding sensors with a 3-5 year lifecycle into buildings with a 50-year lifecycle creates a 'Hardware Trap' and obsolescence liability.",
            activities: [
                "Finalize a 'Skin and Skeleton' technical specification where sensors are treated as FF&E",
                "Redesign ceiling/wall integration to allow sensor replacement without demolition",
                "Secure API stability guarantees from key hardware partners"
            ],
            fallback: null,
            timeline: "60 days",
            priority: "high"
        },
        "H006": {
            step: 6,
            title: "Verify 'WellnessGPT' Accuracy",
            rationale: "The 'science-based' claim relies on the internal 'WellnessGPT' model. If the model hallucinates or cites non-existent medical benefits, Kajima faces reputational and liability risk.",
            activities: [
                "Conduct an external audit of 100 random WellnessGPT recommendations against medical literature (PubMed)",
                "Benchmark sensor accuracy against clinical-grade devices in a controlled lab test"
            ],
            fallback: "If accuracy is low, restrict claims to 'comfort' rather than 'health.'",
            timeline: "45 days",
            priority: "high"
        },
        "H007": {
            step: 7,
            title: "Confirm Freedom-to-Operate (FTO)",
            rationale: "The external IP landscape for 'workplace monitoring' is dense and heavily patented, creating freedom-to-operate risks that could block deployment or trigger infringement lawsuits.",
            activities: [
                "Commission comprehensive FTO patent search covering workplace monitoring, biometric sensing, and environmental optimization IP",
                "Review vendor contracts to explicitly assign occupant data rights to Kajima",
                "Assess design-around options for any identified blocking patents"
            ],
            fallback: "If major blocking patents exist, negotiate licenses or pivot sensor architecture to avoid infringement.",
            timeline: "60 days",
            priority: "high"
        },
        "H008": {
            step: 8,
            title: "Establish Consultative Sales Channel",
            rationale: "The existing sales force targets facility managers and procurement departments focused on cost reduction, but this solution requires consultative selling to CHROs and CFOs focused on productivity and talent retention.",
            activities: [
                "Identify and train 2-3 sales specialists in consultative selling for wellness ROI",
                "Develop business case templates quantifying productivity and retention benefits",
                "Pilot new sales approach with 5 target accounts at CHRO/CFO level"
            ],
            fallback: "If channel proves ineffective, consider partnering with HR/benefits consultants who already have C-suite access.",
            timeline: "45 days",
            priority: "high"
        }
    };
    
    /**
     * Check version and migrate
     */
    function checkVersionAndMigrate() {
        const storedVersion = localStorage.getItem(STORAGE_KEYS.version);
        if (storedVersion !== CURRENT_VERSION) {
            console.log(`Migrating to v${CURRENT_VERSION}`);
            localStorage.removeItem(STORAGE_KEYS.hypotheses);
            localStorage.removeItem(STORAGE_KEYS.recommendation);
            localStorage.setItem(STORAGE_KEYS.version, CURRENT_VERSION);
            return true;
        }
        return false;
    }

    // Internal state
    let state = {
        hypotheses: [],
        recommendation: null,
        expandedCards: new Set(),
        activeTab: 'all', // all, kill, weighted
        isLoading: false,
        error: null
    };

    // Icons
    const icons = {
        refresh: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>`,
        chevronDown: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`,
        chevronUp: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>`,
        check: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
        x: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
        clock: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
        warning: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
        target: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>`,
        zap: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,
        activity: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>`,
        play: `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`,
        pause: `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`
    };

    // Check if AI recommendations are enabled via config
    function isAIEnabled() {
        return window.APP_CONFIG?.ENABLE_AI_RECOMMENDATIONS !== false;
    }

    /**
     * Initialize
     */
    function init() {
        checkVersionAndMigrate();
        loadState();
    }

    /**
     * Load state
     */
    function loadState() {
        const savedHypotheses = localStorage.getItem(STORAGE_KEYS.hypotheses);
        const savedRecommendation = localStorage.getItem(STORAGE_KEYS.recommendation);

        if (savedHypotheses) {
            try {
                state.hypotheses = JSON.parse(savedHypotheses);
            } catch (e) {
                state.hypotheses = JSON.parse(JSON.stringify(initialHypotheses));
            }
        } else {
            state.hypotheses = JSON.parse(JSON.stringify(initialHypotheses));
            saveHypotheses();
        }

        if (savedRecommendation) {
            try {
                state.recommendation = JSON.parse(savedRecommendation);
            } catch (e) {
                state.recommendation = null;
            }
        }

        // Always reset loading and error states on load (they shouldn't persist)
        state.isLoading = false;
        state.error = null;
    }

    /**
     * Save hypotheses
     */
    function saveHypotheses() {
        localStorage.setItem(STORAGE_KEYS.hypotheses, JSON.stringify(state.hypotheses));
    }

    /**
     * Save recommendation
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
        rerenderCard(id);
        updateProgressBar();

        // Update the header decision tag to reflect new validation status
        if (window.DoItChecklist?.updateHeaderDecisionTag) {
            window.DoItChecklist.updateHeaderDecisionTag();
        }

        // Note: AI refresh is now manual-only via the refresh button
    }

    /**
     * Calculate progress stats
     */
    function getProgressStats() {
        const killCriteria = state.hypotheses.filter(h => h.type === HypothesisType.KILL_CRITERIA);
        const weighted = state.hypotheses.filter(h => h.type === HypothesisType.WEIGHTED);
        
        const killValidated = killCriteria.filter(h => h.outcome === HypothesisOutcome.VALIDATED).length;
        const killInvalidated = killCriteria.filter(h => h.outcome === HypothesisOutcome.INVALIDATED).length;
        const weightedValidated = weighted.filter(h => h.outcome === HypothesisOutcome.VALIDATED).length;
        
        const totalAssessed = state.hypotheses.filter(h => h.outcome !== HypothesisOutcome.PENDING).length;
        const inProgress = state.hypotheses.filter(h => h.status === HypothesisStatus.IN_PROGRESS).length;
        
        return {
            killTotal: killCriteria.length,
            killValidated,
            killInvalidated,
            killPending: killCriteria.length - killValidated - killInvalidated,
            weightedTotal: weighted.length,
            weightedValidated,
            totalAssessed,
            totalHypotheses: state.hypotheses.length,
            inProgress,
            overallProgress: Math.round((totalAssessed / state.hypotheses.length) * 100)
        };
    }

    /**
     * Main render function
     */
    function render() {
        loadState();
        
        // Ensure loading state is cleared on render
        state.isLoading = false;
        state.error = null;
        
        const container = document.getElementById('contentContainer');
        if (!container) return;

        const stats = getProgressStats();
        const killCriteria = state.hypotheses.filter(h => h.type === HypothesisType.KILL_CRITERIA);
        const weighted = state.hypotheses.filter(h => h.type === HypothesisType.WEIGHTED);

        container.innerHTML = `
            <div class="corp-content-block vd-header">
                <p class="corp-eyebrow">90-Day Validation Sprint</p>
                <h2 class="corp-title">Validation Dashboard</h2>
                <p class="corp-paragraph">Track validation progress, execute action items, and receive AI-powered Go/No-Go recommendations in real-time.</p>
            </div>

            ${renderHeroProgress(stats)}
            ${renderAIPanel()}
            ${renderValidationCards(killCriteria, weighted)}
        `;

        setupEventListeners();
        
        // Note: AI recommendation generation is now manual-only via the refresh button
    }

    /**
     * Render the hero progress section
     */
    function renderHeroProgress(stats) {
        const killProgress = (stats.killValidated / stats.killTotal) * 100;
        const weightedProgress = (stats.weightedValidated / stats.weightedTotal) * 100;
        
        // Determine overall health
        let healthStatus = 'pending';
        let healthLabel = 'Validation In Progress';
        let healthColor = '#f59e0b';
        
        if (stats.killInvalidated > 0) {
            healthStatus = 'blocked';
            healthLabel = 'Critical Blocker Detected';
            healthColor = '#ef4444';
        } else if (stats.killValidated === stats.killTotal) {
            healthStatus = 'healthy';
            healthLabel = 'All Kill Criteria Passed';
            healthColor = '#22c55e';
        }

        return `
            <div class="vd-hero">
                <div class="vd-hero-left">
                    <div class="vd-progress-ring-container">
                        <svg class="vd-progress-ring" viewBox="0 0 120 120">
                            <circle class="vd-ring-bg" cx="60" cy="60" r="52" fill="none" stroke-width="8"/>
                            <circle class="vd-ring-progress" cx="60" cy="60" r="52" fill="none" stroke-width="8"
                                stroke-dasharray="${2 * Math.PI * 52}"
                                stroke-dashoffset="${2 * Math.PI * 52 * (1 - stats.overallProgress / 100)}"
                                style="stroke: ${healthColor}"/>
                        </svg>
                        <div class="vd-ring-center">
                            <span class="vd-ring-percent">${stats.overallProgress}%</span>
                            <span class="vd-ring-label">Complete</span>
                        </div>
                    </div>
                </div>
                
                <div class="vd-hero-right">
                    <div class="vd-status-banner ${healthStatus}">
                        <span class="vd-status-icon">${healthStatus === 'blocked' ? icons.warning : healthStatus === 'healthy' ? icons.check : icons.clock}</span>
                        <span class="vd-status-text">${healthLabel}</span>
                    </div>
                    
                    <div class="vd-stats-grid">
                        <div class="vd-stat-card kill">
                            <div class="vd-stat-header">
                                <span class="vd-stat-icon">${icons.warning}</span>
                                <span class="vd-stat-title">Kill Criteria</span>
                            </div>
                            <div class="vd-stat-bar">
                                <div class="vd-stat-bar-fill" style="width: ${killProgress}%; background: ${stats.killInvalidated > 0 ? '#ef4444' : '#22c55e'}"></div>
                            </div>
                            <div class="vd-stat-numbers">
                                <span class="vd-stat-validated">${stats.killValidated} validated</span>
                                ${stats.killInvalidated > 0 ? `<span class="vd-stat-invalidated">${stats.killInvalidated} failed</span>` : ''}
                                <span class="vd-stat-pending">${stats.killPending} pending</span>
                            </div>
                        </div>
                        
                        <div class="vd-stat-card weighted">
                            <div class="vd-stat-header">
                                <span class="vd-stat-icon">${icons.target}</span>
                                <span class="vd-stat-title">Weighted Factors</span>
                            </div>
                            <div class="vd-stat-bar">
                                <div class="vd-stat-bar-fill" style="width: ${weightedProgress}%; background: #3b82f6"></div>
                            </div>
                            <div class="vd-stat-numbers">
                                <span class="vd-stat-validated">${stats.weightedValidated} validated</span>
                                <span class="vd-stat-pending">${stats.weightedTotal - stats.weightedValidated} pending</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Render AI recommendation panel
     */
    function renderAIPanel() {
        if (!isAIEnabled()) {
            return `
                <div class="vd-ai-panel disabled">
                    <div class="vd-ai-header">
                        <div class="vd-ai-badge">
                            <span class="vd-ai-icon">${icons.zap}</span>
                            <span>AI Advisor</span>
                        </div>
                    </div>
                    <div class="vd-ai-body">
                        <div class="vd-ai-reasoning">
                            <p>AI-powered recommendations are currently disabled. Your validation progress is being saved locally. Enable AI in settings to receive dynamic Go/No-Go guidance.</p>
                        </div>
                    </div>
                </div>
            `;
        }

        if (state.isLoading) {
            return `
                <div class="vd-ai-panel loading">
                    <div class="vd-ai-loading">
                        <div class="vd-ai-pulse"></div>
                        <span>Analyzing validation status and generating recommendation...</span>
                    </div>
                </div>
            `;
        }

        if (state.error) {
            return `
                <div class="vd-ai-panel error">
                    <div class="vd-ai-error">
                        <span>${icons.warning}</span>
                        <span>${state.error}</span>
                        <button class="vd-retry-btn" onclick="HypothesisScorer.manualRefresh()">Try Again</button>
                    </div>
                </div>
            `;
        }

        // Check if saved recommendation is stale (hypotheses have changed)
        let isStale = false;
        if (state.recommendation && state.recommendation.hypothesisSnapshot) {
            const currentSnapshot = state.hypotheses.map(h => ({
                id: h.id,
                outcome: h.outcome,
                status: h.status
            }));
            const savedSnapshot = state.recommendation.hypothesisSnapshot;
            
            // Compare snapshots
            if (JSON.stringify(currentSnapshot) !== JSON.stringify(savedSnapshot)) {
                isStale = true;
            }
        }

        const rec = state.recommendation || {
            verdict: 'AWAITING_DATA',
            confidence: 'Pending',
            reasoning: 'Mark hypothesis outcomes above to receive an AI-powered investment recommendation. The AI will analyze your validation progress and provide Go/No-Go guidance.',
            priorities: [],
            concerns: []
        };

        const verdictClass = rec.verdict === 'GO' ? 'go' : 
                            rec.verdict === 'NO_GO' ? 'no-go' : 
                            rec.verdict === 'PROCEED_WITH_CAUTION' ? 'caution' : 'pending';
        
        // Format verdict for display
        const verdictDisplay = rec.verdict ? rec.verdict.replace(/_/g, ' ') : 'AWAITING DATA';

        return `
            <div class="vd-ai-panel ${verdictClass} ${isStale ? 'stale' : ''}" id="aiPanel">
                <div class="vd-ai-header">
                    <div class="vd-ai-badge">
                        <span class="vd-ai-icon">${icons.zap}</span>
                        <span>AI Investment Advisor</span>
                        ${isStale ? '<span class="vd-stale-badge" title="Recommendation may be outdated - click refresh to update">Outdated</span>' : ''}
                    </div>
                    <button class="vd-refresh-btn" onclick="HypothesisScorer.manualRefresh()" title="Refresh AI Analysis">
                        ${icons.refresh}
                    </button>
                </div>
                
                <div class="vd-ai-body">
                    <div class="vd-ai-verdict-section">
                        <div class="vd-ai-verdict">${verdictDisplay}</div>
                        ${rec.confidence ? `<div class="vd-ai-confidence">${rec.confidence} Confidence</div>` : ''}
                    </div>
                    
                    <div class="vd-ai-reasoning">
                        <p>${rec.reasoning || rec.logic || ''}</p>
                    </div>
                    
                    ${rec.priorities && rec.priorities.length > 0 ? `
                        <div class="vd-ai-priorities">
                            <h4>Priority Actions</h4>
                            <ul>
                                ${rec.priorities.map(p => `<li>${p}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    
                    ${rec.concerns && rec.concerns.length > 0 ? `
                        <div class="vd-ai-concerns">
                            <h4>Key Concerns</h4>
                            <ul>
                                ${rec.concerns.map(c => `<li>${c}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    
                    ${rec.tranche2_gate ? `
                        <div class="vd-ai-gate">
                            <h4>Tranche 2 Funding Gate</h4>
                            <p>${rec.tranche2_gate}</p>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    /**
     * Render validation cards
     */
    function renderValidationCards(killCriteria, weighted) {
        return `
            <div class="vd-cards-section">
                <div class="vd-section-header kill">
                    <div class="vd-section-badge">${icons.warning}</div>
                    <div class="vd-section-info">
                        <h3>Kill Criteria</h3>
                        <p>Must pass for investment approval. Any failure triggers pivot or termination.</p>
                    </div>
                    <button class="vd-refresh-all-claims-btn" onclick="HypothesisTracker.refreshAllValidationClaims()" title="Refresh All Validation Claims">
                        ${icons.refresh}
                        <span>Refresh All Claims</span>
                    </button>
                </div>
                <div class="vd-cards-grid" id="killCriteriaGrid">
                    ${killCriteria.map(h => renderValidationCard(h)).join('')}
                </div>
            </div>
            
            <div class="vd-cards-section">
                <div class="vd-section-header weighted">
                    <div class="vd-section-badge">${icons.target}</div>
                    <div class="vd-section-info">
                        <h3>Weighted Factors</h3>
                        <p>Influence confidence level and deal terms. Failures adjustable but reduce conviction.</p>
                    </div>
                </div>
                <div class="vd-cards-grid" id="weightedGrid">
                    ${weighted.map(h => renderValidationCard(h)).join('')}
                </div>
            </div>
        `;
    }

    /**
     * Render a single validation card
     */
    function renderValidationCard(h) {
        const isExpanded = state.expandedCards.has(h.id);
        const action = actionPlanMap[h.id];
        const outcomeConfig = OutcomeConfig[h.outcome];
        const statusConfig = StatusConfig[h.status];
        const isKill = h.type === HypothesisType.KILL_CRITERIA;
        
        // Determine card state for styling
        let cardState = 'pending';
        if (h.outcome === HypothesisOutcome.VALIDATED) cardState = 'validated';
        else if (h.outcome === HypothesisOutcome.INVALIDATED) cardState = 'invalidated';
        else if (h.status === HypothesisStatus.IN_PROGRESS) cardState = 'active';
        
        const priorityClass = action?.priority === 'critical' ? 'priority-critical' : 'priority-high';

        return `
            <div class="vd-card ${cardState} ${isExpanded ? 'expanded' : ''} ${priorityClass}" id="card-${h.id}">
                <div class="vd-card-header" onclick="HypothesisTracker.toggleCard('${h.id}')">
                    <div class="vd-card-step">
                        <span class="vd-step-number">${action?.step || '?'}</span>
                    </div>
                    
                    <div class="vd-card-main">
                        <div class="vd-card-id">${h.id}</div>
                        <h4 class="vd-card-title">${h.title}</h4>
                        <div class="vd-card-meta">
                            <span class="vd-meta-category">${h.category}</span>
                            <span class="vd-meta-timeline">${icons.clock} ${action?.timeline || 'TBD'}</span>
                        </div>
                    </div>
                    
                    <div class="vd-card-status">
                        <div class="vd-outcome-indicator ${h.outcome}" title="${outcomeConfig.label}">
                            ${h.outcome === HypothesisOutcome.VALIDATED ? icons.check : 
                              h.outcome === HypothesisOutcome.INVALIDATED ? icons.x : 
                              h.outcome === HypothesisOutcome.PENDING ? '○' : '◐'}
                        </div>
                    </div>
                    
                    <div class="vd-card-expand">
                        ${isExpanded ? icons.chevronUp : icons.chevronDown}
                    </div>
                </div>
                
                ${isExpanded ? renderExpandedCard(h, action) : ''}
            </div>
        `;
    }

    /**
     * Render expanded card content
     */
    function renderExpandedCard(h, action) {
        const statusOptions = Object.entries(StatusConfig).map(([key, config]) => 
            `<button class="vd-status-btn ${h.status === key ? 'active' : ''}" 
                    data-status="${key}" data-hypothesis="${h.id}">
                ${config.label}
            </button>`
        ).join('');

        const outcomeOptions = Object.entries(OutcomeConfig).map(([key, config]) => 
            `<button class="vd-outcome-btn ${key} ${h.outcome === key ? 'active' : ''}" 
                    data-outcome="${key}" data-hypothesis="${h.id}">
                <span class="vd-outcome-icon">${config.icon}</span>
                <span>${config.label}</span>
            </button>`
        ).join('');

        return `
            <div class="vd-card-body">
                <div class="vd-card-section vd-hypothesis-section">
                    <h5>Hypothesis</h5>
                    <p class="vd-hypothesis-text">${h.description}</p>
                    <div class="vd-success-gate">
                        <span class="vd-gate-label">✓ Success Gate</span>
                        <p>${h.successGate || 'Not specified'}</p>
                    </div>
                </div>
                
                <div class="vd-card-section vd-action-section">
                    <h5>Validation Actions</h5>
                    <p class="vd-rationale">${action?.rationale || ''}</p>
                    <ul class="vd-activities">
                        ${(action?.activities || []).map((a, i) => `
                            <li>
                                <span class="vd-activity-num">${i + 1}</span>
                                <span class="vd-activity-text">${a}</span>
                            </li>
                        `).join('')}
                    </ul>
                    ${action?.fallback ? `
                        <div class="vd-fallback">
                            <span class="vd-fallback-label">↳ Fallback</span>
                            <p>${action.fallback}</p>
                        </div>
                    ` : ''}
                </div>
                
                <div class="vd-card-section vd-controls-section">
                    <div class="vd-control-group">
                        <h5>Status</h5>
                        <div class="vd-status-buttons">
                            ${statusOptions}
                        </div>
                    </div>
                    
                    <div class="vd-control-group">
                        <h5>Outcome</h5>
                        <div class="vd-outcome-buttons">
                            ${outcomeOptions}
                        </div>
                    </div>
                </div>
                
                <div class="vd-card-section vd-assignment-section">
                    <div class="vd-field-row">
                        <div class="vd-field">
                            <label>Owner</label>
                            <input type="text" value="${h.owner || ''}" 
                                   placeholder="${h.suggestedOwner || 'Assign owner...'}"
                                   class="vd-owner-input"
                                   data-hypothesis="${h.id}">
                        </div>
                        <div class="vd-field">
                            <label>Due Date</label>
                            <input type="date" value="${h.dueDate || ''}" 
                                   class="vd-date-input"
                                   data-hypothesis="${h.id}">
                        </div>
                    </div>
                    <div class="vd-field">
                        <label>Notes</label>
                        <textarea class="vd-notes-input" 
                                  placeholder="Add validation notes, findings, or evidence..."
                                  data-hypothesis="${h.id}">${h.notes || ''}</textarea>
                    </div>
                </div>
                
                ${h.updatedAt ? `
                    <div class="vd-card-footer">
                        Last updated: ${getTimeAgo(new Date(h.updatedAt))}
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
        newCard.innerHTML = renderValidationCard(hypothesis);
        const newCardElement = newCard.firstElementChild;
        
        card.replaceWith(newCardElement);
        setupCardListeners(newCardElement);
    }

    /**
     * Update progress bar and stats in hero section
     */
    function updateProgressBar() {
        const stats = getProgressStats();
        
        // Update ring
        const heroProgress = document.querySelector('.vd-ring-progress');
        const heroPercent = document.querySelector('.vd-ring-percent');
        
        if (heroProgress) {
            const circumference = 2 * Math.PI * 52;
            heroProgress.style.strokeDashoffset = circumference * (1 - stats.overallProgress / 100);
            
            // Update ring color based on status
            if (stats.killInvalidated > 0) {
                heroProgress.style.stroke = '#ef4444';
            } else if (stats.killValidated === stats.killTotal) {
                heroProgress.style.stroke = '#22c55e';
            } else {
                heroProgress.style.stroke = '#f59e0b';
            }
        }
        if (heroPercent) {
            heroPercent.textContent = `${stats.overallProgress}%`;
        }
        
        // Update status banner
        const statusBanner = document.querySelector('.vd-status-banner');
        const statusText = document.querySelector('.vd-status-text');
        if (statusBanner && statusText) {
            statusBanner.classList.remove('pending', 'healthy', 'blocked');
            if (stats.killInvalidated > 0) {
                statusBanner.classList.add('blocked');
                statusText.textContent = 'Critical Blocker Detected';
            } else if (stats.killValidated === stats.killTotal) {
                statusBanner.classList.add('healthy');
                statusText.textContent = 'All Kill Criteria Passed';
            } else {
                statusBanner.classList.add('pending');
                statusText.textContent = 'Validation In Progress';
            }
        }
        
        // Update kill criteria stats
        const killValidatedEl = document.querySelector('.vd-stat-card.kill .vd-stat-validated');
        const killPendingEl = document.querySelector('.vd-stat-card.kill .vd-stat-pending');
        const killInvalidatedEl = document.querySelector('.vd-stat-card.kill .vd-stat-invalidated');
        const killBarEl = document.querySelector('.vd-stat-card.kill .vd-stat-bar-fill');
        
        if (killValidatedEl) killValidatedEl.textContent = `${stats.killValidated} validated`;
        if (killPendingEl) killPendingEl.textContent = `${stats.killPending} pending`;
        if (killBarEl) {
            const killProgress = (stats.killValidated / stats.killTotal) * 100;
            killBarEl.style.width = `${killProgress}%`;
            killBarEl.style.background = stats.killInvalidated > 0 ? '#ef4444' : '#22c55e';
        }
        
        // Handle invalidated display
        if (stats.killInvalidated > 0) {
            if (!killInvalidatedEl) {
                const killNumbers = document.querySelector('.vd-stat-card.kill .vd-stat-numbers');
                if (killNumbers) {
                    const invalidSpan = document.createElement('span');
                    invalidSpan.className = 'vd-stat-invalidated';
                    invalidSpan.textContent = `${stats.killInvalidated} failed`;
                    killNumbers.insertBefore(invalidSpan, killPendingEl);
                }
            } else {
                killInvalidatedEl.textContent = `${stats.killInvalidated} failed`;
            }
        }
        
        // Update weighted stats
        const weightedValidatedEl = document.querySelector('.vd-stat-card.weighted .vd-stat-validated');
        const weightedPendingEl = document.querySelector('.vd-stat-card.weighted .vd-stat-pending');
        const weightedBarEl = document.querySelector('.vd-stat-card.weighted .vd-stat-bar-fill');
        
        if (weightedValidatedEl) weightedValidatedEl.textContent = `${stats.weightedValidated} validated`;
        if (weightedPendingEl) weightedPendingEl.textContent = `${stats.weightedTotal - stats.weightedValidated} pending`;
        if (weightedBarEl) {
            const weightedProgress = (stats.weightedValidated / stats.weightedTotal) * 100;
            weightedBarEl.style.width = `${weightedProgress}%`;
        }
    }

    /**
     * Rerender AI panel
     */
    function rerenderAIPanel() {
        const aiPanel = document.getElementById('aiPanel');
        if (aiPanel) {
            const newPanel = document.createElement('div');
            newPanel.innerHTML = renderAIPanel();
            aiPanel.replaceWith(newPanel.firstElementChild);
        }
    }

    /**
     * Setup event listeners
     */
    function setupEventListeners() {
        document.querySelectorAll('.vd-card').forEach(card => {
            setupCardListeners(card);
        });
    }

    /**
     * Setup listeners for a specific card
     */
    function setupCardListeners(cardElement) {
        // Status buttons
        cardElement.querySelectorAll('.vd-status-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.dataset.hypothesis;
                const status = btn.dataset.status;
                updateHypothesis(id, { status });
            });
        });

        // Outcome buttons
        cardElement.querySelectorAll('.vd-outcome-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.dataset.hypothesis;
                const outcome = btn.dataset.outcome;
                updateHypothesis(id, { outcome });
            });
        });

        // Input fields
        cardElement.querySelectorAll('.vd-owner-input, .vd-date-input, .vd-notes-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const id = e.target.dataset.hypothesis;
                const field = e.target.classList.contains('vd-owner-input') ? 'owner' :
                              e.target.classList.contains('vd-date-input') ? 'dueDate' : 'notes';
                updateHypothesis(id, { [field]: e.target.value });
            });
            
            // Prevent card collapse when clicking input
            input.addEventListener('click', (e) => e.stopPropagation());
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
     * Reset the entire Validation Dashboard back to initial state
     */
    function refreshAllValidationClaims() {
        // Reset hypotheses to initial state
        state.hypotheses = JSON.parse(JSON.stringify(initialHypotheses));
        
        // Clear recommendation
        state.recommendation = null;
        
        // Clear expanded cards
        state.expandedCards = new Set();
        
        // Save the reset state
        saveHypotheses();
        localStorage.removeItem(STORAGE_KEYS.recommendation);
        
        // Re-render the entire dashboard
        render();
    }

    /**
     * Time ago helper
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

    /**
     * Get state (for scorer)
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
        rerenderAIPanel();
    }

    /**
     * Hide loading state
     */
    function hideLoading() {
        state.isLoading = false;
        rerenderAIPanel();
    }

    /**
     * Show error
     */
    function showError(message) {
        state.isLoading = false;
        state.error = message;
        rerenderAIPanel();
    }

    /**
     * Update recommendation display
     */
    function updateRecommendationDisplay(recommendation) {
        saveRecommendation(recommendation);
        state.isLoading = false;
        state.error = null;
        rerenderAIPanel();
    }

    // Public API
    return {
        init,
        render,
        updateHypothesis,
        saveRecommendation,
        getHypotheses: () => state.hypotheses,
        toggleCard,
        refreshAllValidationClaims,
        getState,
        showLoading,
        hideLoading,
        showError,
        updateRecommendationDisplay
    };
})();

// Expose to window
window.HypothesisTracker = HypothesisTracker;
