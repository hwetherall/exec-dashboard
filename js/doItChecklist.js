/**
 * Do It Checklist Module
 * Provides a decision-support summary at the top of the Overview Tab
 * Aggregates Strategic Fit, Facts Verification, and Belief Validation
 */

const DoItChecklist = (function() {
    // Configuration
    const CONFIG = {
        apiEndpoint: 'https://openrouter.ai/api/v1/chat/completions'
    };

    /**
     * Get the model to use (dynamic, reads from config at runtime)
     */
    function getModel() {
        return window.APP_CONFIG?.getDefaultModel()?.id || 'meta-llama/llama-4-maverick';
    }

    // Status constants
    const STATUS = {
        TICK: 'tick',
        CROSS: 'cross',
        QUESTION: 'question',
        LOADING: 'loading'
    };

    // Internal state
    let state = {
        strategicFit: {
            shouldWe: null,
            canWe: null,
            combined: STATUS.QUESTION
        },
        factsVerification: {
            status: STATUS.QUESTION,
            results: [],
            isLoading: false,
            error: null,
            lastVerified: null
        },
        beliefsAlignment: {
            status: STATUS.QUESTION,
            beliefs: [],
            mappedHypotheses: []
        },
        nextSteps: {
            content: null,
            isLoading: false,
            error: null
        },
        isExpanded: {
            strategicFit: false,
            facts: false,
            beliefs: false
        }
    };

    // Icons
    const icons = {
        tick: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
        cross: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
        question: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
        chevronDown: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`,
        chevronUp: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>`,
        sparkle: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18M3 12h18M5.636 5.636l12.728 12.728M18.364 5.636L5.636 18.364"></path></svg>`,
        refresh: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>`,
        loading: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="spin"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle><path d="M12 2a10 10 0 0 1 10 10" stroke-opacity="1"></path></svg>`,
        link: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>`
    };

    /**
     * Get API key from config
     */
    function getApiKey() {
        return window.APP_CONFIG?.OPENROUTER_API_KEY || localStorage.getItem('openrouter_api_key');
    }

    /**
     * Check if AI is enabled
     */
    function isAIEnabled() {
        return window.APP_CONFIG?.ENABLE_AI_RECOMMENDATIONS !== false;
    }

    // ═══════════════════════════════════════════════════════════════
    // PART 1: STRATEGIC FIT COMPUTATION
    // ═══════════════════════════════════════════════════════════════

    /**
     * Map verdict string to status
     */
    function verdictToStatus(verdict) {
        if (!verdict) return STATUS.QUESTION;
        const v = verdict.toLowerCase().trim();
        if (v === 'yes' || v === 'invest' || v === 'go') return STATUS.TICK;
        if (v === 'no' || v === 'pass' || v === 'no_go') return STATUS.CROSS;
        // Borderline, Conditional, etc. → Question mark
        return STATUS.QUESTION;
    }

    /**
     * Compute Strategic Fit from Should We and Can We verdicts
     */
    function computeStrategicFit() {
        const data = window.memoData;
        if (!data) return;

        const shouldWeVerdict = data.shouldWeDoIt?.verdict;
        const canWeVerdict = data.canWeDoIt?.verdict;

        state.strategicFit.shouldWe = {
            verdict: shouldWeVerdict,
            status: verdictToStatus(shouldWeVerdict),
            summary: data.shouldWeDoIt?.summary || ''
        };

        state.strategicFit.canWe = {
            verdict: canWeVerdict,
            status: verdictToStatus(canWeVerdict),
            summary: data.canWeDoIt?.summary || ''
        };

        // Combined: Both must be tick for overall tick
        const shouldStatus = state.strategicFit.shouldWe.status;
        const canStatus = state.strategicFit.canWe.status;

        if (shouldStatus === STATUS.TICK && canStatus === STATUS.TICK) {
            state.strategicFit.combined = STATUS.TICK;
        } else if (shouldStatus === STATUS.CROSS || canStatus === STATUS.CROSS) {
            state.strategicFit.combined = STATUS.CROSS;
        } else {
            state.strategicFit.combined = STATUS.QUESTION;
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // PART 2: FACTS VERIFICATION (LLM-powered)
    // ═══════════════════════════════════════════════════════════════

    /**
     * Build prompt for facts verification
     */
    function buildFactsVerificationPrompt(facts) {
        return `You are an expert fact-checker for investment due diligence. Evaluate each fact for reasonableness and accuracy.

For each fact, determine if it is:
- TRUE: The fact is accurate and verifiable, or represents a reasonable/plausible claim based on available data
- FALSE: The fact is demonstrably incorrect or highly implausible
- UNCERTAIN: Cannot be verified without additional research, or the claim is speculative

FACTS TO VERIFY:
${facts.map((f, i) => `${i + 1}. ${f}`).join('\n')}

Respond with ONLY valid JSON in this exact format:
{
  "results": [
    {"index": 1, "verdict": "TRUE|FALSE|UNCERTAIN", "reason": "Brief explanation (1 sentence)"},
    ...
  ],
  "summary": "Overall assessment in 1-2 sentences",
  "allReasonable": true/false
}`;
    }

    /**
     * Verify facts using LLM
     */
    async function verifyFacts() {
        if (!isAIEnabled()) {
            state.factsVerification.error = 'AI verification is disabled';
            updateUI();
            return;
        }

        const apiKey = getApiKey();
        if (!apiKey) {
            state.factsVerification.error = 'API key not configured';
            updateUI();
            return;
        }

        const facts = window.memoData?.keyFacts || [];
        if (facts.length === 0) {
            state.factsVerification.status = STATUS.QUESTION;
            state.factsVerification.error = 'No facts to verify';
            updateUI();
            return;
        }

        state.factsVerification.isLoading = true;
        state.factsVerification.error = null;
        updateUI();

        try {
            const response = await fetch(CONFIG.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'Investment Memo Dashboard - Facts Verification'
                },
                body: JSON.stringify({
                    model: getModel(),
                    messages: [
                        { role: 'user', content: buildFactsVerificationPrompt(facts) }
                    ],
                    temperature: 0.2,
                    max_tokens: 1500
                })
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.error?.message || `API request failed: ${response.status}`);
            }

            const data = await response.json();
            const content = data.choices?.[0]?.message?.content;

            if (!content) {
                throw new Error('No response content received');
            }

            // Parse response
            let jsonStr = content.trim();
            if (jsonStr.startsWith('```json')) jsonStr = jsonStr.slice(7);
            else if (jsonStr.startsWith('```')) jsonStr = jsonStr.slice(3);
            if (jsonStr.endsWith('```')) jsonStr = jsonStr.slice(0, -3);
            jsonStr = jsonStr.trim();

            const parsed = JSON.parse(jsonStr);

            state.factsVerification.results = parsed.results.map((r, i) => ({
                fact: facts[i] || facts[r.index - 1],
                verdict: r.verdict,
                reason: r.reason
            }));
            state.factsVerification.summary = parsed.summary;
            state.factsVerification.lastVerified = new Date().toISOString();

            // Determine overall status
            const allTrue = state.factsVerification.results.every(r => r.verdict === 'TRUE');
            const anyFalse = state.factsVerification.results.some(r => r.verdict === 'FALSE');

            if (allTrue) {
                state.factsVerification.status = STATUS.TICK;
            } else if (anyFalse) {
                state.factsVerification.status = STATUS.CROSS;
            } else {
                state.factsVerification.status = STATUS.QUESTION;
            }

        } catch (error) {
            console.error('Error verifying facts:', error);
            state.factsVerification.error = error.message;
            state.factsVerification.status = STATUS.QUESTION;
        } finally {
            state.factsVerification.isLoading = false;
            updateUI();
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // PART 3: BELIEFS + HYPOTHESIS ALIGNMENT
    // ═══════════════════════════════════════════════════════════════

    /**
     * Map belief status to display status
     */
    function beliefStatusToStatus(beliefStatus) {
        if (!beliefStatus) return STATUS.QUESTION;
        const s = beliefStatus.toLowerCase();
        if (s === 'validated') return STATUS.TICK;
        if (s === 'high_risk' || s === 'invalidated') return STATUS.CROSS;
        return STATUS.QUESTION; // unvalidated, in_lab, assumption
    }

    /**
     * Map hypothesis outcome to display status
     */
    function hypothesisOutcomeToStatus(outcome) {
        if (!outcome) return STATUS.QUESTION;
        const o = outcome.toLowerCase();
        if (o === 'validated') return STATUS.TICK;
        if (o === 'invalidated') return STATUS.CROSS;
        return STATUS.QUESTION; // pending, partial, inconclusive
    }

    /**
     * Get belief-to-hypothesis mapping from belief checklist or Investment Committee data
     * Also includes smart fallback mapping based on content matching
     */
    function getBeliefHypothesisMap() {
        const ic = window.memoData?.investmentCommittee;
        const beliefChecklist = window.memoData?.beliefChecklist || [];
        const map = {};
        
        // First priority: explicit hypothesisId in beliefChecklist
        beliefChecklist.forEach(b => {
            if (b.hypothesisId) {
                map[b.id] = b.hypothesisId;
            }
        });
        
        // Second priority: explicit mappings from investment committee data
        if (ic?.beliefs) {
            ic.beliefs.forEach(b => {
                if (b.linkedHypothesis && !map[b.id]) {
                    map[b.id] = b.linkedHypothesis;
                }
            });
        }
        
        // Fallback: Smart content-based mapping for beliefs without explicit links
        // This maps beliefs to hypotheses based on shared keywords/concepts
        const hypotheses = window.HypothesisTracker?.getState?.()?.hypotheses || window.initialHypotheses || [];
        
        beliefChecklist.forEach(belief => {
            if (map[belief.id]) return; // Already mapped
            
            const beliefText = (belief.belief || '').toLowerCase();
            
            // Try to find matching hypothesis based on content
            for (const h of hypotheses) {
                const hDesc = (h.description || '').toLowerCase();
                const hTitle = (h.title || '').toLowerCase();
                
                // Check for significant keyword matches
                if (beliefText.includes('appi') && (hDesc.includes('appi') || hTitle.includes('appi'))) {
                    map[belief.id] = h.id;
                    break;
                }
                if (beliefText.includes('premium') && beliefText.includes('4.4') && hDesc.includes('premium')) {
                    map[belief.id] = h.id;
                    break;
                }
                if (beliefText.includes('¥25m') || beliefText.includes('installation labor')) {
                    if (hDesc.includes('installation') || hTitle.includes('installation')) {
                        map[belief.id] = h.id;
                        break;
                    }
                }
                if (beliefText.includes('hardware trap') || beliefText.includes('skin-and-skeleton')) {
                    if (hDesc.includes('ff&e') || hTitle.includes('hardware') || hTitle.includes('decoupling')) {
                        map[belief.id] = h.id;
                        break;
                    }
                }
                if (beliefText.includes('wellnessgpt') || (beliefText.includes('>85%') && beliefText.includes('correlation'))) {
                    if (hTitle.includes('wellnessgpt') || hTitle.includes('accuracy') || (hDesc.includes('wellnessgpt') && hDesc.includes('correlation'))) {
                        map[belief.id] = h.id;
                        break;
                    }
                }
                if (beliefText.includes('fto') || beliefText.includes('patent') || beliefText.includes('freedom-to-operate')) {
                    if (hTitle.includes('fto') || hTitle.includes('freedom') || hDesc.includes('patent')) {
                        map[belief.id] = h.id;
                        break;
                    }
                }
                if (beliefText.includes('chro') || beliefText.includes('cfo') || beliefText.includes('consultative sales')) {
                    if (hTitle.includes('sales channel') || hDesc.includes('chro') || hDesc.includes('cfo')) {
                        map[belief.id] = h.id;
                        break;
                    }
                }
            }
        });
        
        return map;
    }

    /**
     * Compute beliefs alignment with hypothesis testing results
     */
    function computeBeliefStatus() {
        const data = window.memoData;
        if (!data) return;

        const beliefChecklist = data.beliefChecklist || [];
        const beliefHypothesisMap = getBeliefHypothesisMap();

        // Get hypothesis state
        let hypotheses = [];
        try {
            const trackerState = window.HypothesisTracker?.getState?.();
            hypotheses = trackerState?.hypotheses || window.initialHypotheses || [];
        } catch (e) {
            hypotheses = window.initialHypotheses || [];
        }

        // Build combined beliefs
        state.beliefsAlignment.beliefs = beliefChecklist.map(belief => {
            const mappedHypothesisId = beliefHypothesisMap[belief.id];
            const hypothesis = hypotheses.find(h => h.id === mappedHypothesisId);

            const beliefStatus = beliefStatusToStatus(belief.status);
            const hypothesisStatus = hypothesis ? hypothesisOutcomeToStatus(hypothesis.outcome) : null;

            // Combined status: if hypothesis has been tested, use that; otherwise use belief status
            let combinedStatus = beliefStatus;
            if (hypothesisStatus !== null) {
                if (hypothesisStatus === STATUS.TICK) {
                    combinedStatus = STATUS.TICK;
                } else if (hypothesisStatus === STATUS.CROSS) {
                    combinedStatus = STATUS.CROSS;
                } else if (beliefStatus !== STATUS.TICK) {
                    combinedStatus = STATUS.QUESTION;
                }
            }

            return {
                id: belief.id,
                belief: belief.belief,
                beliefStatus: belief.status,
                mappedHypothesis: mappedHypothesisId,
                hypothesisOutcome: hypothesis?.outcome,
                hypothesisTitle: hypothesis?.title,
                combinedStatus
            };
        });

        // Overall beliefs status
        const allValidated = state.beliefsAlignment.beliefs.every(b => b.combinedStatus === STATUS.TICK);
        const anyInvalidated = state.beliefsAlignment.beliefs.some(b => b.combinedStatus === STATUS.CROSS);

        if (allValidated) {
            state.beliefsAlignment.status = STATUS.TICK;
        } else if (anyInvalidated) {
            state.beliefsAlignment.status = STATUS.CROSS;
        } else {
            state.beliefsAlignment.status = STATUS.QUESTION;
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // NEXT STEPS GENERATION (LLM-powered)
    // ═══════════════════════════════════════════════════════════════

    /**
     * Build prompt for next steps generation
     */
    function buildNextStepsPrompt() {
        const strategicStatus = state.strategicFit.combined;
        const factsStatus = state.factsVerification.status;
        const beliefsStatus = state.beliefsAlignment.status;

        // Get hypothesis validation status from Validation Dashboard
        let hypotheses = [];
        try {
            const trackerState = window.HypothesisTracker?.getState?.();
            hypotheses = trackerState?.hypotheses || window.initialHypotheses || [];
        } catch (e) {
            hypotheses = window.initialHypotheses || [];
        }

        // Format current state
        let stateDescription = `CURRENT CHECKLIST STATE:

1. STRATEGIC FIT: ${strategicStatus.toUpperCase()}
   - Should We Do It: ${state.strategicFit.shouldWe?.verdict || 'Unknown'} - ${state.strategicFit.shouldWe?.summary || ''}
   - Can We Do It: ${state.strategicFit.canWe?.verdict || 'Unknown'} - ${state.strategicFit.canWe?.summary || ''}

2. FACTS VERIFICATION: ${factsStatus.toUpperCase()}`;

        if (state.factsVerification.results.length > 0) {
            stateDescription += `\n   ${state.factsVerification.summary || 'No summary available'}`;
            const issues = state.factsVerification.results.filter(r => r.verdict !== 'TRUE');
            if (issues.length > 0) {
                stateDescription += `\n   Issues found: ${issues.map(i => i.reason).join('; ')}`;
            }
        }

        // Build detailed hypothesis/belief validation status
        stateDescription += `\n\n3. HYPOTHESIS VALIDATION STATUS (from Validation Dashboard):`;
        
        // Group hypotheses by outcome
        const validated = hypotheses.filter(h => h.outcome === 'validated');
        const invalidated = hypotheses.filter(h => h.outcome === 'invalidated');
        const pending = hypotheses.filter(h => h.outcome === 'pending' || !h.outcome);
        const partial = hypotheses.filter(h => h.outcome === 'partial');
        
        if (validated.length > 0) {
            stateDescription += `\n   ✓ VALIDATED (${validated.length}): ${validated.map(h => `${h.id} - ${h.title}`).join('; ')}`;
            stateDescription += `\n     [These hypotheses have been confirmed - DO NOT recommend actions to validate these]`;
        }
        
        if (invalidated.length > 0) {
            stateDescription += `\n   ✗ INVALIDATED (${invalidated.length}): ${invalidated.map(h => `${h.id} - ${h.title}`).join('; ')}`;
            stateDescription += `\n     [These are blockers that require pivot or mitigation strategies]`;
        }
        
        if (partial.length > 0) {
            stateDescription += `\n   ◐ PARTIALLY VALIDATED (${partial.length}): ${partial.map(h => `${h.id} - ${h.title}`).join('; ')}`;
        }
        
        if (pending.length > 0) {
            stateDescription += `\n   ○ PENDING VALIDATION (${pending.length}): ${pending.map(h => `${h.id} - ${h.title}`).join('; ')}`;
            stateDescription += `\n     [These hypotheses still need to be tested]`;
        }

        // Add beliefs alignment summary
        stateDescription += `\n\n4. BELIEFS ALIGNMENT SUMMARY: ${beliefsStatus.toUpperCase()}`;
        const beliefIssues = state.beliefsAlignment.beliefs.filter(b => b.combinedStatus !== STATUS.TICK);
        if (beliefIssues.length > 0) {
            stateDescription += `\n   Unvalidated beliefs that need attention: ${beliefIssues.map(b => `${b.id}/${b.mappedHypothesis}: ${b.belief.substring(0, 60)}...`).join('; ')}`;
        } else {
            stateDescription += `\n   All beliefs have been validated.`;
        }

        return `You are an investment advisor synthesizing a clear action plan based on the current validation state.

${stateDescription}

IMPORTANT INSTRUCTIONS:
- DO NOT recommend actions for hypotheses that are already VALIDATED - those are complete
- Focus recommendations on PENDING and PARTIALLY VALIDATED hypotheses
- If any hypothesis is INVALIDATED, prioritize mitigation or pivot strategies
- Be specific about which hypothesis each recommendation addresses

Based on this checklist state, provide 3-5 concrete, actionable next steps that address the gaps identified. Each step should be specific and prioritized.

Respond with ONLY valid JSON in this exact format:
{
  "overallAssessment": "1-2 sentence summary of where we stand",
  "nextSteps": [
    {"priority": 1, "action": "Specific action to take", "rationale": "Why this matters", "owner": "Suggested owner/team"},
    ...
  ],
  "criticalPath": "The single most important thing to do next (must be for a PENDING hypothesis, not a validated one)"
}`;
    }

    /**
     * Generate next steps using LLM
     */
    async function generateNextSteps() {
        if (!isAIEnabled()) {
            state.nextSteps.error = 'AI is disabled';
            updateUI();
            return;
        }

        const apiKey = getApiKey();
        if (!apiKey) {
            state.nextSteps.error = 'API key not configured';
            updateUI();
            return;
        }

        state.nextSteps.isLoading = true;
        state.nextSteps.error = null;
        updateUI();

        try {
            const response = await fetch(CONFIG.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'Investment Memo Dashboard - Next Steps'
                },
                body: JSON.stringify({
                    model: getModel(),
                    messages: [
                        { role: 'user', content: buildNextStepsPrompt() }
                    ],
                    temperature: 0.4,
                    max_tokens: 1500
                })
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.error?.message || `API request failed: ${response.status}`);
            }

            const data = await response.json();
            const content = data.choices?.[0]?.message?.content;

            if (!content) {
                throw new Error('No response content received');
            }

            // Parse response
            let jsonStr = content.trim();
            if (jsonStr.startsWith('```json')) jsonStr = jsonStr.slice(7);
            else if (jsonStr.startsWith('```')) jsonStr = jsonStr.slice(3);
            if (jsonStr.endsWith('```')) jsonStr = jsonStr.slice(0, -3);
            jsonStr = jsonStr.trim();

            state.nextSteps.content = JSON.parse(jsonStr);
            state.nextSteps.generatedAt = new Date().toISOString();

        } catch (error) {
            console.error('Error generating next steps:', error);
            state.nextSteps.error = error.message;
        } finally {
            state.nextSteps.isLoading = false;
            updateUI();
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // UI RENDERING
    // ═══════════════════════════════════════════════════════════════

    /**
     * Get status icon HTML
     */
    function getStatusIcon(status, size = 24) {
        switch (status) {
            case STATUS.TICK:
                return `<span class="checklist-status-icon tick">${icons.tick}</span>`;
            case STATUS.CROSS:
                return `<span class="checklist-status-icon cross">${icons.cross}</span>`;
            case STATUS.LOADING:
                return `<span class="checklist-status-icon loading">${icons.loading}</span>`;
            default:
                return `<span class="checklist-status-icon question">${icons.question}</span>`;
        }
    }

    /**
     * Get status class
     */
    function getStatusClass(status) {
        switch (status) {
            case STATUS.TICK: return 'status-tick';
            case STATUS.CROSS: return 'status-cross';
            case STATUS.LOADING: return 'status-loading';
            default: return 'status-question';
        }
    }

    /**
     * Toggle section expansion
     */
    function toggleSection(section) {
        state.isExpanded[section] = !state.isExpanded[section];
        updateUI();
    }

    /**
     * Render the strategic fit detail panel
     */
    function renderStrategicFitDetail() {
        if (!state.isExpanded.strategicFit) return '';

        const shouldWe = state.strategicFit.shouldWe;
        const canWe = state.strategicFit.canWe;

        return `
            <div class="checklist-detail-panel">
                <div class="checklist-detail-item">
                    <div class="checklist-detail-header">
                        ${getStatusIcon(shouldWe?.status)}
                        <span class="checklist-detail-label">Should We Do It?</span>
                        <span class="checklist-detail-verdict">${shouldWe?.verdict || 'Unknown'}</span>
                    </div>
                    <p class="checklist-detail-summary">${shouldWe?.summary || 'No summary available'}</p>
                </div>
                <div class="checklist-detail-item">
                    <div class="checklist-detail-header">
                        ${getStatusIcon(canWe?.status)}
                        <span class="checklist-detail-label">Can We Do It?</span>
                        <span class="checklist-detail-verdict">${canWe?.verdict || 'Unknown'}</span>
                    </div>
                    <p class="checklist-detail-summary">${canWe?.summary || 'No summary available'}</p>
                </div>
            </div>
        `;
    }

    /**
     * Render the facts verification detail panel
     */
    function renderFactsDetail() {
        if (!state.isExpanded.facts) return '';

        const { results, summary, error, lastVerified } = state.factsVerification;

        if (error) {
            return `
                <div class="checklist-detail-panel">
                    <div class="checklist-error">${error}</div>
                </div>
            `;
        }

        if (results.length === 0) {
            return `
                <div class="checklist-detail-panel">
                    <p class="checklist-detail-empty">Facts have not been verified yet. Click "Verify Facts" to run AI verification.</p>
                </div>
            `;
        }

        const factItems = results.map(r => {
            const verdictClass = r.verdict === 'TRUE' ? 'fact-true' : 
                                 r.verdict === 'FALSE' ? 'fact-false' : 'fact-uncertain';
            return `
                <div class="checklist-fact-item ${verdictClass}">
                    <span class="fact-verdict">${r.verdict}</span>
                    <div class="fact-content">
                        <p class="fact-text">${r.fact}</p>
                        <p class="fact-reason">${r.reason}</p>
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div class="checklist-detail-panel">
                ${summary ? `<p class="checklist-detail-summary">${summary}</p>` : ''}
                <div class="checklist-facts-list">
                    ${factItems}
                </div>
                ${lastVerified ? `<p class="checklist-detail-meta">Last verified: ${new Date(lastVerified).toLocaleString()}</p>` : ''}
            </div>
        `;
    }

    /**
     * Navigate to a hypothesis in the Validation Dashboard
     */
    function navigateToHypothesis(hypothesisId) {
        if (!hypothesisId) return;
        
        // Use the global navigation to switch tabs
        if (typeof handleNavigation === 'function' && window.memoData) {
            handleNavigation('validation-dashboard', window.memoData);
            
            // After the tab renders, scroll to and highlight the hypothesis card
            setTimeout(() => {
                const card = document.getElementById(`card-${hypothesisId}`);
                if (card) {
                    // Expand the card
                    if (window.HypothesisTracker && typeof window.HypothesisTracker.toggleCard === 'function') {
                        // Check if already expanded
                        if (!card.classList.contains('expanded')) {
                            window.HypothesisTracker.toggleCard(hypothesisId);
                        }
                    }
                    
                    // Scroll into view with smooth animation
                    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    
                    // Add highlight animation
                    card.classList.add('checklist-highlight');
                    setTimeout(() => {
                        card.classList.remove('checklist-highlight');
                    }, 2000);
                }
            }, 150);
        }
    }

    /**
     * Navigate to a belief in the Validation Dashboard
     * If the belief has a linked hypothesis, navigates to that hypothesis card
     */
    function navigateToBelief(beliefId) {
        if (!beliefId) return;
        
        // Find the belief in the current state
        const belief = state.beliefsAlignment.beliefs.find(b => b.id === beliefId);
        const linkedHypothesisId = belief?.mappedHypothesis;
        
        // Use the global navigation to switch tabs
        if (typeof handleNavigation === 'function' && window.memoData) {
            handleNavigation('validation-dashboard', window.memoData);
            
            // If there's a linked hypothesis, navigate to it
            if (linkedHypothesisId) {
                // After the tab renders, scroll to and highlight the hypothesis card
                setTimeout(() => {
                    const card = document.getElementById(`card-${linkedHypothesisId}`);
                    if (card) {
                        // Expand the card
                        if (window.HypothesisTracker && typeof window.HypothesisTracker.toggleCard === 'function') {
                            // Check if already expanded
                            if (!card.classList.contains('expanded')) {
                                window.HypothesisTracker.toggleCard(linkedHypothesisId);
                            }
                        }
                        
                        // Scroll into view with smooth animation
                        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        
                        // Add highlight animation
                        card.classList.add('checklist-highlight');
                        setTimeout(() => {
                            card.classList.remove('checklist-highlight');
                        }, 2000);
                    }
                }, 150);
            }
        }
    }

    /**
     * Render the beliefs alignment detail panel
     */
    function renderBeliefsDetail() {
        if (!state.isExpanded.beliefs) return '';

        const beliefs = state.beliefsAlignment.beliefs;

        if (beliefs.length === 0) {
            return `
                <div class="checklist-detail-panel">
                    <p class="checklist-detail-empty">No beliefs to display.</p>
                </div>
            `;
        }

        const beliefItems = beliefs.map(b => {
            // All belief cards are clickable to navigate to the belief in Investment Committee
            const clickHandler = `onclick="event.stopPropagation(); DoItChecklist.navigateToBelief('${b.id}')"`;
            const cursorStyle = 'cursor: pointer;';
            
            // Format status badges
            const beliefStatusFormatted = (b.beliefStatus || 'Unknown').replace(/_/g, ' ');
            const hypothesisOutcomeFormatted = b.hypothesisOutcome ? b.hypothesisOutcome.replace(/_/g, ' ') : null;
            
            // Get status badge classes
            const getBeliefStatusClass = (status) => {
                const s = (status || '').toLowerCase();
                if (s.includes('validated') || s.includes('low_risk')) return 'status-badge-success';
                if (s.includes('high_risk') || s.includes('invalidated')) return 'status-badge-danger';
                if (s.includes('in_lab') || s.includes('assumption')) return 'status-badge-warning';
                return 'status-badge-neutral';
            };
            
            const getHypothesisStatusClass = (outcome) => {
                if (!outcome) return '';
                const o = outcome.toLowerCase();
                if (o.includes('validated')) return 'status-badge-success';
                if (o.includes('invalidated')) return 'status-badge-danger';
                if (o.includes('pending')) return 'status-badge-warning';
                return 'status-badge-neutral';
            };
            
            return `
                <div class="checklist-belief-card ${getStatusClass(b.combinedStatus)} has-link" 
                     ${clickHandler} style="${cursorStyle}" title="Click to view this belief in Validation Dashboard">
                    <div class="belief-card-header">
                        <div class="belief-card-status-indicator">
                            ${getStatusIcon(b.combinedStatus, 20)}
                        </div>
                        <div class="belief-card-main">
                            <div class="belief-card-ids">
                                <span class="belief-id-badge">${b.id}</span>
                                ${b.mappedHypothesis ? `<span class="belief-hypothesis-badge">${icons.link} ${b.mappedHypothesis}</span>` : ''}
                            </div>
                            <p class="belief-statement">${b.belief}</p>
                            ${hypothesisOutcomeFormatted ? `
                                <div class="belief-status-badges">
                                    <span class="hypothesis-status-badge ${getHypothesisStatusClass(b.hypothesisOutcome)}">
                                        <span class="badge-label">HYPOTHESIS:</span>
                                        <span class="badge-value">${hypothesisOutcomeFormatted}</span>
                                    </span>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    <div class="belief-card-footer">
                        <span class="belief-goto-link">View in Validation Dashboard →</span>
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div class="checklist-detail-panel">
                <div class="checklist-beliefs-grid">
                    ${beliefItems}
                </div>
            </div>
        `;
    }

    /**
     * Render next steps section
     */
    function renderNextSteps() {
        const { content, isLoading, error } = state.nextSteps;

        let stepsContent = '';
        
        if (isLoading) {
            stepsContent = `
                <div class="next-steps-loading">
                    ${icons.loading}
                    <span>Generating recommendations...</span>
                </div>
            `;
        } else if (error) {
            stepsContent = `<div class="next-steps-error">${error}</div>`;
        } else if (content) {
            stepsContent = `
                <div class="next-steps-content">
                    <p class="next-steps-assessment">${content.overallAssessment}</p>
                    <div class="next-steps-critical">
                        <span class="critical-label">Critical Path:</span>
                        <span class="critical-text">${content.criticalPath}</span>
                    </div>
                    <div class="next-steps-list">
                        ${content.nextSteps.map(step => `
                            <div class="next-step-item">
                                <span class="step-priority">${step.priority}</span>
                                <div class="step-content">
                                    <p class="step-action">${step.action}</p>
                                    <p class="step-rationale">${step.rationale}</p>
                                    <span class="step-owner">${step.owner}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        return `
            <div class="checklist-next-steps">
                <button class="next-steps-btn" onclick="DoItChecklist.generateNextSteps()" ${isLoading ? 'disabled' : ''}>
                    ${icons.sparkle}
                    <span>${content ? 'Regenerate Next Steps' : 'Generate Next Steps'}</span>
                </button>
                ${stepsContent}
            </div>
        `;
    }

    /**
     * Calculate overall status
     */
    function getOverallStatus() {
        const statuses = [
            state.strategicFit.combined,
            state.factsVerification.status,
            state.beliefsAlignment.status
        ];

        // If any is cross, overall is cross
        if (statuses.some(s => s === STATUS.CROSS)) return STATUS.CROSS;
        // If all are tick, overall is tick
        if (statuses.every(s => s === STATUS.TICK)) return STATUS.TICK;
        // Otherwise question
        return STATUS.QUESTION;
    }

    /**
     * Main render function
     */
    function render() {
        // Compute all statuses
        computeStrategicFit();
        computeBeliefStatus();

        const overall = getOverallStatus();
        const factsLoading = state.factsVerification.isLoading;

        return `
            <div class="do-it-checklist ${getStatusClass(overall)}">
                <div class="checklist-header">
                    <div class="checklist-title-area">
                        <h2 class="checklist-title">Do It Checklist</h2>
                        <span class="checklist-subtitle">Decision Support Summary</span>
                    </div>
                    <div class="checklist-overall">
                        ${getStatusIcon(overall)}
                    </div>
                </div>

                <div class="checklist-items">
                    <!-- Strategic Fit -->
                    <div class="checklist-item ${getStatusClass(state.strategicFit.combined)}" onclick="DoItChecklist.toggleSection('strategicFit')">
                        <div class="checklist-item-main">
                            ${getStatusIcon(state.strategicFit.combined)}
                            <div class="checklist-item-content">
                                <span class="checklist-item-label">Strategic Fit</span>
                                <span class="checklist-item-desc">Should We + Can We Do It</span>
                            </div>
                            <span class="checklist-expand-icon">${state.isExpanded.strategicFit ? icons.chevronUp : icons.chevronDown}</span>
                        </div>
                        ${renderStrategicFitDetail()}
                    </div>

                    <!-- Facts Verification -->
                    <div class="checklist-item ${getStatusClass(factsLoading ? STATUS.LOADING : state.factsVerification.status)}">
                        <div class="checklist-item-main" onclick="DoItChecklist.toggleSection('facts')">
                            ${getStatusIcon(factsLoading ? STATUS.LOADING : state.factsVerification.status)}
                            <div class="checklist-item-content">
                                <span class="checklist-item-label">Facts Verified</span>
                                <span class="checklist-item-desc">Key claims validated by AI</span>
                            </div>
                            <button class="checklist-action-btn" onclick="event.stopPropagation(); DoItChecklist.verifyFacts()" ${factsLoading ? 'disabled' : ''}>
                                ${icons.refresh}
                                <span>Verify</span>
                            </button>
                            <span class="checklist-expand-icon">${state.isExpanded.facts ? icons.chevronUp : icons.chevronDown}</span>
                        </div>
                        ${renderFactsDetail()}
                    </div>

                    <!-- Beliefs Alignment -->
                    <div class="checklist-item ${getStatusClass(state.beliefsAlignment.status)}" onclick="DoItChecklist.toggleSection('beliefs')">
                        <div class="checklist-item-main">
                            ${getStatusIcon(state.beliefsAlignment.status)}
                            <div class="checklist-item-content">
                                <span class="checklist-item-label">Beliefs Aligned</span>
                                <span class="checklist-item-desc">Beliefs + Hypothesis Testing</span>
                            </div>
                            <span class="checklist-expand-icon">${state.isExpanded.beliefs ? icons.chevronUp : icons.chevronDown}</span>
                        </div>
                        ${renderBeliefsDetail()}
                    </div>
                </div>

                ${renderNextSteps()}
            </div>
        `;
    }

    /**
     * Update the UI after state changes
     */
    function updateUI() {
        const container = document.getElementById('doItChecklistContainer');
        if (container) {
            container.innerHTML = render();
        }
    }

    /**
     * Initialize the module
     */
    function init() {
        computeStrategicFit();
        computeBeliefStatus();
    }

    /**
     * Compute the overall investment verdict based on checklist state
     * Returns: { verdict: string, badgeClass: string, description: string }
     */
    function getOverallVerdict() {
        // Get hypothesis state for kill criteria check
        let hypotheses = [];
        try {
            const trackerState = window.HypothesisTracker?.getState?.();
            hypotheses = trackerState?.hypotheses || window.initialHypotheses || [];
        } catch (e) {
            hypotheses = window.initialHypotheses || [];
        }

        const killCriteria = hypotheses.filter(h => h.type === 'kill_criteria');
        const allHypotheses = hypotheses;
        
        const killInvalidated = killCriteria.filter(h => h.outcome === 'invalidated').length;
        const killValidated = killCriteria.filter(h => h.outcome === 'validated').length;
        const allKillValidated = killValidated === killCriteria.length && killCriteria.length > 0;
        
        const allValidated = allHypotheses.filter(h => h.outcome === 'validated').length;
        const anyInvalidated = allHypotheses.filter(h => h.outcome === 'invalidated').length;
        const allHypothesesValidated = allValidated === allHypotheses.length && allHypotheses.length > 0;

        const beliefs = state.beliefsAlignment.status;

        // Decision logic:
        // 1. Any kill criteria invalidated → HARD NO GO
        if (killInvalidated > 0) {
            return {
                verdict: 'NO GO',
                badgeClass: 'status-no-go',
                description: 'Kill criteria failed - pivot or terminate required'
            };
        }

        // 2. All hypotheses validated → FULL GO
        if (allHypothesesValidated && beliefs === STATUS.TICK) {
            return {
                verdict: 'GO',
                badgeClass: 'status-go',
                description: 'All validation criteria passed'
            };
        }

        // 3. All kill criteria validated → CONDITIONAL GO
        if (allKillValidated) {
            // Check if weighted factors have issues
            const weightedInvalidated = allHypotheses.filter(h => h.type === 'weighted' && h.outcome === 'invalidated').length;
            if (weightedInvalidated > 0) {
                return {
                    verdict: 'CONDITIONAL NO GO',
                    badgeClass: 'status-conditional-no-go',
                    description: 'Weighted factors invalidated - requires resolution'
                };
            }
            return {
                verdict: 'CONDITIONAL GO',
                badgeClass: 'status-conditional',
                description: 'Kill criteria passed - pending weighted validation'
            };
        }

        // 4. Some kill criteria validated, none invalidated → CONDITIONAL PHASED GO
        if (killValidated > 0 && killInvalidated === 0) {
            return {
                verdict: 'CONDITIONAL PHASED GO',
                badgeClass: 'status-conditional',
                description: 'Validation in progress - phased approval'
            };
        }

        // 5. Default: Pending validation
        return {
            verdict: 'PENDING VALIDATION',
            badgeClass: 'status-pending',
            description: 'Awaiting validation results'
        };
    }

    /**
     * Update the decision tag in the header
     */
    function updateHeaderDecisionTag() {
        // Recompute beliefs status first (in case hypotheses changed)
        computeBeliefStatus();
        
        const verdict = getOverallVerdict();
        
        // Update the top header tag
        const headerTag = document.querySelector('.top-header .status-badge');
        if (headerTag) {
            headerTag.textContent = verdict.verdict;
            headerTag.className = `status-badge ${verdict.badgeClass}`;
        }

        // Update the overview status box
        const statusValue = document.querySelector('.corp-status-value');
        const statusBox = document.querySelector('.corp-status-box');
        if (statusValue) {
            statusValue.textContent = verdict.verdict;
        }
        if (statusBox) {
            statusBox.className = `corp-status-box ${verdict.badgeClass}`;
        }
    }

    // Public API
    return {
        render,
        init,
        verifyFacts,
        generateNextSteps,
        toggleSection,
        navigateToHypothesis,
        navigateToBelief,
        getState: () => state,
        getOverallVerdict,
        updateHeaderDecisionTag,
        STATUS
    };
})();

// Expose to window
window.DoItChecklist = DoItChecklist;

