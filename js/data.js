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
    depthMode: {
        theAsk: "¥30M / 120 Days",
        thePrize: "$438B TAM",
        theBlocker: "APPI Privacy Risk",
        gutCheck: "Look, the strategy team loves the buzzwords—'Bio-Adaptive,' 'WellnessGPT'—but operationally, this is a minefield. We build static assets, not privacy-invasive data platforms. Let them sell one pilot to a stranger in the next four months; if they can't get a signed check without us subsidizing it, we kill the tech layer.",
        goConditions: [
            "APPI legal opinion confirms deployability in corporate settings",
            "1+ signed LOI from non-Kajima client at hardware premium price",
            "Pilot data shows >15% improvement in occupant satisfaction"
        ],
        validationPlan: [
            { 
                phase: "1", 
                title: "Packaging", 
                days: "Days 1-30", 
                tasks: ["Define 'Wellbeing SKU' (Soto-beya + sensors)", "Create ROI-focused sales deck (productivity, not specs)"], 
                output: "Sales Deck & Pricing Model" 
            },
            { 
                phase: "2", 
                title: "Sales Testing", 
                days: "Days 31-90", 
                tasks: ["Pitch to 15 existing corporate clients", "Test specific pricing tiers (CapEx vs OpEx)"], 
                output: "3+ LOIs at 10%+ premium" 
            },
            { 
                phase: "3", 
                title: "Compliance", 
                days: "Days 31-60 (parallel)", 
                tasks: ["Third-party APPI audit of sensor suite", "Draft data usage agreements"], 
                output: "Clean legal opinion" 
            },
            { 
                phase: "4", 
                title: "Decision Gate", 
                days: "Day 120", 
                tasks: ["🟢 GO if: 3+ LOIs + Clean legal + Pilot data", "🟡 PIVOT if: Interest but no premium", "🔴 KILL if: Zero LOIs or regulatory block"], 
                output: "Final Recommendation" 
            }
        ],
        discussionQuestions: [
            "Are we willing to create a separate comp band to hire data scientists who earn more than our senior engineers?",
            "If APPI blocks biometric sensing, does the remaining 'low-tech' wellness market justify this R&D investment?",
            "Why haven't we sold a pilot yet? Is it price, product, or channel?"
        ]
    },
    summaryStats: [
        {
            label: "Global TAM",
            value: "$438B",
            helper: "CAGR 15.8% (Wellness Real Estate)"
        },
        {
            label: "Japan SOM",
            value: "$1.5B–$3.0B",
            helper: "Class A Office Segment"
        },
        {
            label: "Rent Premium",
            value: "4.4%–7.7%",
            helper: "Benchmark for Healthy Buildings"
        },
        {
            label: "Validation Budget",
            value: "¥30M",
            helper: "120-Day Pilot Phase"
        },
        {
            label: "Sales Cycle",
            value: "6–12 Months",
            helper: "B2B Enterprise Sales"
        },
        {
            label: "Target Premium",
            value: "15%",
            helper: "Required for Unit Economics"
        },
    ],
    decisionFrameworks: {
        beliefLens: [
            {
                belief: "Willingness to Pay",
                statement: "We believe corporate tenants will pay a 15% CapEx premium for 'biological outcomes' (e.g., lower stress), not just for the 'WELL Certified' plaque.",
                status: "Unproven"
            },
            {
                belief: "Regulatory Viability",
                statement: "We believe we can legally deploy AI cameras and biometric sensors in Japanese offices under APPI without triggering a privacy backlash or liability crisis.",
                status: "High Risk"
            },
            {
                belief: "Causal Validity",
                statement: "We believe our 'Bio-Adaptive' algorithms can prove that the building *caused* the productivity increase, differentiating us from commodity sensors.",
                status: "In Lab Validation"
            },
            {
                belief: "Technology Curator",
                statement: "We believe we can integrate third-party sensors (Honeywell/Sony) better than the vendors themselves, avoiding the 'Zombie Tech' obsolescence trap.",
                status: "Assumption"
            }
        ],
        strategicLens: {
            shouldWe: {
                rating: "Borderline (Medium Confidence)",
                rationale: "The market size ($438B) and 'Flight to Quality' trend are perfect fits for Kajima's strategy to escape commodity construction. However, the product-market fit for a high-cost, privacy-invasive solution is unproven against cheaper software retrofits.",
                dimensions: [
                    { label: "Prize", value: "High", text: "$1.1T market by 2029." },
                    { label: "Fit", value: "High", text: "Aligns with pivot to Services." },
                    { label: "Advantage", value: "Medium", text: "Hardware integration is unique but slow." }
                ]
            },
            canWe: {
                rating: "No (High Confidence on Digital)",
                rationale: "We have the hard assets (cash, R&D labs, client access) but lack the critical soft assets (Medical leadership, SaaS product DNA). We are a builder trying to be a software company.",
                dimensions: [
                    { label: "Hard Assets", value: "Yes", text: "Strong balance sheet & R&D facilities." },
                    { label: "Market Access", value: "Yes", text: "Deep ties with Tier-1 developers." },
                    { label: "Soft Assets", value: "No", text: "Missing CMO & Head of Product." }
                ]
            }
        },
        debateClub: [
            {
                persona: "The Innovation Hawk",
                role: "Strategy Lead",
                text: "Look, if we don't do this, we're just pouring concrete for the next 50 years while margins shrink. The 'Flight to Quality' is real. Tenants are begging for offices that make people want to commute. We own the building; we should own the data layer."
            },
            {
                persona: "The Operator",
                role: "Construction GM",
                text: "Tenants beg for 'wellness' until they see the bill. You want to add 15% to the construction cost for sensors that will be obsolete in 3 years? That's 'Zombie Tech'. And who manages the software updates? My site foremen? We don't have the people."
            },
            {
                persona: "The Risk Hawk",
                role: "Legal Counsel",
                text: "Forget the cost. You want to put AI cameras tracking 'stress' in a Japanese office? One APPI privacy lawsuit and our brand is toxic. Unless you can prove this works without facial recognition, it's a non-starter."
            },
            {
                persona: "The Innovation Hawk",
                role: "Strategy Lead",
                text: "That's why we do the 'Trojan Horse' pilot. We test it in *our* HQ first. If we can prove it lowers sick days by 10%, the privacy concerns vanish because the ROI is undeniable. We can't be afraid of the future."
            }
        ]
    },
    executiveSummary: {
        short: "This decision review evaluates whether Kajima should proceed with pilot deployment and phased commercialization of its well-being building technologies. The initiative targets the $438B global wellness real estate market but faces significant execution risks regarding digital capabilities and privacy regulations.",
        strategicGoal: "Evaluate whether Kajima should proceed with pilot deployment and phased commercialization of the 'Bio-Adaptive' building platform to capture the wellness real estate opportunity.",
        recommendation: {
            title: "Phased Go (Conditional)",
            detail: "Proceed with a 120-day internal pilot to validate core technology claims and privacy compliance, contingent on securing external legal opinion on APPI requirements and at least one Letter of Intent from a non-Kajima client."
        },
        keyOpportunities: [
            {
                title: "Market Timing",
                detail: "Post-pandemic 'Flight to Quality' trend creates unprecedented demand for differentiated office spaces."
            },
            {
                title: "Vertical Integration",
                detail: "Unique position as builder + technology provider enables embedded solutions competitors cannot replicate."
            },
            {
                title: "Data Moat",
                detail: "First-mover advantage in collecting building-occupant biometric correlations creates defensible IP."
            }
        ],
        highlights: [
            {
                title: "Strategic Fit",
                detail: "Aligned with corporate goal to transition from 'Asset Delivery' to 'Service Delivery'. Captures the post-pandemic 'Flight to Quality'.",
            },
            {
                title: "Differentiation",
                detail: "Unique 'Bio-Adaptive' loop links physical design (Space) with biometric data (Psychology), a claim competitors cannot easily match.",
            },
            {
                title: "Hard Asset Advantage",
                detail: "Leverages Kajima's 'Japan-first' footprint and R&D facilities (ST1-ST6) to prototype faster than software startups.",
            },
        ],
        watchouts: [
            "Regulatory Showstopper: APPI privacy laws regarding biometric data could render the core tech undeployable.",
            "Commercial Gap: Zero validated willingness-to-pay for the 15% premium; split-incentive problem remains unsolved.",
            "Capability Mismatch: Critical lack of Digital Product and Medical leadership to execute a SaaS/Data business.",
        ],
        matrix: {
            canWeDoIt: "Low (Digital Gap)",
            shouldWeDoIt: "Borderline (Unproven WTP)",
            canWeDoItText: "We can build the hardware, but we lack the 'Software DNA' and medical authority to sell the outcome.",
            shouldWeDoItText: "The market is attractive, but the specific product-market fit for a high-privacy, high-cost solution is theoretical.",
        }
    },
    riskAnalysis: {
        overall: "High-risk, High-reward venture. The physical execution is low-risk, but the digital and commercial execution faces structural barriers (Privacy, Pricing, Talent).",
        sixTs: [
            {
                title: "Team",
                severity: "high",
                rating: "Critical Gap",
                summary: "Strong engineering, but missing Chief Medical Officer and Head of Product. 'Hardware-Software Asymmetry' risk.",
            },
            {
                title: "TAM",
                severity: "medium",
                rating: "Constrained",
                summary: "$438B Global market, but addressable market is limited by the 'split-incentive' problem in commercial leases.",
            },
            {
                title: "Technology",
                severity: "high",
                rating: "Obsolescence",
                summary: "Embedding 3-year sensors in 50-year buildings creates 'Zombie Tech' liability. Integration is complex.",
            },
            {
                title: "Traction",
                severity: "high",
                rating: "Zero",
                summary: "Advanced prototypes (K/Park), but zero paying external customers. Validation is purely internal.",
            },
            {
                title: "Trends",
                severity: "medium",
                rating: "Mixed",
                summary: "Tailwind: Wellness demand. Headwind: Privacy regulation (APPI/GDPR) against surveillance.",
            },
            {
                title: "Terms",
                severity: "low",
                rating: "Internal",
                summary: "Corporate funded. Primary risk is internal transfer pricing and R&D allocation, not external deal terms.",
            },
        ],
        topRisks: [
            {
                title: "APPI Privacy Compliance",
                detail: "Biometric data collection under Japan's Act on the Protection of Personal Information could face legal challenges without explicit consent frameworks."
            },
            {
                title: "Technology Obsolescence",
                detail: "Embedding 3-year tech lifecycle sensors in 50-year buildings creates 'Zombie Tech' liability and upgrade complexity."
            },
            {
                title: "Talent Gap",
                detail: "Critical absence of Chief Medical Officer and Head of Digital Product to lead the SaaS/data platform vision."
            }
        ],
    },
    capabilityGaps: [
        {
            role: "Chief Medical Officer",
            severity: "critical",
            reason: "No internal medical authority to validate health claims or navigate regulatory requirements for biometric interventions."
        },
        {
            role: "Head of Digital Product",
            severity: "critical",
            reason: "SaaS/Data platform requires product management DNA that traditional construction firms lack."
        },
        {
            role: "Privacy & Ethics Lead",
            severity: "high",
            reason: "APPI compliance and employee surveillance ethics require dedicated expertise not present in current org."
        }
    ],
    chapters: [
        {
            id: "market-opportunity",
            title: "Chapter 1: Market Opportunity",
            summary: "The Global Wellness Real Estate market is $438B (15.8% CAGR), far outpacing general construction (5.1%). Kajima targets the 'Premium Commercial Office' segment in Japan ($1.5B-$3.0B SAM), driven by the post-pandemic 'Flight to Quality'.",
            keyMetrics: [
                { label: "Global TAM", value: "$438B", description: "Global Wellness Real Estate (GWI)" },
                { label: "Japan SOM", value: "$3.0B", description: "Serviceable Obtainable Market (Office)" },
                { label: "Market Growth", value: "15.8%", description: "CAGR (vs 5.1% for Construction)" },
            ],
            charts: [
                {
                    id: "market-chart",
                    type: "bar",
                    title: "Market Size Context (USD Billions)",
                    labels: ["Global Wellness RE", "Smart Buildings", "Japan Premium Office (SAM)"],
                    datasets: [
                        {
                            label: "Market Size ($B)",
                            data: [438, 126, 3],
                            backgroundColor: ["#3b82f6", "#94a3b8", "#ef4444"],
                        }
                    ]
                }
            ],
            contentBlocks: [
                {
                    title: "The 'Flight to Quality'",
                    body: "Tenants are abandoning B-grade stock. The market bifurcates: premium 'Wellness' buildings command rents, while standard buildings face vacancy. Kajima must be on the right side of this split.",
                },
                {
                    title: "Adoption Curve",
                    body: "We are in the 'Early Adopter' phase for Bio-Adaptive tech. While 'Wellness' is standard, 'Active Biometric Feedback' is a frontier market.",
                }
            ]
        },
        {
            id: "competitor-landscape",
            title: "Chapter 2: Competitor Landscape",
            summary: "Kajima fights a 'Two-Front War'. On one side, Tech Incumbents (Honeywell, Delos) own the data standards. On the other, Domestic GCs (Obayashi, Shimizu) are fast-followers on hardware. Kajima's differentiation is the *integration* of both.",
            keyMetrics: [
                { label: "Delos/WELL", value: "74k+", description: "Locations Registered/Certified" },
                { label: "Honeywell", value: "Scale", description: "Dominates Sensors/BMS" },
                { label: "Kajima", value: "0", description: "Commercial Pilots Signed" },
            ],
            tables: [
                {
                    title: "Competitive Threat Matrix",
                    headers: ["Competitor Type", "Who", "Threat Level", "Why"],
                    rows: [
                        ["Standard Setters", "Delos (WELL)", "High", "They own the 'Badge'. Customers buy the plaque, not the tech."],
                        ["Tech Giants", "Honeywell, JCI", "High", "They own the 'Brain'. Their sensors are cheaper and open-platform."],
                        ["Domestic GCs", "Obayashi, Shimizu", "Medium", "Fast-followers. Can replicate hardware if our IP isn't defensible."]
                    ]
                }
            ],
            contentBlocks: [
                {
                    title: "The Commoditization Risk",
                    body: "If 'Wellness' becomes just air quality sensors and lights, Honeywell wins on cost. Kajima must prove that *Architectural* integration drives superior biological outcomes.",
                }
            ]
        },
        {
            id: "product-technology",
            title: "Chapter 3: Product & Technology",
            summary: "A 'Bio-Adaptive' platform combining 6 R&D streams (ST1-ST6). Mature on hardware (TRL 9), but immature on data logic (TRL 4). Key innovation is the 'WellnessGPT' and closed-loop feedback system.",
            keyMetrics: [
                { label: "Physical Tech", value: "TRL 9", description: "Ready (Sky-apier, Sound Aircon)" },
                { label: "Bio-Logic", value: "TRL 4", description: "In Validation (Causality Unproven)" },
                { label: "Integration", value: "Med", description: "Depends on 3rd party sensors" },
            ],
            tables: [
                {
                    title: "Implementation Roadmap",
                    headers: ["Phase", "Timeline", "Focus", "Goal"],
                    rows: [
                        ["1. Validate", "Days 0-90", "Internal Data", "Prove 'Causality' in Kajima HQ."],
                        ["2. Pilot", "Months 4-12", "Friendly Client", "Test 'Willingness to Pay'."],
                        ["3. Scale", "Year 2+", "Commercial", "Standardize offerings."]
                    ]
                }
            ],
            contentBlocks: [
                {
                    title: "The 'Zombie Tech' Risk",
                    body: "Embedding 3-year sensors into 50-year buildings is dangerous. We must adopt a 'Layered Architecture' where tech can be swapped without construction work.",
                }
            ]
        },
        {
            id: "gtm-strategy",
            title: "Chapter 4: Go-To-Market (GTM)",
            summary: "Strategy: 'Trojan Horse'. Enter via modular retrofits (Soto-beya) to prove value, then upsell full builds. Execution relies on a 'Technology Curator' model (partnering for sensors) rather than manufacturing.",
            keyMetrics: [
                { label: "Strategy", value: "Trojan Horse", description: "Retrofit First, Build Later" },
                { label: "Model", value: "Curator", description: "Buy Sensors, Build Spaces" },
                { label: "Partner", value: "IWBI", description: "Keystone Partner for Credibility" },
            ],
            contentBlocks: [
                {
                    title: "Entry Point: The 'Soto-beya' Pod",
                    body: "A modular recovery room that can be dropped into any office. It generates the biometric data needed to prove the 'Wellness' thesis without a 3-year construction delay.",
                },
                {
                    title: "Sales Channel Conflict",
                    body: "Current sales teams sell 'Square Meters'. This product requires selling 'Productivity'. We need a specialized 'Solution Architect' overlay team.",
                }
            ]
        },
        {
            id: "financial-operational",
            title: "Chapter 5: Financial & Operational Health (BUNDLED)",
            summary: "Financials show a 'J-Curve' profile: high upfront R&D/Talent costs with delayed revenue. Success hinges on capturing a 15-25% premium, but the 'Split-Incentive' problem (Developer pays, Tenant gains) puts this at risk.",
            keyMetrics: [
                { label: "Target Premium", value: "15-25%", description: "Required for Break-even" },
                { label: "Rent Uplift", value: "4-7%", description: "Market Benchmark (Validated)" },
                { label: "Gross Margin", value: "Unknown", description: "Heavily dependent on SaaS mix" },
            ],
            charts: [
                {
                    id: "financial-chart",
                    type: "line",
                    title: "Projected Cash Flow Profile (J-Curve)",
                    labels: ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5"],
                    datasets: [
                        {
                            label: "Cumulative Cash Flow",
                            data: [-450, -850, -1000, -400, 300], 
                            borderColor: "#f59e0b",
                            backgroundColor: "rgba(245, 158, 11, 0.1)",
                            fill: true,
                            tension: 0.4,
                        }
                    ],
                    options: {
                        responsive: true,
                        maintainAspectRatio: true,
                        plugins: {
                            legend: {
                                display: true,
                                position: 'top',
                            },
                            tooltip: {
                                mode: 'index',
                                intersect: false,
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: false,
                                ticks: {
                                    callback: function(value) {
                                        return value.toLocaleString();
                                    }
                                }
                            }
                        }
                    }
                }
            ],
            contentBlocks: [
                {
                    title: "The Split-Incentive Block",
                    body: "Developers struggle to pass CapEx costs to tenants. We must explore 'Performance Contracting' where we share the risk/reward of rental premiums.",
                },
                {
                    title: "Unit Economics",
                    body: "Currently inverted. High fixed costs (R&D team) + Low volume. We need to reach 'SaaS-like' recurring revenue to offset the overhead.",
                }
            ],
            callouts: [
                {
                    tone: "danger",
                    text: "Without recurring revenue (Data/SaaS), this is just a lower-margin construction project with higher overhead.",
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
                    body: "World-class construction engineering but weak 'Digital Product' DNA. Need to hire external specialized talent.",
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