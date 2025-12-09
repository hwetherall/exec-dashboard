/**
 * Hypothesis Scorer Module
 * Handles LLM integration for generating investment recommendations
 */

const HypothesisScorer = (function() {
    // Configuration
    const CONFIG = {
        apiEndpoint: 'https://openrouter.ai/api/v1/chat/completions',
        model: 'x-ai/grok-4.1-fast:free',
        debounceMs: 2000
    };

    // Internal state
    let debounceTimer = null;

    /**
     * Get API key from config
     */
    function getApiKey() {
        return window.APP_CONFIG?.OPENROUTER_API_KEY || localStorage.getItem('openrouter_api_key');
    }

    /**
     * Format hypotheses for LLM prompt
     */
    function formatHypothesesForLLM(hypotheses) {
        return hypotheses.map(h => {
            const outcomeLabel = OutcomeConfig[h.outcome]?.label || h.outcome;
            const statusLabel = StatusConfig[h.status]?.label || h.status;
            const categoryLabel = CategoryConfig[h.category]?.label || h.category;
            
            return `- [${outcomeLabel.toUpperCase()}] ${h.title}
  Category: ${categoryLabel} | Status: ${statusLabel}
  ${h.notes ? `Notes: ${h.notes}` : 'No notes recorded'}`;
        }).join('\n\n');
    }

    /**
     * Build the system prompt for the LLM
     */
    function buildSystemPrompt() {
        return `You are an expert investment committee advisor. You are evaluating a corporate venture investment based on validated and invalidated hypotheses.

Your task is to provide an investment recommendation based on the current state of due diligence.

CRITICAL RULES:
1. If ANY hypothesis marked as "kill_criteria" (in the KILL CRITERIA section) has outcome "INVALIDATED", your verdict MUST be "NO_GO"
2. If most kill_criteria are still "PENDING", recommend "CONTINUE_DD" regardless of weighted hypothesis results
3. Consider the balance of validated vs invalidated weighted hypotheses
4. Factor in which categories have the most uncertainty
5. Be specific about what evidence drove your recommendation

VERDICT OPTIONS (use exactly one):
- GO: Sufficient evidence to proceed with investment
- NO_GO: Evidence indicates this investment should not proceed
- CONTINUE_DD: More due diligence needed before a decision can be made
- PROCEED_WITH_CAUTION: Evidence is mixed but leans positive; proceed with specific risk mitigations

Respond ONLY with valid JSON in this exact format (no markdown, no code blocks, just pure JSON):
{
  "verdict": "GO | NO_GO | CONTINUE_DD | PROCEED_WITH_CAUTION",
  "confidence": "HIGH | MEDIUM | LOW",
  "reasoning": "2-4 sentence explanation of your recommendation, highlighting the most important factors",
  "priorities": ["Top priority action 1", "Top priority action 2", "Top priority action 3"],
  "concerns": ["Key concern 1", "Key concern 2"]
}`;
    }

    /**
     * Build the user prompt with hypothesis data
     */
    function buildUserPrompt(hypotheses) {
        const killCriteria = hypotheses.filter(h => h.type === HypothesisType.KILL_CRITERIA);
        const weighted = hypotheses.filter(h => h.type === HypothesisType.WEIGHTED);

        // Calculate some stats for context
        const killCounts = countByOutcome(killCriteria);
        const weightedCounts = countByOutcome(weighted);
        const totalAssessed = getAssessedCount(hypotheses);

        return `Here is the current state of investment hypotheses for Kajima Wellbeing Real Estate Initiative:

SUMMARY:
- Total hypotheses: ${hypotheses.length}
- Assessed: ${totalAssessed}/${hypotheses.length}
- Kill Criteria: ${killCriteria.length} total (${killCounts.validated} validated, ${killCounts.invalidated} invalidated, ${killCounts.pending} pending)
- Weighted: ${weighted.length} total (${weightedCounts.validated} validated, ${weightedCounts.invalidated} invalidated, ${weightedCounts.pending} pending)

KILL CRITERIA (must be validated for GO recommendation):
${formatHypothesesForLLM(killCriteria)}

WEIGHTED HYPOTHESES (contribute to overall assessment):
${formatHypothesesForLLM(weighted)}

Based on this evidence, what is your investment recommendation? Remember to respond with ONLY valid JSON.`;
    }

    /**
     * Parse LLM response
     */
    function parseResponse(responseText) {
        try {
            // Try to extract JSON from the response
            let jsonStr = responseText.trim();
            
            // Remove markdown code blocks if present
            if (jsonStr.startsWith('```json')) {
                jsonStr = jsonStr.slice(7);
            } else if (jsonStr.startsWith('```')) {
                jsonStr = jsonStr.slice(3);
            }
            if (jsonStr.endsWith('```')) {
                jsonStr = jsonStr.slice(0, -3);
            }
            jsonStr = jsonStr.trim();

            const parsed = JSON.parse(jsonStr);

            // Validate required fields
            if (!parsed.verdict || !['GO', 'NO_GO', 'CONTINUE_DD', 'PROCEED_WITH_CAUTION'].includes(parsed.verdict)) {
                throw new Error('Invalid or missing verdict');
            }

            return {
                verdict: parsed.verdict,
                confidence: parsed.confidence || 'MEDIUM',
                reasoning: parsed.reasoning || '',
                priorities: Array.isArray(parsed.priorities) ? parsed.priorities : [],
                concerns: Array.isArray(parsed.concerns) ? parsed.concerns : [],
                updatedAt: new Date().toISOString()
            };
        } catch (e) {
            console.error('Failed to parse LLM response:', e, responseText);
            throw new Error('Failed to parse recommendation response');
        }
    }

    /**
     * Generate recommendation via OpenRouter API
     */
    async function generateRecommendation(hypotheses) {
        const apiKey = getApiKey();
        
        if (!apiKey) {
            HypothesisTracker.showError('API key not configured. Please set your OpenRouter API key in settings.');
            return;
        }

        HypothesisTracker.showLoading();

        try {
            const response = await fetch(CONFIG.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'Investment Memo Dashboard - Hypothesis Tracker'
                },
                body: JSON.stringify({
                    model: CONFIG.model,
                    messages: [
                        { role: 'system', content: buildSystemPrompt() },
                        { role: 'user', content: buildUserPrompt(hypotheses) }
                    ],
                    temperature: 0.3, // Lower temperature for more consistent responses
                    max_tokens: 1024
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

            const parsedRec = parseResponse(content);

            // Map to UI format expected by Tracker
            const recommendation = {
                score: parsedRec.verdict.replace(/_/g, ' '),
                label: `${parsedRec.confidence} CONFIDENCE`,
                title: "Investment Recommendation",
                logic: parsedRec.reasoning,
                // Keep original data
                ...parsedRec
            };
            
            // Add hypothesis snapshot
            recommendation.hypothesisSnapshot = hypotheses.map(h => ({
                id: h.id,
                outcome: h.outcome,
                status: h.status
            }));

            HypothesisTracker.updateRecommendationDisplay(recommendation);
            HypothesisTracker.hideLoading();

        } catch (error) {
            console.error('Error generating recommendation:', error);
            HypothesisTracker.showError(`Failed to generate recommendation: ${error.message}`);
            HypothesisTracker.hideLoading();
        }
    }

    /**
     * Trigger auto-refresh with debouncing
     */
    function triggerAutoRefresh() {
        // Clear existing timer
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }

        // Set new timer
        debounceTimer = setTimeout(() => {
            const state = HypothesisTracker.getState();
            if (state && state.hypotheses) {
                generateRecommendation(state.hypotheses);
            }
        }, CONFIG.debounceMs);
    }

    /**
     * Cancel pending auto-refresh
     */
    function cancelAutoRefresh() {
        if (debounceTimer) {
            clearTimeout(debounceTimer);
            debounceTimer = null;
        }
    }

    // Public API
    return {
        generateRecommendation,
        triggerAutoRefresh,
        cancelAutoRefresh
    };
})();

// Expose to window
window.HypothesisScorer = HypothesisScorer;

