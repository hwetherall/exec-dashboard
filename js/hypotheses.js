/**
 * Hypothesis Data Model and Initial Data
 * Contains enums, data structures, and hardcoded hypotheses for the Hypothesis Tracker
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

// Initial hypotheses data - hardcoded from investment memo analysis
const initialHypotheses = [
    {
        id: "H001",
        title: "Biometric data collection is legally viable under Japan's APPI",
        description: "The collection of physiological and behavioral data via cameras and sensors can be conducted in corporate environments without triggering prohibitive consent requirements or liability under Japan's APPI.",
        category: HypothesisCategory.REGULATORY,
        type: HypothesisType.KILL_CRITERIA,
        owner: "",
        suggestedOwner: "Legal Team",
        dueDate: null,
        suggestedDueDays: 30,
        status: HypothesisStatus.NOT_STARTED,
        outcome: HypothesisOutcome.PENDING,
        notes: "",
        sourceSection: "Legal and IP / Red Flags & Discrepancies",
        validationMethod: "Commission formal legal opinion and Privacy Impact Assessment (PIA) regarding 'AI-Integrated Sensing' architecture.",
        updatedAt: null
    },
    {
        id: "H002",
        title: "Developers will pay a 4-8% CapEx premium for wellbeing integration",
        description: "Commercial real estate developers are willing to pay an upfront construction premium for Kajima's proprietary hardware despite the split-incentive problem where tenants reap the benefits.",
        category: HypothesisCategory.FINANCIAL,
        type: HypothesisType.KILL_CRITERIA,
        owner: "",
        suggestedOwner: "Sales",
        dueDate: null,
        suggestedDueDays: 60,
        status: HypothesisStatus.NOT_STARTED,
        outcome: HypothesisOutcome.PENDING,
        notes: "",
        sourceSection: "Revenue Model / Assumptions Validation Table",
        validationMethod: "Secure at least one Letter of Intent (LOI) from a non-Kajima client explicitly accepting the premium pricing tier.",
        updatedAt: null
    },
    {
        id: "H003",
        title: "Environmental stimuli reliably cause physiological recovery",
        description: "The proposed environmental interventions (lighting, sound, air) produce a statistically significant, causal improvement in physiological metrics (e.g., cortisol reduction) greater than placebo.",
        category: HypothesisCategory.TECH,
        type: HypothesisType.KILL_CRITERIA,
        owner: "",
        suggestedOwner: "Technical DD",
        dueDate: null,
        suggestedDueDays: 90,
        status: HypothesisStatus.NOT_STARTED,
        outcome: HypothesisOutcome.PENDING,
        notes: "",
        sourceSection: "Product and Technology / Claims Verification",
        validationMethod: "Independent clinical review of ST3 R&D data and execution of a 'Wizard of Oz' test in the K/Park prototype.",
        updatedAt: null
    },
    {
        id: "H004",
        title: "Freedom-to-Operate exists for proprietary hardware (Sound Aircon)",
        description: "Kajima's proprietary hardware prototypes (Sound Aircon, Sky-apier) do not infringe on existing smart building patents held by incumbents like Daikin or Mitsubishi.",
        category: HypothesisCategory.REGULATORY,
        type: HypothesisType.KILL_CRITERIA,
        owner: "",
        suggestedOwner: "Legal Team",
        dueDate: null,
        suggestedDueDays: 30,
        status: HypothesisStatus.NOT_STARTED,
        outcome: HypothesisOutcome.PENDING,
        notes: "",
        sourceSection: "Legal and IP",
        validationMethod: "External patent counsel FTO analysis specifically for 'Sound Aircon' and 'Sky-apier' configurations.",
        updatedAt: null
    },
    {
        id: "H005",
        title: "Customers perceive value in proprietary 'Bio-Logic' over WELL certification",
        description: "The market values Kajima's proprietary 'biological accountability' data enough to pay for it as a substitute for, or premium addition to, standard WELL certification.",
        category: HypothesisCategory.COMPETITIVE,
        type: HypothesisType.WEIGHTED,
        owner: "",
        suggestedOwner: "Sales",
        dueDate: null,
        suggestedDueDays: 60,
        status: HypothesisStatus.NOT_STARTED,
        outcome: HypothesisOutcome.PENDING,
        notes: "",
        sourceSection: "Revenue Validation Strategy",
        validationMethod: "A/B testing in sales pitches: 'Performance Guarantee' vs. 'Standard Certification' to measure take-rate.",
        updatedAt: null
    },
    {
        id: "H006",
        title: "Employees will opt-in to workplace biometric monitoring",
        description: "Corporate employees are willing to accept AI camera tracking and physiological sensing in exchange for wellbeing benefits, with an opt-in rate sufficient for system viability (>40%).",
        category: HypothesisCategory.MARKET,
        type: HypothesisType.KILL_CRITERIA,
        owner: "",
        suggestedOwner: "Market Research",
        dueDate: null,
        suggestedDueDays: 60,
        status: HypothesisStatus.NOT_STARTED,
        outcome: HypothesisOutcome.PENDING,
        notes: "",
        sourceSection: "Claims Verification / Market Demand",
        validationMethod: "Survey 20+ corporate tenant HR directors and employee representatives regarding surveillance acceptance.",
        updatedAt: null
    },
    {
        id: "H007",
        title: "WellnessGPT creates defensible differentiation vs standard LLMs",
        description: "Kajima's internal 'WellnessGPT' provides design insights or data correlations significantly superior to standard public LLMs (GPT-4) prompted with wellbeing context.",
        category: HypothesisCategory.TECH,
        type: HypothesisType.WEIGHTED,
        owner: "",
        suggestedOwner: "Technical DD",
        dueDate: null,
        suggestedDueDays: 30,
        status: HypothesisStatus.NOT_STARTED,
        outcome: HypothesisOutcome.PENDING,
        notes: "",
        sourceSection: "Competitive Analysis / Derisking Actions",
        validationMethod: "Blind comparison test of WellnessGPT outputs vs. standard GPT-4 queries on wellbeing design scenarios.",
        updatedAt: null
    },
    {
        id: "H008",
        title: "Integrated hardware offers ROI superior to software retrofits",
        description: "The capital-intensive 'integrated build' delivers value outcomes (productivity/retention) significantly higher than low-cost software-only retrofits (e.g., BrainBox AI).",
        category: HypothesisCategory.COMPETITIVE,
        type: HypothesisType.WEIGHTED,
        owner: "",
        suggestedOwner: "Strategy",
        dueDate: null,
        suggestedDueDays: 60,
        status: HypothesisStatus.NOT_STARTED,
        outcome: HypothesisOutcome.PENDING,
        notes: "",
        sourceSection: "Competitive Analysis",
        validationMethod: "Comparative ROI analysis of Kajima's prototype results vs. published case studies of software retrofit competitors.",
        updatedAt: null
    },
    {
        id: "H009",
        title: "Recurring SaaS revenue model is viable for general contractors",
        description: "Building owners are willing to pay ongoing subscription fees for data/monitoring services to a construction firm, validating the LTV assumptions.",
        category: HypothesisCategory.FINANCIAL,
        type: HypothesisType.WEIGHTED,
        owner: "",
        suggestedOwner: "Finance",
        dueDate: null,
        suggestedDueDays: 90,
        status: HypothesisStatus.NOT_STARTED,
        outcome: HypothesisOutcome.PENDING,
        notes: "",
        sourceSection: "Revenue Model / Unit Economics",
        validationMethod: "Attempt to sell a standalone data subscription contract to an existing client (independent of new construction).",
        updatedAt: null
    },
    {
        id: "H010",
        title: "Proprietary hardware can be decoupled to prevent obsolescence",
        description: "The sensor and tech layer can be upgraded or replaced without prohibitive renovation costs, mitigating the 3-5 year tech vs. 50-year building lifecycle mismatch.",
        category: HypothesisCategory.TECH,
        type: HypothesisType.WEIGHTED,
        owner: "",
        suggestedOwner: "Technical DD",
        dueDate: null,
        suggestedDueDays: 60,
        status: HypothesisStatus.NOT_STARTED,
        outcome: HypothesisOutcome.PENDING,
        notes: "",
        sourceSection: "Product and Technology / Technical Risks",
        validationMethod: "Technical architecture review to confirm 'Layered Architecture' feasibility (surface mounting vs. embedded).",
        updatedAt: null
    },
    {
        id: "H011",
        title: "Internal construction teams will not value-engineer tech out",
        description: "Core construction division leadership will support the inclusion of higher-cost wellbeing specs rather than cutting them to protect standard project margins.",
        category: HypothesisCategory.TEAM,
        type: HypothesisType.WEIGHTED,
        owner: "",
        suggestedOwner: "Internal Audit",
        dueDate: null,
        suggestedDueDays: 30,
        status: HypothesisStatus.NOT_STARTED,
        outcome: HypothesisOutcome.PENDING,
        notes: "",
        sourceSection: "GTM and Partners / Stakeholder Engagement",
        validationMethod: "Establish a 'Pilot-to-Standard' review process and interview Project Managers regarding margin incentives.",
        updatedAt: null
    },
    {
        id: "H012",
        title: "Kajima can attract necessary medical and digital leadership",
        description: "The organization can implement a compensation and culture structure capable of hiring a Chief Medical Officer and Head of Product.",
        category: HypothesisCategory.TEAM,
        type: HypothesisType.WEIGHTED,
        owner: "",
        suggestedOwner: "HR/Recruiting",
        dueDate: null,
        suggestedDueDays: 60,
        status: HypothesisStatus.NOT_STARTED,
        outcome: HypothesisOutcome.PENDING,
        notes: "",
        sourceSection: "Team and Execution",
        validationMethod: "Test market reaction to job requisitions for these roles; review HR policy on non-standard compensation bands.",
        updatedAt: null
    },
    {
        id: "H013",
        title: "Technology Curator strategy avoids vendor lock-in",
        description: "The platform can successfully integrate third-party sensors (e.g., Honeywell) without creating data silos or dependency that blocks the 'WellnessGPT' logic.",
        category: HypothesisCategory.TECH,
        type: HypothesisType.WEIGHTED,
        owner: "",
        suggestedOwner: "Technical DD",
        dueDate: null,
        suggestedDueDays: 45,
        status: HypothesisStatus.NOT_STARTED,
        outcome: HypothesisOutcome.PENDING,
        notes: "",
        sourceSection: "GTM and Partners / Partnership Strategy",
        validationMethod: "Review API documentation and data ownership clauses in potential vendor contracts.",
        updatedAt: null
    },
    {
        id: "H014",
        title: "Gross margins can exceed standard construction levels (>15%)",
        description: "The blend of hardware premium and services will result in blended gross margins significantly higher than the standard ~15% construction margin.",
        category: HypothesisCategory.FINANCIAL,
        type: HypothesisType.WEIGHTED,
        owner: "",
        suggestedOwner: "Finance",
        dueDate: null,
        suggestedDueDays: 90,
        status: HypothesisStatus.NOT_STARTED,
        outcome: HypothesisOutcome.PENDING,
        notes: "",
        sourceSection: "Unit Economics",
        validationMethod: "Build a 'Bottom-Up' COGS model for a hypothetical project using validated vendor quotes and labor estimates.",
        updatedAt: null
    },
    {
        id: "H015",
        title: "Privacy by Design (Edge Processing) satisfies corporate security",
        description: "Processing biometric data at the edge (on-device) rather than the cloud is sufficient to satisfy the security requirements of Tier 1 corporate tenant IT departments.",
        category: HypothesisCategory.TECH,
        type: HypothesisType.WEIGHTED,
        owner: "",
        suggestedOwner: "Technical DD",
        dueDate: null,
        suggestedDueDays: 60,
        status: HypothesisStatus.NOT_STARTED,
        outcome: HypothesisOutcome.PENDING,
        notes: "",
        sourceSection: "Technical Validation Strategy",
        validationMethod: "Security architecture review with a sample Client CISO or third-party security auditor.",
        updatedAt: null
    }
];

// Utility functions
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

// Export to window for global access
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

