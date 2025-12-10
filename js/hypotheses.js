/**
 * Hypothesis Data Model and Initial Data
 * Based on: Wellbeing Real Estate Initiative Executive Summary - Next Steps and Action Plan
 * Version 3.0 - Updated to 8 core hypotheses aligned with exec-10pager.md
 */

// Hypothesis status enum
const HypothesisStatus = {
    NOT_STARTED: 'not_started',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    BLOCKED: 'blocked'
};

// Hypothesis outcome enum
const HypothesisOutcome = {
    PENDING: 'pending',
    VALIDATED: 'validated',
    INVALIDATED: 'invalidated',
    PARTIALLY_VALIDATED: 'partial',
    INCONCLUSIVE: 'inconclusive'
};

// Hypothesis category enum
const HypothesisCategory = {
    MARKET: 'market',
    TECH: 'tech',
    TEAM: 'team',
    REGULATORY: 'regulatory',
    FINANCIAL: 'financial',
    COMPETITIVE: 'competitive'
};

// Hypothesis type enum
const HypothesisType = {
    KILL_CRITERIA: 'kill_criteria',
    WEIGHTED: 'weighted'
};

// Category display labels and colors
const CategoryConfig = {
    [HypothesisCategory.MARKET]: { label: 'Market', color: '#3b82f6' },
    [HypothesisCategory.TECH]: { label: 'Tech', color: '#8b5cf6' },
    [HypothesisCategory.TEAM]: { label: 'Team', color: '#f97316' },
    [HypothesisCategory.REGULATORY]: { label: 'Regulatory', color: '#ef4444' },
    [HypothesisCategory.FINANCIAL]: { label: 'Financial', color: '#22c55e' },
    [HypothesisCategory.COMPETITIVE]: { label: 'Competitive', color: '#14b8a6' }
};

// Status display labels
const StatusConfig = {
    [HypothesisStatus.NOT_STARTED]: { label: 'Not Started', color: '#94a3b8' },
    [HypothesisStatus.IN_PROGRESS]: { label: 'In Progress', color: '#3b82f6' },
    [HypothesisStatus.COMPLETED]: { label: 'Completed', color: '#22c55e' },
    [HypothesisStatus.BLOCKED]: { label: 'Blocked', color: '#ef4444' }
};

// Outcome display config
const OutcomeConfig = {
    [HypothesisOutcome.PENDING]: { label: 'Pending', icon: '○', color: '#94a3b8' },
    [HypothesisOutcome.VALIDATED]: { label: 'Validated', icon: '✓', color: '#22c55e' },
    [HypothesisOutcome.INVALIDATED]: { label: 'Invalidated', icon: '✗', color: '#ef4444' },
    [HypothesisOutcome.PARTIALLY_VALIDATED]: { label: 'Partial', icon: '◐', color: '#f59e0b' },
    [HypothesisOutcome.INCONCLUSIVE]: { label: 'Inconclusive', icon: '?', color: '#6b7280' }
};

// ═══════════════════════════════════════════════════════════════
// INITIAL HYPOTHESES - Derived from Next Steps and Action Plan
// Version 3.0: 8 Core Hypotheses (3 Kill Criteria + 5 Weighted)
// ═══════════════════════════════════════════════════════════════

const initialHypotheses = [
    // ──────────────────────────────────────────────────────────────
    // KILL CRITERIA (3 Critical Hypotheses - Must Pass for GO)
    // ──────────────────────────────────────────────────────────────
    {
        id: "H001",
        title: "APPI Regulatory Viability",
        description: "The collection of biometric data in the workplace is legally permissible under APPI without requiring 100% individual opt-in. A formal legal opinion must confirm deployment is viable with <20% opt-out rate.",
        category: HypothesisCategory.REGULATORY,
        type: HypothesisType.KILL_CRITERIA,
        owner: "",
        suggestedOwner: "Legal Team",
        dueDate: null,
        suggestedDueDays: 30,
        status: HypothesisStatus.NOT_STARTED,
        outcome: HypothesisOutcome.PENDING,
        notes: "",
        sourceSection: "Next Steps - Step 1",
        validationMethod: "Commission formal legal opinion on specific sensor stack regarding workplace consent requirements. Draft 'Data Governance Charter' defining anonymization protocols. Confirm if 'Safe Harbor' exists for aggregated data.",
        successGate: "Legal Clearance: Formal legal opinion confirms deployment viable with <20% opt-out rate.",
        failureAction: "If blocked, pivot immediately to 'Option A: Design Focus' (remove sensors).",
        updatedAt: null
    },
    {
        id: "H002",
        title: "Commercial Willingness to Pay (WTP)",
        description: "Corporate tenants will sign binding agreements at a 4.4–7.7% price premium for invisible physiological benefits, not just visible design features.",
        category: HypothesisCategory.FINANCIAL,
        type: HypothesisType.KILL_CRITERIA,
        owner: "",
        suggestedOwner: "Sales / BD Team",
        dueDate: null,
        suggestedDueDays: 60,
        status: HypothesisStatus.NOT_STARTED,
        outcome: HypothesisOutcome.PENDING,
        notes: "",
        sourceSection: "Next Steps - Step 2",
        validationMethod: "Conduct deep-dive interviews with 10 corporate real estate directors. Pitch three distinct offer tiers (Design-only vs. Tech-enabled) to existing clients. Secure non-binding LOIs that explicitly itemize the technology premium.",
        successGate: "Commercial Validation: Secure 3 signed LOIs with confirmed price premium of ≥5% over standard Grade-A rates.",
        failureAction: "If customers refuse premiums, pivot to 'Option C: Consulting Services.'",
        updatedAt: null
    },
    {
        id: "H003",
        title: "Installation Unit Economics",
        description: "Installation labor costs can be contained within ¥25 million per 10,000 sqm project. Current estimates vary from ¥15M (model) to ¥83M (time-motion analysis) - a 5.5x variance.",
        category: HypothesisCategory.FINANCIAL,
        type: HypothesisType.KILL_CRITERIA,
        owner: "",
        suggestedOwner: "Operations / Finance",
        dueDate: null,
        suggestedDueDays: 45,
        status: HypothesisStatus.NOT_STARTED,
        outcome: HypothesisOutcome.PENDING,
        notes: "",
        sourceSection: "Next Steps - Step 3",
        validationMethod: "Execute limited 'Retrofit Pilot' in existing Kajima facility to measure actual installation labor hours. Audit 'Technology Curator' supply chain to lock in hardware pricing with vendors (Omron, Honeywell). Update financial model with verified data.",
        successGate: "Economic Viability: Verified installation cost ≤¥25M per 10,000 sqm project.",
        failureAction: "If costs >¥50M, pause scaling until value engineering reduces labor intensity.",
        updatedAt: null
    },

    // ──────────────────────────────────────────────────────────────
    // WEIGHTED HYPOTHESES (3 Supporting Hypotheses - Affect Confidence)
    // ──────────────────────────────────────────────────────────────
    {
        id: "H004",
        title: "Commercial Leadership Appointment",
        description: "The organization can recruit and empower a Venture Lead with P&L authority and a Product Manager with B2B SaaS experience within 30 days.",
        category: HypothesisCategory.TEAM,
        type: HypothesisType.WEIGHTED,
        owner: "",
        suggestedOwner: "HR / Executive Team",
        dueDate: null,
        suggestedDueDays: 30,
        status: HypothesisStatus.NOT_STARTED,
        outcome: HypothesisOutcome.PENDING,
        notes: "",
        sourceSection: "Next Steps - Step 4",
        validationMethod: "Hire or appoint 'Venture Lead' with P&L authority distinct from construction division. Recruit Product Manager with B2B SaaS experience. Establish 'Wellbeing Business Promotion Office' (WBPO) governance structure.",
        successGate: "Team Readiness: Key commercial roles filled within 30 days.",
        failureAction: "Do not release Tranche 2 funding (¥700M) until commercial leadership is in place.",
        updatedAt: null
    },
    {
        id: "H005",
        title: "Hardware Architecture Decoupling",
        description: "The sensor and tech layer can be designed as FF&E (Furniture, Fixtures, Equipment) allowing 100% replacement without demolition, mitigating the 3-5 year tech vs. 50-year building lifecycle mismatch.",
        category: HypothesisCategory.TECH,
        type: HypothesisType.WEIGHTED,
        owner: "",
        suggestedOwner: "Technical / R&D Team",
        dueDate: null,
        suggestedDueDays: 60,
        status: HypothesisStatus.NOT_STARTED,
        outcome: HypothesisOutcome.PENDING,
        notes: "",
        sourceSection: "Next Steps - Step 5",
        validationMethod: "Finalize 'Skin and Skeleton' technical specification where sensors are treated as FF&E. Redesign ceiling/wall integration to allow sensor replacement without demolition. Secure API stability guarantees from key hardware partners.",
        successGate: "Technical Feasibility: Engineering approval of modular architecture allowing 100% sensor replacement in <48 hours per floor.",
        failureAction: "If not achievable, building becomes 'Hardware Trap' liability.",
        updatedAt: null
    },
    {
        id: "H006",
        title: "WellnessGPT Accuracy Verification",
        description: "The proprietary 'WellnessGPT' ontology achieves >85% correlation with clinical-grade medical devices and >90% alignment with medical consensus.",
        category: HypothesisCategory.TECH,
        type: HypothesisType.WEIGHTED,
        owner: "",
        suggestedOwner: "Technical DD / Medical Advisor",
        dueDate: null,
        suggestedDueDays: 45,
        status: HypothesisStatus.NOT_STARTED,
        outcome: HypothesisOutcome.PENDING,
        notes: "",
        sourceSection: "Next Steps - Step 6",
        validationMethod: "Conduct external audit of 100 random WellnessGPT recommendations against medical literature (PubMed). Benchmark sensor accuracy against clinical-grade devices in controlled lab test.",
        successGate: "Data Integrity: >90% alignment with medical consensus and >85% correlation with clinical sensors.",
        failureAction: "If accuracy is low, restrict claims to 'comfort' rather than 'health.'",
        updatedAt: null
    },
    {
        id: "H007",
        title: "Freedom-to-Operate (FTO) Clearance",
        description: "The venture can deploy its workplace monitoring and biometric sensing technology without infringing existing patents in the crowded 'workplace monitoring' IP landscape.",
        category: HypothesisCategory.REGULATORY,
        type: HypothesisType.WEIGHTED,
        owner: "",
        suggestedOwner: "Legal / IP Counsel",
        dueDate: null,
        suggestedDueDays: 60,
        status: HypothesisStatus.NOT_STARTED,
        outcome: HypothesisOutcome.PENDING,
        notes: "",
        sourceSection: "Regulatory & Legal Summary",
        validationMethod: "Commission comprehensive FTO patent search covering workplace monitoring, biometric sensing, and environmental optimization IP. Review vendor contracts for data ownership rights. Assess design-around options for any blocking patents.",
        successGate: "IP Clearance: FTO opinion confirms no blocking patents, or viable design-around strategies exist for identified risks.",
        failureAction: "If major blocking patents exist, negotiate licenses or pivot sensor architecture to avoid infringement.",
        updatedAt: null
    },
    {
        id: "H008",
        title: "Sales Channel Realignment",
        description: "The organization can establish a consultative sales overlay capable of selling intangible 'wellbeing outcomes' directly to CHROs and CFOs, bypassing traditional cost-focused procurement channels.",
        category: HypothesisCategory.MARKET,
        type: HypothesisType.WEIGHTED,
        owner: "",
        suggestedOwner: "Sales Leadership / BD",
        dueDate: null,
        suggestedDueDays: 45,
        status: HypothesisStatus.NOT_STARTED,
        outcome: HypothesisOutcome.PENDING,
        notes: "",
        sourceSection: "Go-to-Market / Market Relationship",
        validationMethod: "Identify and train 2-3 sales specialists in consultative selling for wellness ROI. Develop business case templates quantifying productivity and retention benefits. Pilot new sales approach with 5 target accounts at CHRO/CFO level.",
        successGate: "Channel Readiness: At least 2 qualified opportunities generated through new consultative channel within 45 days.",
        failureAction: "If channel proves ineffective, consider partnering with HR/benefits consultants who already have C-suite access.",
        updatedAt: null
    }
];

// ═══════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════

function getHypothesisById(hypotheses, id) {
    return hypotheses.find(h => h.id === id);
}

function getHypothesesByType(hypotheses, type) {
    return hypotheses.filter(h => h.type === type);
}

function getHypothesesByCategory(hypotheses, category) {
    return hypotheses.filter(h => h.category === category);
}

function getHypothesesByStatus(hypotheses, status) {
    return hypotheses.filter(h => h.status === status);
}

function getHypothesesByOutcome(hypotheses, outcome) {
    return hypotheses.filter(h => h.outcome === outcome);
}

function countByOutcome(hypotheses) {
    return {
        pending: hypotheses.filter(h => h.outcome === HypothesisOutcome.PENDING).length,
        validated: hypotheses.filter(h => h.outcome === HypothesisOutcome.VALIDATED).length,
        invalidated: hypotheses.filter(h => h.outcome === HypothesisOutcome.INVALIDATED).length,
        partial: hypotheses.filter(h => h.outcome === HypothesisOutcome.PARTIALLY_VALIDATED).length,
        inconclusive: hypotheses.filter(h => h.outcome === HypothesisOutcome.INCONCLUSIVE).length
    };
}

function getAssessedCount(hypotheses) {
    return hypotheses.filter(h => h.outcome !== HypothesisOutcome.PENDING).length;
}

function getUniqueOwners(hypotheses) {
    const owners = hypotheses
        .map(h => h.owner || h.suggestedOwner)
        .filter(o => o && o.trim() !== '');
    return [...new Set(owners)].sort();
}

// ═══════════════════════════════════════════════════════════════
// EXPORT TO GLOBAL SCOPE
// ═══════════════════════════════════════════════════════════════

window.HypothesisStatus = HypothesisStatus;
window.HypothesisOutcome = HypothesisOutcome;
window.HypothesisCategory = HypothesisCategory;
window.HypothesisType = HypothesisType;
window.CategoryConfig = CategoryConfig;
window.StatusConfig = StatusConfig;
window.OutcomeConfig = OutcomeConfig;
window.initialHypotheses = initialHypotheses;
window.getHypothesisById = getHypothesisById;
window.getHypothesesByType = getHypothesesByType;
window.getHypothesesByCategory = getHypothesesByCategory;
window.getHypothesesByStatus = getHypothesesByStatus;
window.getHypothesesByOutcome = getHypothesesByOutcome;
window.countByOutcome = countByOutcome;
window.getAssessedCount = getAssessedCount;
window.getUniqueOwners = getUniqueOwners;
