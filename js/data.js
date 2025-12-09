/**
 * Investment Memo Data - Executive Summary Focus
 * Source: Wellbeing Real Estate Initiative (exec-10pager.md)
 */

const memoData = {
    // ═══════════════════════════════════════════════════════════════
    // COMPANY & PROJECT INFO
    // ═══════════════════════════════════════════════════════════════
    companyInfo: {
        name: "Wellbeing Real Estate Initiative",
        stage: "Pre-Commercial / Validation",
        industry: "PropTech / Wellness Real Estate",
        location: "Tokyo, Japan",
        source: "Internal R&D (Kajima Technical Research Institute)",
        analyst: "Strategic Investment Team",
        headline: "Cyber-physical building platform integrating biophilic design and biometric sensing to actively optimize occupant physiological health.",
        status: "conditional", // "invest" | "pass" | "conditional"
        decision: "Conditional Phased Go",
        recommendation: "Proceed – With focused diligence (Tranche 1 Validation only)"
    },

    // ═══════════════════════════════════════════════════════════════
    // OVERVIEW TABLE (Stage 0)
    // ═══════════════════════════════════════════════════════════════
    overviewTable: [
        { field: "Project/Company Name", value: "Wellbeing Real Estate Initiative" },
        { field: "Stage", value: "Pre-Commercial / Validation" },
        { field: "Industry", value: "PropTech / Wellness Real Estate" },
        { field: "Location", value: "Tokyo, Japan" },
        { field: "Short Description", value: "Cyber-physical building platform integrating biophilic design and biometric sensing to actively optimize occupant physiological health." },
        { field: "Decision", value: "Conditional Phased Go (Tranche 1 Validation)" },
        { field: "Source", value: "Internal R&D (Kajima Technical Research Institute)" },
        { field: "Analyst", value: "Strategic Investment Team" },
        { field: "Recommendation", value: "Proceed – With focused diligence (Tranche 1 Validation only)" }
    ],

    // ═══════════════════════════════════════════════════════════════
    // TELL IT TO ME STRAIGHT
    // ═══════════════════════════════════════════════════════════════
    tellItStraight: {
        quote: "Let's be blunt: right now, this is an impressive R&D showcase, not a viable business. You have world-class engineering searching for a problem that customers may not pay to solve, and the entire recurring revenue model hinges on biometric data collection that Japanese law might prohibit.",
        coreIssue: "The core issue is that you are trying to sell \"invisible\" physiological optimization to cost-conscious tenants without a single signed contract or legal clearance.",
        actionableVerdict: "Proceed with a \"Conditional Go\" limited strictly to validation: give the team 90 days and minimal capital to bring you three signed Letters of Intent and a clean legal opinion. If they can't prove the demand and the legality, kill the service layer and stick to selling premium buildings.",
        strategicFitSummary: "Conditional Fit. The opportunity aligns strongly with Kajima's strategic goal to transition from commodity construction to high-margin services (\"Should We Do It\" = Yes). However, the organization currently lacks the commercial agility, legal frameworks, and software-first capabilities required to execute a data-driven business model (\"Can We Do It\" = No)."
    },

    // ═══════════════════════════════════════════════════════════════
    // KEY FACTS (Bullet Points)
    // ═══════════════════════════════════════════════════════════════
    keyFacts: [
        "Global Wellness Real Estate market: $584 billion (2024), 19.5% annual growth",
        "Japan SAM: $15B–$25B (Serviceable Addressable Market)",
        "Theoretical rental premium: 4.4–7.7% for wellness-certified buildings",
        "Projected Lifetime Gross Profit: ¥41M per project",
        "LTV:CAC ratio: 2.65:1",
        "Installation cost variance: 5.5x (¥15M modeled vs. ¥83M actual)",
        "Japan's APPI classifies physiological data as 'special care-required'",
        "Peak capital requirement: ¥5.5B with 12–13 year payback"
    ],

    // ═══════════════════════════════════════════════════════════════
    // BELIEF CHECKLIST (Key Assumptions to Validate)
    // ═══════════════════════════════════════════════════════════════
    beliefChecklist: [
        {
            id: "B1",
            belief: "Corporate tenants will sign binding agreements at a 4.4–7.7% price premium for invisible physiological benefits.",
            status: "unvalidated"
        },
        {
            id: "B2",
            belief: "Biometric data collection is legally permissible under APPI without requiring 100% individual opt-in.",
            status: "high_risk"
        },
        {
            id: "B3",
            belief: "Installation labor costs can be contained within ¥25M per 10,000 sqm project.",
            status: "unvalidated"
        },
        {
            id: "B4",
            belief: "The 'Hardware Trap' can be mitigated via a 'skin-and-skeleton' architecture that decouples sensor lifecycles from building lifecycles.",
            status: "assumption"
        },
        {
            id: "B5",
            belief: "The proprietary 'WellnessGPT' ontology achieves >85% correlation with clinical-grade medical devices.",
            status: "in_lab"
        }
    ],

    // ═══════════════════════════════════════════════════════════════
    // NEXT STEPS / HYPOTHESES TO VALIDATE
    // ═══════════════════════════════════════════════════════════════
    nextSteps: [
        {
            hypothesis: "Premium Pricing",
            action: "Secure 3 non-binding Letters of Intent (LOIs) that explicitly itemize the technology premium."
        },
        {
            hypothesis: "Legal Viability",
            action: "Commission a formal legal opinion on the specific sensor stack regarding workplace consent requirements and 'Safe Harbor' provisions."
        },
        {
            hypothesis: "Installation Costs",
            action: "Execute a limited 'Retrofit Pilot' in an existing facility to measure actual installation labor hours."
        },
        {
            hypothesis: "Hardware Architecture",
            action: "Finalize a technical specification where sensors are treated as FF&E to allow replacement without demolition."
        },
        {
            hypothesis: "WellnessGPT Accuracy",
            action: "Conduct an external audit of 100 random WellnessGPT recommendations against medical literature."
        }
    ],

    // ═══════════════════════════════════════════════════════════════
    // SIX-T RISK ANALYSIS
    // ═══════════════════════════════════════════════════════════════
    sixTRisks: [
        {
            category: "Team",
            assessment: "World-class engineering and R&D talent, but critically lacking in B2B SaaS commercial leadership and product management.",
            risk: "high" // 🔴
        },
        {
            category: "TAM",
            assessment: "Large, high-growth market ($584B global) with strong macro tailwinds, though the Japan-specific SAM is smaller ($15-25B).",
            risk: "low" // 🟢
        },
        {
            category: "Technology",
            assessment: "Core physical assets are ready, but the digital correlation engine is TRL 4-5. High risk of hardware obsolescence (3-5 year cycle).",
            risk: "medium" // 🟡
        },
        {
            category: "Traction",
            assessment: "Zero commercial contracts or LOIs signed. Willingness to pay is theoretical based on market proxies, not actual sales.",
            risk: "high" // 🔴
        },
        {
            category: "Terms",
            assessment: "Unit economics are attractive (LTV:CAC 2.65:1) only if installation costs are low. High variance in cost estimates creates fragility.",
            risk: "medium" // 🟡
        },
        {
            category: "Trends",
            assessment: "Post-pandemic 'flight to quality' and focus on employee retention strongly favor wellness-integrated real estate.",
            risk: "low" // 🟢
        }
    ],

    // ═══════════════════════════════════════════════════════════════
    // STRATEGIC FIT: SHOULD WE DO IT?
    // ═══════════════════════════════════════════════════════════════
    shouldWeDoIt: {
        verdict: "Borderline",
        confidence: "Medium",
        summary: "The market opportunity and physical competitive advantage are strong, but the business model relies on unproven customer willingness to pay for 'invisible' physiological benefits.",
        sections: {
            strategicAttractiveness: {
                title: "Strategic Attractiveness of the Prize",
                content: "The global wellness real estate market reached $584 billion in 2024 and is growing at 19.5% annually, significantly outpacing the 5.5% growth of the general construction sector. Successful execution offers a path to operating margins exceeding 20% through recurring 'Wellbeing-as-a-Service' (WaaS) revenue, compared to single-digit margins in traditional contracting. However, the specific addressable market for Kajima is constrained to the $15–25 billion Japanese commercial sector, and the projected 4.4–7.7% rental premiums remain theoretical without signed letters of intent."
            },
            strategicFit: {
                title: "Strategic Fit with the Organization",
                content: "This venture aligns directly with Kajima's FY2025 R&D roadmap to transition from a commodity 'Pipe' business model to a value-added 'Service' model. It leverages existing R&D streams and utilizes the 'Technology Curator' strategy to mitigate hardware risks. However, the requirement for agile software iteration and 'fail-fast' validation conflicts with the organization's risk-averse, zero-defect construction culture, creating a potential operational mismatch."
            },
            strategicEdge: {
                title: "Strategic Edge / Unfair Advantage",
                content: "Kajima holds a defensible moat in 'Integrated Design-Build' capabilities that software-first competitors like Johnson Controls cannot replicate. While competitors can retrofit sensors, Kajima can embed wellbeing features into the physical structure—such as the 'Sky-apier' ceiling or 'Soto-beya' semi-outdoor spaces—during the build phase. Additionally, Kajima's 'WellnessGPT' ontology offers a proprietary method for correlating environmental stimuli with human outcomes, provided the underlying data collection is legally viable."
            }
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // STRATEGIC FIT: CAN WE DO IT?
    // ═══════════════════════════════════════════════════════════════
    canWeDoIt: {
        verdict: "No",
        confidence: "High",
        summary: "While Kajima has the capital and engineering prowess, it currently lacks the specific commercial leadership and data-privacy capabilities required to execute a data-driven service business.",
        sections: {
            hardAssets: {
                title: "Hard Assets (Physical/Financial Capacity)",
                content: "Kajima has the necessary capital capacity to fund the ¥5.5 billion peak requirement and owns the physical testbeds (K/Park, existing office assets) required for immediate piloting. The organization's supply chain and procurement power allow it to manufacture proprietary hardware prototypes like 'Sound Aircon' at scale, a capability that pure-play tech startups lack."
            },
            marketAccess: {
                title: "Market Relationship (Market Access)",
                content: "The organization possesses deep relationships with corporate tenants and building owners, but the sales channel is currently misaligned. Kajima's existing sales force targets facility managers and procurement departments focused on cost reduction, whereas this solution requires consultative selling to CHROs and CFOs focused on productivity and talent retention. The 'Retrofit-First' entry strategy mitigates this by leveraging existing client assets for faster validation cycles."
            },
            softAssets: {
                title: "Soft Assets (People & Skills)",
                content: "The team is technically overweight but commercially underweight. While the engineering talent across the six R&D streams is world-class, the team lacks a dedicated Product Manager or Commercial Lead with experience in B2B SaaS or health-tech commercialization. Furthermore, the organization lacks the internal legal and compliance expertise to navigate the complex APPI regulations regarding biometric data, which is a critical dependency for the 'Sensing' pillar."
            }
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // TEAM ANALYSIS
    // ═══════════════════════════════════════════════════════════════
    teamAnalysis: {
        summary: "The current team structure is heavily skewed toward technical R&D, possessing world-class expertise in architectural engineering, biophilic design, and sensor integration. This engineering density ensures high fidelity in the physical product and hardware prototyping. However, the team is critically underweight in commercial execution.",
        gaps: [
            {
                role: "Product Manager / Commercial Lead",
                severity: "critical",
                detail: "No dedicated PM or Commercial Lead with B2B SaaS or health-tech commercialization experience."
            },
            {
                role: "Legal & Compliance Expert",
                severity: "critical",
                detail: "Lacks internal expertise to navigate APPI regulations regarding biometric data."
            },
            {
                role: "Venture Lead with P&L Authority",
                severity: "high",
                detail: "Prerequisite for moving beyond validation phase."
            }
        ],
        recommendation: "To mitigate execution risk, the appointment of a 'Venture Lead' with P&L authority and a Product Manager with software experience is a prerequisite for moving beyond the validation phase."
    },

    // ═══════════════════════════════════════════════════════════════
    // SECTION: OPPORTUNITY VALIDATION
    // ═══════════════════════════════════════════════════════════════
    sections: {
        oppValidation: {
            title: "Opportunity Validation Analysis",
            problem: {
                title: "Problem & Solution",
                content: "Commercial real estate suffers from a decoupling of building standards from occupant physiology, resulting in 'Sick Building Syndrome' and measurable productivity losses estimated at $200 billion annually in the U.S. alone. Corporate tenants face acute retention challenges, with 93% of construction-related firms struggling to find skilled workers, driving demand for 'experience-based workplaces' that actively support mental health rather than just maintaining temperature.",
                solution: "The proposed solution is a 'Wellbeing Technologies' platform that integrates architectural design with biometric feedback loops to actively regulate stress and focus. Unlike passive certifications (LEED/WELL), this solution uses real-time environmental adjustments to deliver quantifiable physiological outcomes. Market data confirms tenants pay a 4.4–7.7% rental premium for wellness-certified commercial buildings, validating the economic demand for health-optimized assets."
            },
            market: {
                title: "Market Summary",
                content: "The Global Wellness Real Estate market reached $438.2 billion in 2023 and is projected to grow at 15.8% CAGR to $912.6 billion by 2028, significantly outpacing the broader construction industry's 5.5% growth. Demand is shifting from residential luxury to commercial necessity, driven by a 'flight to quality' where Grade A offices with wellness amenities outperform commodity assets in occupancy and rent.",
                keyFact: "The single most important market fact is the divergence in growth rates (19.5% wellness vs. 5.5% general construction), indicating a structural reallocation of capital toward health-performance assets."
            },
            competition: {
                title: "Competitive Landscape",
                competitors: [
                    {
                        name: "Delos (Standard-Setter)",
                        strength: "Owns the WELL Standard and 'Darwin' ecosystem; high brand authority.",
                        weakness: "Lacks construction capability; relies on partners for implementation."
                    },
                    {
                        name: "Johnson Controls (Tech Incumbent)",
                        strength: "Dominates building hardware (6.98% market share) and data layers (OpenBlue).",
                        weakness: "Solutions are primarily retrofits; cannot alter physical architecture."
                    },
                    {
                        name: "Mitsubishi Estate (Domestic Rival)",
                        strength: "Dominant Japanese market share and 'Smart City' platform control.",
                        weakness: "Reliance on vendor lock-in; slower to adopt third-party innovations."
                    }
                ],
                whiteSpace: "The 'White Space' for this venture lies in 'Bio-Adaptive Integrated Construction'—embedding physiological feedback loops into the physical structure (e.g., airflow, spatial layout) where software-only competitors cannot compete.",
                criticalThreat: "The critical threat is the commoditization of wellness via low-cost retrofits (sensors + apps) that deliver 80% of the benefit at 10% of the cost without new construction."
            },
            regulatory: {
                title: "Regulatory & Legal Summary",
                content: "Japan's Act on the Protection of Personal Information (APPI) constitutes a significant barrier to entry rather than a moat. The proposed collection of physiological and behavioral data triggers strict consent obligations for 'special care-required personal information,' potentially rendering the high-tech sensing layer operationally undeployable in standard workplaces without 70%+ employee opt-in.",
                ipRisk: "The external intellectual property landscape for 'workplace monitoring' is dense and heavily patented, creating freedom-to-operate risks."
            },
            metaAnalysis: {
                title: "Meta-Analysis",
                verdict: "Fundamentally valid but conditionally attractive",
                content: "The macroeconomic signal is strong: a $15–25B addressable market in Japan growing at double-digit rates, supported by verified rental premiums of 4.4–7.7% for wellness assets. The customer problem (productivity/retention) is urgent and financially material to the target enterprise segment. However, the opportunity is constrained by two critical exogenous threats: regulatory friction and technological substitution."
            }
        },

        // ═══════════════════════════════════════════════════════════════
        // SECTION: PATH TO SUCCESS
        // ═══════════════════════════════════════════════════════════════
        pathToSuccess: {
            title: "Path to Success Analysis",
            productTech: {
                title: "Product & Technology",
                content: "The solution integrates mature physical assets with an experimental digital logic layer. While architectural components like 'Soto-beya' pods and 'Sky-apier' ceilings are ready for deployment, the 'WellnessGPT' correlation engine and physiological sensing stack remain at Technology Readiness Level 4-5 (lab validation) and require advancement to TRL 7 (operational prototype) within six months.",
                keyDependency: "A critical technical dependency is the 'Hardware-Lifecycle Mismatch' between 50-year building structures and 3-5 year sensor lifecycles. The architecture must strictly follow a 'skin-and-skeleton' design that decouples digital infrastructure from the physical core.",
                threshold: "The system must achieve an 85% correlation with clinical-grade devices to prove it can accurately distinguish environmental stress from personal stress."
            },
            gtm: {
                title: "Go-to-Market",
                content: "The strategy targets Large Enterprise Corporate Tenants in Japan using a 'Retrofit-First' entry point to shorten feedback loops from the standard 3-5 year construction cycle to a 3-6 month renovation cycle. Kajima will operate as a 'Technology Curator,' integrating third-party sensors from partners like Omron and Honeywell rather than manufacturing proprietary hardware.",
                salesRequirement: "Commercialization requires a specialized consultative sales overlay to bypass traditional cost-focused construction bidding. This team must sell directly to CHROs and CFOs by framing the solution as a talent retention tool rather than a real estate cost.",
                successCriteria: "Success depends on securing 3 signed Letters of Intent (LOI) during the validation phase."
            },
            revenueModel: {
                title: "Revenue & Business Model",
                content: "The venture employs a hybrid revenue model combining a one-time construction premium (targeting 4.4–7.7%) with a recurring 'Wellbeing-as-a-Service' (WaaS) subscription priced at ¥15M annually per project. This structure aims to generate a Lifetime Gross Profit of ¥41M per project and achieve an LTV:CAC ratio of 2.65:1.",
                risk: "Financial viability relies heavily on controlling installation costs. The current model assumes a base installation cost of ¥15M, but operational analysis suggests this could balloon to ¥83M depending on integration complexity. If installation costs exceed ¥50M, the project fails to meet internal margin targets."
            },
            linchpin: {
                title: "Strategic Linchpin",
                content: "The strategic 'linchpin' for this entire path is the regulatory viability of biometric monitoring under Japan's APPI. If the legal review determines that collecting physiological data requires explicit, revocable consent from every individual employee, the 'active sensing' value proposition becomes operationally impossible to deploy at scale. This would force a retreat to a lower-margin 'Design-Only' model, stripping away the recurring revenue potential of the digital platform."
            }
        },

        // ═══════════════════════════════════════════════════════════════
        // SECTION: OPERATIONS
        // ═══════════════════════════════════════════════════════════════
        operations: {
            title: "Operations Analysis",
            unitEconomics: {
                title: "Unit Economics Summary",
                metrics: [
                    { label: "Lifetime Revenue per Project", value: "¥225M", detail: "Per 10,000 sqm project" },
                    { label: "Construction Premium (One-time)", value: "¥75M", detail: "One-time" },
                    { label: "WaaS Subscription", value: "¥15M/year", detail: "Recurring" },
                    { label: "Lifetime Gross Profit", value: "¥41M", detail: "Base case" },
                    { label: "LTV:CAC Ratio", value: "2.65:1", detail: "≥2.5:1 threshold" }
                ],
                criticalAssumption: "These margins rely on a critical, unvalidated assumption: that sensor installation labor costs will not exceed ¥15M per project.",
                risk: "Operational time-and-motion analyses indicate actual installation costs could reach ¥83M, a 5.5x variance from the model. If costs exceed ¥60M, the unit economics turn negative without significant price increases."
            },
            financials: {
                title: "Key Financial Metrics",
                phases: [
                    { metric: "Revenue", year1: "¥0 (Internal Pilots)", year3: "¥450M (Projected)" },
                    { metric: "Gross Margin", year1: "N/A", year3: "25.8% (Target)" },
                    { metric: "Capital Requirement", year1: "¥300M (Tranche 1)", year3: "¥5.5B (Cumulative Peak)" },
                    { metric: "EBITDA Status", year1: "Negative", year3: "Negative (Positive Y4)" },
                    { metric: "Payback Period", year1: "N/A", year3: "12–13 Years" },
                    { metric: "LTV:CAC", year1: "Unvalidated", year3: "2.65:1" }
                ],
                operationalPriority: "The immediate operational priority is a ¥300M 'Tranche 1' validation phase to confirm installation costs and willingness-to-pay before committing to the full rollout.",
                hardwareTrap: "A significant operational risk is the 'Hardware Trap,' where 3-5 year sensor lifecycles clash with 50-year building lifecycles; the financial model assumes a hardware refresh in Year 5 and Year 10."
            },
            legal: {
                title: "Legal & IP Constraints",
                appiRisk: "Japan's Act on the Protection of Personal Information (APPI) creates a potential operational showstopper for the 'Sensing' and 'People Flow' pillars. Collecting physiological data (e.g., stress levels, pulse) constitutes 'special care-required personal information,' requiring explicit, revocable consent from every individual occupant.",
                requirement: "Operationally, this necessitates a 'Privacy by Design' architecture where data is processed at the edge and anonymized immediately; storing raw biometric data in the cloud would likely trigger compliance violations and tenant rejection.",
                patentRisk: "The venture also faces a crowded external patent landscape for workplace monitoring, requiring an immediate Freedom-to-Operate (FTO) search to avoid infringement lawsuits."
            },
            executionReadiness: {
                title: "Execution Readiness",
                verdict: "Partial/Weak",
                content: "While Kajima possesses world-class physical construction capabilities, the initiative lacks the commercial and digital maturity required for execution. The team has deep engineering expertise but lacks a Product Manager or Commercial Lead to navigate the complex B2B sales cycle for intangible wellbeing outcomes. The 'two-speed' conflict between the risk-averse construction culture and the agile iteration required for software validation threatens to stall the necessary 90-day testing cycles.",
                materialRisk: "The most material risk is the Installation Cost Variance (¥15M vs. ¥83M). If the higher cost estimate proves accurate, the business model is structurally unprofitable at current pricing."
            }
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // ACTION PLAN (Next Steps Table)
    // ═══════════════════════════════════════════════════════════════
    actionPlan: [
        {
            step: 1,
            title: "Validate Regulatory Viability (APPI)",
            rationale: "The core value proposition relies on biometric data and behavioral tracking. Japan's APPI may classify this as 'special care-required' data, requiring impractical individual consent.",
            activities: [
                "Commission a formal legal opinion on the specific sensor stack regarding workplace consent requirements.",
                "Draft a 'Data Governance Charter' defining anonymization protocols for edge processing.",
                "Confirm if a 'Safe Harbor' exists for aggregated data usage without individual opt-in."
            ],
            successGate: "Legal Clearance: Formal legal opinion confirms deployment is viable with <20% opt-out rate.",
            fallback: "If blocked, pivot immediately to 'Option A: Design Focus' (remove sensors)."
        },
        {
            step: 2,
            title: "Confirm Commercial Willingness to Pay (WTP)",
            rationale: "There is currently zero direct evidence that Japanese corporate tenants will pay the projected 4.4–7.7% premium for monitoring technology versus standard design.",
            activities: [
                "Conduct deep-dive interviews with 10 corporate real estate directors targeting the 'Wellbeing Premium' hypothesis.",
                "Pitch three distinct offer tiers (Design-only vs. Tech-enabled) to existing clients.",
                "Secure non-binding Letters of Intent (LOIs) that explicitly itemize the technology premium."
            ],
            successGate: "Commercial Validation: Secure 3 signed LOIs with a confirmed price premium of ≥5% over standard Grade-A rates.",
            fallback: "If customers refuse premiums, pivot to 'Option C: Consulting Services.'"
        },
        {
            step: 3,
            title: "Validate Installation Unit Economics",
            rationale: "Installation cost estimates vary from ¥15M (model) to ¥83M (time-motion analysis). If costs exceed ¥50M, the LTV:CAC ratio drops below investable thresholds.",
            activities: [
                "Execute a limited 'Retrofit Pilot' in an existing Kajima facility to measure actual installation labor hours.",
                "Audit the 'Technology Curator' supply chain to lock in hardware pricing with vendors like Omron or Honeywell.",
                "Update the financial model with verified installation data."
            ],
            successGate: "Economic Viability: Verified installation cost ≤¥25M per 10,000 sqm project.",
            fallback: "If costs >¥50M, pause scaling until value engineering reduces labor intensity."
        },
        {
            step: 4,
            title: "Appoint Commercial Leadership",
            rationale: "The current team is 'technically overweight' (R&D focus) and lacks a Product Manager or Commercial Lead to drive sales and product-market fit.",
            activities: [
                "Hire or appoint a 'Venture Lead' with P&L authority distinct from the construction division.",
                "Recruit a Product Manager with B2B SaaS experience to own the roadmap and user experience.",
                "Establish the 'Wellbeing Business Promotion Office' (WBPO) governance structure."
            ],
            successGate: "Team Readiness: Key commercial roles filled within 30 days.",
            fallback: "Do not release Tranche 2 funding (¥700M) until commercial leadership is in place."
        },
        {
            step: 5,
            title: "Decouple Hardware Architecture",
            rationale: "Embedding sensors with a 3-5 year lifecycle into buildings with a 50-year lifecycle creates a 'Hardware Trap' and obsolescence liability.",
            activities: [
                "Finalize a 'Skin and Skeleton' technical specification where sensors are treated as FF&E (Furniture, Fixtures, and Equipment).",
                "Redesign ceiling/wall integration to allow sensor replacement without demolition.",
                "Secure API stability guarantees from key hardware partners."
            ],
            successGate: "Technical Feasibility: Engineering approval of a modular architecture that allows 100% sensor replacement in <48 hours per floor.",
            fallback: null
        },
        {
            step: 6,
            title: "Verify 'WellnessGPT' Accuracy",
            rationale: "The 'science-based' claim relies on the internal 'WellnessGPT' model. If the model hallucinates or cites non-existent medical benefits, Kajima faces reputational and liability risk.",
            activities: [
                "Conduct an external audit of 100 random WellnessGPT recommendations against medical literature (PubMed).",
                "Benchmark sensor accuracy against clinical-grade devices in a controlled lab test."
            ],
            successGate: "Data Integrity: >90% alignment with medical consensus and >85% correlation with clinical sensors.",
            fallback: "If accuracy is low, restrict claims to 'comfort' rather than 'health.'"
        }
    ],

    // ═══════════════════════════════════════════════════════════════
    // SUMMARY STATS (for dashboard widgets)
    // ═══════════════════════════════════════════════════════════════
    summaryStats: [
        { label: "Global TAM", value: "$584B", helper: "19.5% CAGR" },
        { label: "Japan SAM", value: "$15B–$25B", helper: "Commercial Sector" },
        { label: "Rent Premium", value: "4.4–7.7%", helper: "Wellness-Certified" },
        { label: "LTV:CAC", value: "2.65:1", helper: "Target Ratio" },
        { label: "Tranche 1", value: "¥300M", helper: "Validation Budget" },
        { label: "Payback", value: "12–13 yrs", helper: "Full Investment" }
    ],

    // ═══════════════════════════════════════════════════════════════
    // INVESTMENT COMMITTEE (Placeholder)
    // ═══════════════════════════════════════════════════════════════
    investmentCommittee: {
        title: "Investment Committee",
        subtitle: "What Would We Have to Believe?",
        beliefs: [], // To be populated
        placeholder: true
    }
};

// Make available globally
window.memoData = memoData;
