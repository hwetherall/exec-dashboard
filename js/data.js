const memoData = {
    companyInfo: {
        name: "Avasa Medical",
        stage: "Series A",
        industry: "Medical Device / MedTech",
        location: "Auckland, New Zealand",
        headline: "Precision arterial couplers that replace 40-minute manual suturing",
        status: "pass",
        decision: "Pass – Strategic Mismatch",
        raiseAmount: "NZ$4.75M Series A",
        valuationNote: "Funding request leaves ~14 months of runway",
    },
    summaryStats: [
        {
            label: "Funding Ask",
            value: "NZ$4.75M",
            helper: "Projected 14-mo runway incl. tax credits",
        },
        {
            label: "Realistic TAM",
            value: "US$120M",
            helper: "Founder claims US$30B (+250x)",
        },
        {
            label: "Procedure Time",
            value: "-80%",
            helper: "From 40 min to sub-10 min",
        },
        {
            label: "Gross Margin Claim",
            value: "97-98%",
            helper: "Benchmark 65-75% for MedTech",
        },
        {
            label: "Monthly Burn",
            value: "NZ$330K",
            helper: "Pre-revenue, largely R&D",
        },
        {
            label: "Regulatory Path",
            value: "FDA 510(k)",
            helper: "Class II, submit Q3'25",
        },
    ],
    executiveSummary: {
        short: "While technically feasible, Avasa Medical represents a strategic dead-end for Mayfield. The niche market size ($120M TAM), unverified unit economics, and hardware scaling risks do not align with our venture-scale return requirements. Despite our ability to fund it, the opportunity cost is too high.",
        long: "The core investment thesis fails on strategic alignment. While the technology addresses a clinical need, the market is too small to support a venture-scale outcome. The team lacks commercial DNA, and the financial model relies on 'nonsense' gross margin assumptions (98%). This is a classic 'trap' investment: a working product in a market that doesn't matter.",
        highlights: [
            {
                title: "Unserved Clinical Need",
                detail: "Targeting a genuine 'blue ocean' arterial coupling market where the incumbent failed.",
            },
            {
                title: "Technical Moat",
                detail: "Novel mechanical design with pending patents requiring high-precision manufacturing.",
            },
            {
                title: "Strategic Synergy",
                detail: "Potential to de-risk manufacturing scale-up using corporate partner's automation expertise.",
            },
        ],
        watchouts: [
            "Niche Market Reality: Realistic TAM is US$120M, overstated by 250x by founder.",
            "Critical Team Gap: Complete absence of commercial, sales, and regulatory leadership.",
            "Flawed Financials: Business model predicated on unviable 98% gross margin.",
        ],
        matrix: {
            canWeDoIt: "High (Strong Capability)",
            shouldWeDoIt: "Low (No Strategic Fit)",
            canWeDoItText: "Mayfield has the capital and network to scale this, but it requires heavy operational lifting outside our core software/AI DNA.",
            shouldWeDoItText: "Niche market, unproven economics, and hardware risk make this a 'nonsense' bet for a venture fund seeking power-law returns.",
        }
    },
    riskAnalysis: {
        overall: "High-risk, high-potential project. Technical solution to a validated need is undermined by flawed market assessment, unproven commercial team, and precarious deal structure.",
        topRisks: [
            {
                title: "Misrepresented TAM & Unviable Economics",
                detail: "Founder's $30B TAM claim is overstated by 250x; 98% gross margin assumption is unrealistic.",
            },
            {
                title: "Critical Commercial Execution Gap",
                detail: "Founding team has world-class clinical expertise but zero commercial/sales leadership.",
            },
            {
                title: "Funding Shortfall & Governance Opacity",
                detail: "NZ$4.75M raise is insufficient to reach FDA clearance; lack of term sheet details.",
            },
        ],
        sixTs: [
            {
                title: "Team",
                severity: "medium",
                rating: "Mixed",
                summary: "Strong technical founder, critical commercial gap. Key-person dependency on two co-inventors.",
            },
            {
                title: "TAM",
                severity: "high",
                rating: "Niche",
                summary: "Niche opportunity ($120M realistic TAM) with flawed market sizing by founder.",
            },
            {
                title: "Technology",
                severity: "medium",
                rating: "Unproven",
                summary: "Plausible innovation; key risks: performance in diseased arteries and IP defensibility.",
            },
            {
                title: "Traction",
                severity: "high",
                rating: "Zero",
                summary: "Zero commercial traction. Validation is purely qualitative (surgeon interest).",
            },
            {
                title: "Trends",
                severity: "medium",
                rating: "Mixed",
                summary: "Aligned with surgical efficiency trends but hampered by standard of care inertia.",
            },
            {
                title: "Terms",
                severity: "high",
                rating: "High Risk",
                summary: "Unrealistic economics, insufficient funding runway, and material inconsistencies in financials.",
            },
        ],
    },
    chapters: [
        {
            id: "opportunity-validation",
            title: "Opportunity Validation",
            summary: "Avasa targets the unserved arterial coupling segment. Manual suturing takes ~40 mins with 5.6% failure. Avasa promises 80% faster procedure time. Strong qualitative demand (89% surgeon interest), but adoption hurdle is high.",
            keyMetrics: [
                {
                    label: "Procedure Time",
                    value: "-80%",
                    description: "Reduction vs. 40-min manual suturing.",
                },
                {
                    label: "Surgeon Interest",
                    value: "89%",
                    description: "Of 100 surveyed surgeons want arterial coupler.",
                },
                {
                    label: "Animal Success",
                    value: "100%",
                    description: "Patency in chronic animal studies (n=17).",
                },
            ],
            tables: [
                {
                    title: "Validation Signals",
                    headers: ["Signal", "Source", "Assessment"],
                    rows: [
                        ["Surgeon Demand", "Company Survey", "Strong but qualitative."],
                        ["Pre-clinical Data", "Animal Studies", "Strong technical feasibility."],
                        ["Market Gap", "Incumbent Failure", "Clear 'blue ocean' opportunity."],
                    ],
                },
            ],
            contentBlocks: [
                {
                    title: "Core Problem",
                    body: "Manual suturing of micro-arteries is slow, risky, and technically demanding. Existing venous couplers cannot handle arterial pressure/stiffness.",
                },
                {
                    title: "Validation Gaps",
                    body: "No commercial commitments. Success depends on overcoming surgeon inertia and proving efficacy in diseased human arteries.",
                },
            ],
            callouts: [
                {
                    tone: "info",
                    text: "Opportunity is valid but fragile; hinges on converting clinical interest into sales.",
                },
            ],
        },
        {
            id: "product-and-technology",
            title: "Product & Technology",
            summary: "Three-part system: disposable coupler, handset, reusable applicator. Core innovation is 'zero-strain' attachment. Validated in animals, but manufacturing scale-up to 20-micron tolerance is a major risk.",
            keyMetrics: [
                {
                    label: "Tolerance",
                    value: "20 µm",
                    description: "Required manufacturing precision.",
                },
                {
                    label: "Regulatory",
                    value: "Class II",
                    description: "FDA 510(k) pathway confirmed.",
                },
                {
                    label: "Patency",
                    value: "100%",
                    description: "In chronic ovine studies.",
                },
            ],
            contentBlocks: [
                {
                    title: "Technical Status",
                    body: "Design frozen, pre-production units tested. Pending FDA submission Q3 2025.",
                },
                {
                    title: "Key Risks",
                    body: "Performance in calcified human arteries unproven. Manufacturing scalability at required precision is a significant hurdle.",
                },
            ],
            callouts: [
                {
                    tone: "danger",
                    text: "Funding gap: Projected burn exceeds raise, risking insolvency before FDA clearance.",
                },
            ],
        },
        {
            id: "market-research",
            title: "Market Research",
            summary: "Realistic TAM is ~$120M (device-specific), contrasting with founder's $30B claim. Beachhead in plastic surgery is ~$54M. Market growth is steady (~7% CAGR).",
            keyMetrics: [
                { label: "Realistic TAM", value: "US$120M", description: "Device-specific market size." },
                { label: "Founder Claim", value: "US$30B", description: "Based on total procedure value (inflated)." },
                { label: "CAGR", value: "6.9%", description: "Projected market growth." },
            ],
            charts: [
                {
                    id: "market-chart",
                    type: "bar",
                    title: "Market Size Reality Check",
                    labels: ["Founder Claim (TAM)", "Realistic TAM", "Beachhead SAM"],
                    datasets: [
                        {
                            label: "Market Size (US$M)",
                            data: [30000, 120, 54],
                            backgroundColor: ["#ef4444", "#3b82f6", "#60a5fa"],
                        },
                    ],
                    options: {
                        indexAxis: 'y',
                        scales: {
                            x: {
                                ticks: {
                                    callback: (value) => `$${value}M`,
                                },
                            },
                        },
                    },
                },
            ],
            contentBlocks: [
                {
                    title: "Market Dynamics",
                    body: "Niche but attractive. Growth driven by shift to microsurgery and efficiency. Unserved arterial segment is the key opportunity.",
                },
            ],
            callouts: [
                {
                    tone: "info",
                    text: "Valuation must be anchored to the $120M realistic TAM, not the founder's $30B figure.",
                },
            ],
        },
        {
            id: "competitive-analysis",
            title: "Competitive Analysis",
            summary: "Primary competitor is manual suturing (status quo). Incumbent Synovis dominates veins but failed in arteries. Lydus Medical (FDA cleared) is a key emerging threat.",
            keyMetrics: [
                { label: "Primary Rival", value: "Manual Suturing", description: "Entrenched standard of care." },
                { label: "Incumbent", value: "Synovis", description: "Venous market leader; failed in arteries." },
                { label: "Emerging Threat", value: "Lydus Medical", description: "FDA cleared suture aid." },
            ],
            tables: [
                {
                    title: "Competitive Landscape",
                    headers: ["Competitor", "Strength", "Weakness"],
                    rows: [
                        ["Manual Suturing", "Standard of care, cheap.", "Slow (40m), high failure rate (5.6%)."],
                        ["Synovis (Baxter)", "Market leader, distribution.", "Technology failed for arteries."],
                        ["Lydus Medical", "FDA cleared, first mover.", "Suture aid, not a true coupler."],
                    ],
                },
            ],
            contentBlocks: [
                {
                    title: "Differentiation",
                    body: "Avasa's 'zero-strain' mechanism allows arterial coupling. Reversibility is a key safety feature missing in competitors.",
                },
            ],
            callouts: [
                {
                    tone: "danger",
                    text: "Lydus Medical has a head start with FDA clearance. Avasa must prove clinical superiority.",
                },
            ],
        },
        {
            id: "go-to-market",
            title: "Go To Market",
            summary: "Surgeon-led strategy. Phase 1: Soft launch at 3 KOL sites (MD Anderson, etc.). Phase 2: Scale via distributors. Critical dependency on KOLs to navigate hospital procurement.",
            keyMetrics: [
                { label: "Launch Strategy", value: "KOL-led", description: "Soft launch at 3 major centers." },
                { label: "Sales Model", value: "Hybrid", description: "Direct to key accounts, distributors for scale." },
                { label: "Distributor Fee", value: "35%", description: "Assumed margin share." },
            ],
            tables: [
                {
                    title: "Launch Phases",
                    headers: ["Phase", "Focus", "Timeline"],
                    rows: [
                        ["Soft Launch", "3 KOL Sites, Clinical Data", "Q3 2026"],
                        ["Hard Launch", "US & NZ Expansion", "2028"],
                        ["Global Scale", "EU, Asia, Australia", "2029+"],
                    ],
                },
            ],
            contentBlocks: [
                {
                    title: "Execution Risks",
                    body: "Heavy reliance on KOLs. No commercial team in place. Sales ramp projections are aggressive and unvalidated.",
                },
            ],
            callouts: [
                {
                    tone: "danger",
                    text: "Need to hire US-based commercial leader immediately to de-risk launch.",
                },
            ],
        },
        {
            id: "revenue-model",
            title: "Revenue Model",
            summary: "Razor-and-blade model: Reusable applicator ($3K) + Single-use coupler ($3K). Premium pricing strategy. Viability depends on unproven 98% gross margin and premium price acceptance.",
            keyMetrics: [
                { label: "Coupler Price", value: "US$3,000", description: "Target ASP per consumable." },
                { label: "Applicator Price", value: "US$3,000", description: "One-time hardware sale." },
                { label: "Gross Margin", value: "97-98%", description: "Projected (Highly Optimistic)." },
            ],
            contentBlocks: [
                {
                    title: "Pricing Logic",
                    body: "Priced to fit within existing DRG reimbursement bundles. Justified by OR time savings ($1k/patient saved).",
                },
                {
                    title: "Model Weakness",
                    body: "Margins are outliers vs industry (65%). COGS assumptions are conflicting and unverified.",
                },
            ],
            callouts: [
                {
                    tone: "info",
                    text: "Verify COGS and price acceptance with independent procurement officers.",
                },
            ],
        },
        {
            id: "unit-economics",
            title: "Unit Economics",
            summary: "Projected economics are theoretical and aggressive. 97-98% GM is an outlier. No CAC data exists. Model sensitive to price and sales volume.",
            keyMetrics: [
                { label: "Gross Margin", value: "97-98%", description: "Vs. MedTech median ~65%." },
                { label: "COGS (Coupler)", value: "NZ$73", description: "Conflicting data (Deck says $46)." },
                { label: "Breakeven", value: "2030", description: "Projected EBITDA positive." },
            ],
            charts: [
                {
                    id: "margin-comp-chart",
                    type: "bar",
                    title: "Gross Margin Comparison",
                    labels: ["Avasa (Projected)", "Medtronic", "Industry Median"],
                    datasets: [
                        {
                            label: "Gross Margin %",
                            data: [98, 65, 65.1],
                            backgroundColor: ["#f59e0b", "#3b82f6", "#94a3b8"],
                        },
                    ],
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true,
                                max: 100,
                            },
                        },
                    },
                },
            ],
            contentBlocks: [
                {
                    title: "Data Integrity",
                    body: "COGS discrepancy ($73 vs $46) undermines confidence. No historical CAC data.",
                },
            ],
            callouts: [
                {
                    tone: "danger",
                    text: "Rebuild model with 65-75% GM to test viability.",
                },
            ],
        },
        {
            id: "finance-and-operations",
            title: "Finance & Operations",
            summary: "Seeking NZ$4.75M Series A. Run-rate analysis suggests funding gap before FDA clearance. Revenue projections ($10M in Y1 sales) are unrealistic given lack of sales capacity.",
            keyMetrics: [
                { label: "Raise Ask", value: "NZ$4.75M", description: "Series A." },
                { label: "Burn Rate", value: "NZ$330k/mo", description: "Projected average." },
                { label: "Runway", value: "19.5 mo", description: "Short of 24-mo FDA timeline." },
            ],
            charts: [
                {
                    id: "burn-runway-chart",
                    type: "line",
                    title: "Capital vs. Milestones",
                    labels: ["Close", "6 Mo", "12 Mo", "18 Mo", "FDA Clearance (24 Mo)"],
                    datasets: [
                        {
                            label: "Projected Cash Balance",
                            data: [6.45, 4.5, 2.5, 0.5, -1.5], // Illustrative drop
                            borderColor: "#ef4444",
                            fill: false,
                        },
                    ],
                },
            ],
            contentBlocks: [
                {
                    title: "Funding Gap",
                    body: "Projected burn ($7.9M) exceeds raise + tax credits ($6.45M). Likely need for bridge round.",
                },
                {
                    title: "Sales Ramp",
                    body: "Revenue forecast assumes unrealistic sales rep productivity ($5M/rep).",
                },
            ],
            callouts: [
                {
                    tone: "danger",
                    text: "Deal must be restructured to fully fund through FDA clearance (NZ$8M+).",
                },
            ],
        },
        {
            id: "team-and-execution",
            title: "Team & Execution",
            summary: "Strong technical/clinical founder (Dr. Abeysekera). Critical gap in commercial/sales leadership. Success hinges on founder's ability to transition to CEO and hire experienced execs.",
            keyMetrics: [
                { label: "Founder", value: "Strong", description: "Clinical + Bioengineering background." },
                { label: "Commercial", value: "Weak", description: "No in-house sales/marketing leadership." },
                { label: "Advisors", value: "Strong", description: "Top-tier KOL network." },
            ],
            contentBlocks: [
                {
                    title: "Key Person Risk",
                    body: "High dependency on founder. Need to hire COO/CSO.",
                },
                {
                    title: "Execution Capability",
                    body: "Good R&D execution so far. Commercial execution is completely unproven.",
                },
            ],
            callouts: [
                {
                    tone: "info",
                    text: "Invest contingent on hiring US-based commercial leader.",
                },
            ],
        },
        {
            id: "legal-and-ip",
            title: "Legal & IP",
            summary: "Patents pending in key markets. Manufacturing trade secrets (20-micron tolerance). Competitor patent (Flow Doppler) poses risk to future pipeline. Regulatory path: FDA 510(k) Class II.",
            keyMetrics: [
                { label: "IP Status", value: "Pending", description: "USA, EU, China, Japan, Korea." },
                { label: "FTO", value: "Unverified", description: "Company claim only." },
                { label: "FDA Path", value: "510(k)", description: "Class II, Q2 2026 Clearance." },
            ],
            contentBlocks: [
                {
                    title: "IP Landscape",
                    body: "Core device IP filed. Competitor holds patent relevant to future 'Flow Doppler' product.",
                },
                {
                    title: "Data Privacy",
                    body: "Gap in plan for handling patient data (HIPAA/GDPR) for clinical trials.",
                },
            ],
            callouts: [
                {
                    tone: "info",
                    text: "Commission independent FTO analysis before closing.",
                },
            ],
        },
    ],
};

window.memoData = memoData;
