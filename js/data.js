const memoData = {
    companyInfo: {
        name: "Kajima Wellbeing Real Estate Initiative",
        stage: "Incubation / Seed (Pre-Revenue)",
        industry: "PropTech / Wellness Real Estate",
        location: "Tokyo, Japan",
        headline: "Evaluate whether Kajima should proceed with pilot deployment and phased commercialization of the 'Bio-Adaptive' building platform.",
        status: "conditional",
        decision: "Phased Go (Conditional)",
        raiseAmount: "¥25M–¥30M (Validation Budget)",
        valuationNote: "Internal Corporate Venture"
    },
    summaryStats: [
        {
            label: "Global TAM",
            value: "$438B",
            helper: "CAGR 15.8%"
        },
        {
            label: "Japan SOM",
            value: "$1.5B–$3.0B",
            helper: "Class A Office Segment"
        },
        {
            label: "Rent Premium",
            value: "4.4%–7.7%",
            helper: "For Healthy Buildings"
        },
        {
            label: "Validation Budget",
            value: "¥25M–¥30M",
            helper: "120-Day Pilot Phase"
        },
        {
            label: "Sales Cycle",
            value: "6–12 Months",
            helper: "B2B Enterprise Sales"
        },
        {
            label: "Target Margin",
            value: "20%+",
            helper: "Operating Margin (Year 3)"
        }
    ],
    executiveSummary: {
        strategicGoal: "This decision review evaluates whether Kajima should proceed with pilot deployment and phased commercialization of its well-being building technologies.",
        recommendation: {
            title: "Phased Go — Pilot-First Commercialization",
            detail: "Kajima should proceed with a Phased Go — pilot-first commercialization — prioritizing Premium Corporate Offices as the entry segment. This measured approach balances significant market opportunity against unproven commercial viability and technical integration challenges."
        },
        short: "The initiative addresses a high-growth market ($438B) with a strategic 'Bio-Adaptive' solution. However, execution is high-risk due to a lack of digital capability and commercial validation. Recommendation is a Phased Go to validate willingness-to-pay and regulatory compliance before scaling.",
        long: "This initiative proposes transitioning Kajima from a general contractor to a performance-based provider by integrating proprietary architectural design with biometric sensing to guarantee occupant health outcomes. Given the high execution risks and lack of commercial validation, the recommendation is a Phased Go to test willingness-to-pay and regulatory compliance before full-scale investment. The immediate priority is a 120-day 'hostile validation' phase to secure a binding Letter of Intent.",
        highlights: [
            {
                title: "Strategic Opportunity",
                detail: "Leverages 'Japan-first' footprint to capture post-pandemic 'flight to quality' and escape commodity margins."
            },
            {
                title: "Market Tailwinds",
                detail: "Global wellness real estate market growing at 15.8%, driven by corporate demand for productivity."
            },
            {
                title: "Unique Solution",
                detail: "'Bio-Adaptive' closed-loop system measures and adjusts environments in real-time, addressing the 'performance gap'."
            }
        ],
        keyOpportunities: [
            {
                title: "Premium Market Position",
                detail: "First-mover advantage in Japan's $1.5B-$3.0B wellness real estate segment with verifiable outcomes."
            },
            {
                title: "Recurring Revenue Model",
                detail: "Shift from one-time construction to SaaS-like monitoring contracts with 20%+ margins."
            },
            {
                title: "Corporate Wellness Tailwind",
                detail: "Post-pandemic 'flight to quality' and ESG mandates driving demand for healthy buildings."
            }
        ],
        watchouts: [
            "Regulatory Showstopper: Japan's APPI privacy laws regarding biometric data may block deployment.",
            "Split-Incentive: Developers pay CapEx, tenants reap OpEx benefits; value attribution is difficult.",
            "Talent Gap: Critical lack of Chief Medical Officer and Head of Product to validate claims and manage software."
        ],
        matrix: {
            canWeDoIt: "No (High confidence)",
            shouldWeDoIt: "Borderline (Medium confidence)",
            canWeDoItText: "Kajima excels at physical execution (Architecture) but lacks the digital DNA and scientific authority to build/sell a biometric SaaS platform.",
            shouldWeDoItText: "Market size ($438B) and trend alignment are compelling, but product-market fit for a high-CapEx, proprietary hardware solution is unproven."
        }
    },
    capabilityGaps: [
        {
            role: "Chief Medical Officer (CMO)",
            severity: "urgent",
            reason: "Required to validate health claims and provide scientific credibility for biometric wellness platform."
        },
        {
            role: "Head of Product",
            severity: "urgent",
            reason: "Critical for software/SaaS product management — currently no digital product DNA in organization."
        },
        {
            role: "Privacy/Compliance Lead",
            severity: "important",
            reason: "APPI biometric data compliance requires specialized expertise not present in current team."
        },
        {
            role: "Data Science Team",
            severity: "important",
            reason: "Bio-algorithmic layer (TRL 4-5) needs dedicated ML/data engineering capability."
        }
    ],
    riskAnalysis: {
        overall: "High-Risk, High-Complexity venture. Potential reward is outweighed by structural barriers (privacy, split-incentive) and capability gaps. Requires strict validation gates.",
        topRisks: [
            {
                title: "Regulatory Viability (APPI)",
                detail: "Collection of biometric/physiological data faces strict privacy hurdles in corporate environments."
            },
            {
                title: "Zero Commercial Validation",
                detail: "No paying customers or signed pilots to validate willingness-to-pay for the hardware premium."
            },
            {
                title: "Capability & Culture Mismatch",
                detail: "Organization lacks 'Digital Product' DNA; missing critical Medical/Product leadership."
            }
        ],
        sixTs: [
            {
                title: "Team",
                severity: "high",
                rating: "High Risk",
                summary: "Strong engineering but critical gaps in medical science and digital product leadership."
            },
            {
                title: "TAM",
                severity: "medium",
                rating: "Constrained",
                summary: "Large global market ($438B) but 'premium' segment constrained by split-incentive economics."
            },
            {
                title: "Technology",
                severity: "high",
                rating: "Obsolescence",
                summary: "Embedded proprietary sensors (3-5 yr life) in 50-yr buildings creates 'Zombie Tech' liability."
            },
            {
                title: "Traction",
                severity: "high",
                rating: "Zero",
                summary: "Advanced prototypes (K/Park) exist, but zero external commercial customers or revenue."
            },
            {
                title: "Trends",
                severity: "medium",
                rating: "Mixed",
                summary: "Wellness demand is high, but Privacy/Surveillance pushback is a major headwind."
            },
            {
                title: "Terms",
                severity: "high",
                rating: "Misaligned",
                summary: "Construction governance stifles agile innovation; J-curve economics clash with low margins."
            }
        ]
    },
    chapters: [
        {
            id: "market-opportunity",
            title: "Chapter 1: Market Opportunity",
            summary: "Global wellness real estate market is $438B (15.8% CAGR). Kajima targets the $1.5B-$3.0B Japan premium office segment, driven by a post-pandemic 'flight to quality' and productivity demands.",
            keyMetrics: [
                { label: "Global TAM", value: "$438B", description: "15.8% CAGR (2023-2028)" },
                { label: "Japan SOM", value: "$1.5B+", description: "Premium Office Construction" },
                { label: "Rent Premium", value: "4.4-7.7%", description: "Verified market benchmark" }
            ],
            contentBlocks: [
                {
                    title: "Flight to Quality",
                    body: "Tenants demand environments that mitigate stress/burnout. Healthy buildings command rent premiums and longer lease terms."
                },
                {
                    title: "Split-Incentive Friction",
                    body: "Developers bear capital costs while tenants gain productivity. Value capture requires overcoming this structural barrier."
                }
            ]
        },
        {
            id: "competitor-landscape",
            title: "Chapter 2: Competitor Landscape",
            summary: "Kajima faces a 'Two-Front War': playing catch-up against Tech Giants (Honeywell) owning data, and defending against Domestic GCs (Obayashi/Shimizu) with similar 'smart' narratives.",
            keyMetrics: [
                { label: "Primary Threat", value: "Commoditization", description: "WELL Cert + Sensors = Good Enough" },
                { label: "Tech Rival", value: "Honeywell", description: "Owns the sensor/data layer" },
                { label: "Standard", value: "Delos/WELL", description: "74,000+ locations certified" }
            ],
            contentBlocks: [
                {
                    title: "The Commoditization Trap",
                    body: "Competitors can replicate 'wellness' marketing using standard sensors and certifications, undercutting Kajima's high-R&D approach."
                },
                {
                    title: "Differentiation Fragility",
                    body: "Kajima's only moat is the proprietary logic linking design to physiology. Hardware is a liability, not a differentiator."
                }
            ]
        },
        {
            id: "product-technology",
            title: "Chapter 3: Product & Technology",
            summary: "An integrated 'Bio-Adaptive' platform (ST1-ST6) using proprietary 'WellnessGPT' and sensors. Physical tech is mature (TRL 9), but bio-algorithmic layer (TRL 4-5) lacks causal validation.",
            keyMetrics: [
                { label: "Physical TRL", value: "9", description: "Construction capability is mature" },
                { label: "Bio-Algo TRL", value: "4-5", description: "Lab validation only; unproven in wild" },
                { label: "Core Risk", value: "Causality", description: "Link between design & stress relief unproven" }
            ],
            roadmap: [
                {
                    stage: 1,
                    title: "Sensor Integration",
                    timeframe: "Q1-Q2",
                    actions: "Partner with OEM sensors, reduce proprietary hardware dependency",
                    active: true
                },
                {
                    stage: 2,
                    title: "Algorithm Validation",
                    timeframe: "Q2-Q3",
                    actions: "Clinical validation of bio-adaptive algorithms with medical oversight",
                    active: false
                },
                {
                    stage: 3,
                    title: "Platform MVP",
                    timeframe: "Q3-Q4",
                    actions: "WellnessGPT integration, dashboard for real-time monitoring",
                    active: false
                }
            ],
            contentBlocks: [
                {
                    title: "Bio-Adaptive Loop",
                    body: "Input (Environment) -> Response (Physiology) -> Outcome (Wellness). Requires real-time biometric feedback."
                },
                {
                    title: "Zombie Tech Risk",
                    body: "Embedded sensors become obsolete in 3-5 years. Strategy must shift to 'Technology Curator' (partnering) vs manufacturing."
                }
            ]
        },
        {
            id: "go-to-market",
            title: "Chapter 4: Go-To-Market (GTM)",
            summary: "Strategy utilizes a 'Trojan Horse' retrofit model (Soto-beya®) to enter clients before new construction. Depends on 'Technology Curator' partnership model with IWBI and sensor OEMs.",
            keyMetrics: [
                { label: "Validation", value: "120 Days", description: "Hostile pilot phase timeframe" },
                { label: "Target", value: "Corp HQ", description: "Tier 1 Japanese Corporates" },
                { label: "Strategy", value: "Retrofit First", description: "Bypass 3-5yr construction cycle" }
            ],
            roadmap: [
                {
                    stage: 1,
                    title: "Hostile Validation",
                    timeframe: "Days 1-120",
                    actions: "Secure binding LOI, validate APPI compliance, recruit CMO",
                    active: true
                },
                {
                    stage: 2,
                    title: "Pilot Deployment",
                    timeframe: "Months 4-9",
                    actions: "Deploy Soto-beya units, collect biometric data, measure outcomes",
                    active: false
                },
                {
                    stage: 3,
                    title: "Commercial Launch",
                    timeframe: "Year 1-2",
                    actions: "Scale to 5+ enterprise clients, establish recurring revenue model",
                    active: false
                },
                {
                    stage: 4,
                    title: "Platform Expansion",
                    timeframe: "Year 2-3",
                    actions: "Integrate full architectural solutions, expand beyond Japan",
                    active: false
                }
            ],
            contentBlocks: [
                {
                    title: "Trojan Horse Entry",
                    body: "Deploy modular units (Soto-beya) to generate verified data and build trust before upselling full architectural integration."
                },
                {
                    title: "Partnership Model",
                    body: "Must secure 'Keystone' partnership with IWBI (WELL) for credibility and sensor OEMs for hardware reliability."
                }
            ]
        },
        {
            id: "financial-operational",
            title: "Chapter 5: Financial & Operational Health",
            summary: "Financial model requires a 15-25% market premium to offset high fixed R&D costs. Economics show a 'J-curve' profile with heavy upfront burn and unproven recurring revenue tails.",
            keyMetrics: [
                { label: "Target Premium", value: "15-25%", description: "Required for model viability" },
                { label: "Burn Rate", value: "High", description: "Driven by R&D headcount" },
                { label: "Revenue Mix", value: "Hybrid", description: "CapEx Premium + SaaS OpEx" }
            ],
            financialData: {
                unitEconomics: [
                    { label: "Tech Talent Cost", value: "¥12M-¥25M/yr", note: "Per senior hire" },
                    { label: "Construction Margin", value: "3-5%", note: "Industry average" },
                    { label: "Target Margin (Y3)", value: "20%+", note: "With SaaS component" },
                    { label: "Customer LTV", value: "TBD", note: "Pending validation" }
                ],
                revenueModel: [
                    { label: "CapEx Premium", value: "15-25%", note: "Construction upcharge" },
                    { label: "SaaS Monitoring", value: "¥X/sqm/mo", note: "Recurring revenue" },
                    { label: "Data Licensing", value: "TBD", note: "Future revenue stream" }
                ],
                keyAssumptions: [
                    "Willingness-to-pay for premium unverified",
                    "SaaS adoption rate in J-market unknown",
                    "Split-incentive resolution required"
                ]
            },
            contentBlocks: [
                {
                    title: "Unit Economics",
                    body: "High-cost tech talent (¥12M-¥25M) inside low-margin construction model creates margin pressure. Needs recurring revenue to survive."
                },
                {
                    title: "Split-Incentive Risk",
                    body: "Developer pays CapEx, Tenant gets OpEx benefit. Willingness-to-pay remains the single biggest unverified assumption."
                }
            ]
        },
        {
            id: "org-regulatory",
            title: "Chapter 6: Org & Regulatory Readiness",
            summary: "Significant capability gap in Digital/Scientific leadership. Regulatory risk is high due to APPI privacy laws regarding biometric data collection in workplaces.",
            keyMetrics: [
                { label: "Talent Gap", value: "Critical", description: "Missing CMO & Head of Product" },
                { label: "Privacy Risk", value: "High", description: "APPI Biometric compliance" },
                { label: "Structure", value: "Matrixed", description: "R&D Streams vs Venture Team" }
            ],
            contentBlocks: [
                {
                    title: "Capability Mismatch",
                    body: "World-class construction engineering but weak 'Digital Product' DNA. Need to hire external specialized talent."
                },
                {
                    title: "Regulatory Showstopper",
                    body: "Collecting stress/emotion data via cameras/sensors risks violating APPI. 'Consent' in workplace is legally complex."
                }
            ]
        }
    ]
};

window.memoData = memoData;