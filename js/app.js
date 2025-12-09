let currentSectionId = "executive-summary";
let activeCharts = [];
let currentDepthMode = "5min"; // Options: "1min", "5min", "10min", "deep"

const DEPTH_MODES = {
    "1min": { label: "1 MIN", description: "Elevator Verdict", icon: "⚡" },
    "5min": { label: "5 MIN", description: "Quick Brief", icon: "📋" },
    "10min": { label: "10 MIN", description: "IC Prep", icon: "📊" },
    "deep": { label: "DEEP DIVE", description: "Full Analysis", icon: "🔍" }
};

document.addEventListener("DOMContentLoaded", () => {
    // Initialize i18n
    const initialLang = I18n.getLanguage();
    
    // Load appropriate data based on language
    loadDataForLanguage(initialLang);
    
    // Listen for language changes
    I18n.onLanguageChange((lang) => {
        loadDataForLanguage(lang);
        // Re-render current view
        initDashboard(window.memoData);
        // Re-render sub-components if active
        if (currentSectionId === 'hypothesis-tracker') {
            HypothesisTracker.render();
        } else if (currentSectionId === 'lens-debate') {
            renderDebateClub(window.memoData);
        }
    });
});

function loadDataForLanguage(lang) {
    if (lang === 'ja' && window.memoDataJP) {
        window.memoData = window.memoDataJP;
    } else {
        // Fallback to standard memoData (English)
        // We assume data.js loaded first and defined window.memoData
        // But if we switched to JP, window.memoData became JP
        // We need to restore English data. 
        // Ideally we should have memoDataEN and memoDataJP.
        // For now, let's reload data.js content if needed or assume 
        // we can keep a reference to the original English data.
        if (window.memoDataJP && window.memoData === window.memoDataJP) {
             // Reload page to restore English data if we don't have a clean reference
             // Or better: in index.html we loaded data.js which set window.memoData.
             // Let's save that reference on load.
             if (!window.memoDataEN) {
                 // This runs only once hopefully or we need to ensure data.js runs first
                 // and we capture it.
                 // Actually, let's handle this by storing EN data in a separate var on first load
                 console.warn("English data reference lost, reloading page might be needed or ensure data.js saves to a distinct variable.");
                 location.reload();
             } else {
                 window.memoData = window.memoDataEN;
             }
        }
    }
    
    if (!window.memoData) {
        console.error("Memo data is missing.");
        return;
    }
    initDashboard(window.memoData);
}

// Store original English data on first load
// We need to patch data.js to store in memoDataEN too, or do it here if it's already loaded
if (window.memoData && !window.memoDataEN) {
    window.memoDataEN = window.memoData;
}


const icons = {
    overview: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>`,
    chapter: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
    risk: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
    checkmark: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
    grid: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>`,
    message: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`,
    target: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>`,
    logo: `<img src="assets/kajima-logo.png" alt="Kajima Logo" class="logo-img">`,
    globe: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`
};

function initDashboard(data) {
    const app = document.getElementById("app");
    app.innerHTML = `
        <aside class="sidebar">
            <div class="logo-area">
                ${icons.logo}
                <div>
                    <small>${I18n.t('app.title')}</small>
                </div>
            </div>
            <div class="sidebar-company-card">
                <p class="sidebar-company-name">${data.companyInfo.name}</p>
                <p class="sidebar-company-meta">${data.companyInfo.stage} · ${data.companyInfo.industry}</p>
                <p class="sidebar-company-meta">${data.companyInfo.location}</p>
            </div>
            <nav class="nav-menu" id="navMenu"></nav>
        </aside>
        <main class="main-content">
            ${buildHeader(data.companyInfo)}
            <div class="content-scroll">
                <div class="content-container" id="contentContainer"></div>
            </div>
        </main>
    `;

    renderSidebar(data);
    
    // Maintain current section if possible, else default to executive summary
    if (currentSectionId === "executive-summary") {
        renderExecutiveSummary(data);
    } else {
        handleNavigation(currentSectionId, data);
    }
}

function buildHeader(companyInfo) {
    const badgeClass = getStatusBadge(companyInfo.status);
    // Truncate long decision text for the badge, but keep full text accessible
    const shortDecision = companyInfo.decision.split('–')[0].split('with')[0].trim();
    const currentLang = I18n.getLanguage();
    const nextLangLabel = currentLang === 'en' ? '日本語' : 'EN';
    
    return `
        <header class="top-header">
            <div class="company-title">
                <h1>${companyInfo.name}</h1>
                <p class="company-subtitle">${companyInfo.headline}</p>
            </div>
            <div class="company-meta">
                <span>${companyInfo.stage}</span>
                <span>${companyInfo.location}</span>
                <span class="status-badge ${badgeClass}" title="${companyInfo.decision}">${shortDecision}</span>
                
                <button class="lang-toggle" id="langToggle" onclick="I18n.toggleLanguage()">
                    <span class="lang-toggle-icon">${icons.globe}</span>
                    <span>${nextLangLabel}</span>
                </button>
            </div>
        </header>
    `;
}

function getStatusBadge(status) {
    switch (status) {
        case "invest":
            return "status-invest";
        case "pass":
            return "status-pass";
        default:
            return "status-diligence";
    }
}

function renderSidebar(data) {
    const navMenu = document.getElementById("navMenu");
    const navSections = [
        {
            label: I18n.t("nav.overview"),
            items: [{ id: "executive-summary", label: I18n.t("nav.exec_summary"), icon: icons.overview }],
        },
        {
            label: I18n.t("nav.planning"),
            items: [{ id: "hypothesis-tracker", label: I18n.t("nav.hypothesis_tracker"), icon: icons.target }],
        },
        {
            label: I18n.t("nav.chapters"),
            items: data.chapters.map((chapter) => ({
                id: chapter.id,
                label: chapter.title,
                icon: icons.chapter
            })),
        },
        {
            label: I18n.t("nav.risk"),
            items: [{ id: "six-t-risk", label: I18n.t("nav.six_t_risk"), icon: icons.risk }],
        },
        {
            label: I18n.t("nav.decision_lens"),
            items: [
                { id: "lens-belief", label: I18n.t("nav.belief_check"), icon: icons.checkmark },
                { id: "lens-strategy", label: I18n.t("nav.strategy_matrix"), icon: icons.grid },
                { id: "lens-debate", label: I18n.t("nav.debate_club"), icon: icons.message },
            ],
        },
    ];

    navMenu.innerHTML = navSections
        .map(
            (section) => `
            <div class="nav-section">
                <p class="nav-section-label">${section.label}</p>
                ${section.items
                    .map(
                        (item) => `
                    <button class="nav-item ${item.id === currentSectionId ? "active" : ""}" data-target="${item.id}">
                        <span class="nav-icon">${item.icon}</span>
                        ${item.label}
                    </button>
                `
                    )
                    .join("")}
            </div>
        `
        )
        .join("");

    navMenu.querySelectorAll(".nav-item").forEach((button) => {
        button.addEventListener("click", (event) => {
            const targetId = event.currentTarget.dataset.target;
            handleNavigation(targetId, data);
        });
    });
}

function handleNavigation(targetId, data) {
    // Don't return early if clicking same tab, as we might need to re-render language
    currentSectionId = targetId;

    document
        .querySelectorAll(".nav-item")
        .forEach((btn) => btn.classList.toggle("active", btn.dataset.target === targetId));

    if (targetId === "executive-summary") {
        renderExecutiveSummary(data);
        return;
    }

    if (targetId === "six-t-risk") {
        renderRiskMatrixSection(data);
        return;
    }

    if (targetId === "lens-belief") {
        renderBeliefLens(data);
        return;
    }

    if (targetId === "lens-strategy") {
        renderStrategicLens(data);
        return;
    }

    if (targetId === "lens-debate") {
        renderDebateClub(data);
        return;
    }

    if (targetId === "hypothesis-tracker") {
        triggerAnimation();
        destroyActiveCharts();
        HypothesisTracker.render();
        return;
    }

    const chapter = data.chapters.find((c) => c.id === targetId);
    if (chapter) {
        renderChapter(chapter);
    }
}

function triggerAnimation() {
    const container = document.getElementById("contentContainer");
    if (container) {
        container.style.animation = 'none';
        container.offsetHeight; /* trigger reflow */
        container.style.animation = null; 
    }
}

function renderDepthModeSwitcher() {
    const modes = Object.entries(DEPTH_MODES).map(([key, mode]) => `
        <button class="depth-mode-btn ${currentDepthMode === key ? 'active' : ''}" data-mode="${key}">
            <span class="depth-mode-icon">${mode.icon}</span>
            <span class="depth-mode-label">${mode.label}</span>
            <span class="depth-mode-desc">${mode.description}</span>
        </button>
    `).join('');

    return `
        <div class="depth-mode-switcher">
            <div class="depth-mode-header">
                <span class="depth-mode-question">${I18n.t("depth.question")}</span>
            </div>
            <div class="depth-mode-buttons">
                ${modes}
            </div>
        </div>
    `;
}

function setupDepthModeListeners() {
    document.querySelectorAll('.depth-mode-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const newMode = e.currentTarget.dataset.mode;
            if (newMode !== currentDepthMode) {
                currentDepthMode = newMode;
                renderExecutiveSummary(window.memoData);
            }
        });
    });
}

function renderExecutiveSummary(data) {
    triggerAnimation();
    destroyActiveCharts();
    const container = document.getElementById("contentContainer");

    // Build content based on depth mode
    let content = '';
    
    // Always show the depth mode switcher first
    content += renderDepthModeSwitcher();

    // 1 MINUTE MODE - Just the verdict
    content += render1MinContent(data);

    // 5 MINUTE MODE - Add opportunities, risks, should/can
    if (["5min", "10min", "deep"].includes(currentDepthMode)) {
        content += render5MinContent(data);
    }

    // 10 MINUTE MODE - Add 6T breakdown, capability gaps, action plan
    if (["10min", "deep"].includes(currentDepthMode)) {
        content += render10MinContent(data);
    }

    // DEEP DIVE MODE - Add all remaining content
    if (currentDepthMode === "deep") {
        content += renderDeepDiveContent(data);
    }

    container.innerHTML = content;
    
    // Setup event listeners for depth mode buttons
    setupDepthModeListeners();
}

function render1MinContent(data) {
    const decisionClass = data.companyInfo.status === "pass" ? "verdict-pass" : 
                          data.companyInfo.status === "invest" ? "verdict-go" : "verdict-conditional";
    
    return `
        <!-- VERDICT BANNER -->
        <div class="verdict-banner ${decisionClass}">
            <div class="verdict-badge">
                <span class="verdict-icon">${data.companyInfo.status === "pass" ? "🔴" : data.companyInfo.status === "invest" ? "🟢" : "🟡"}</span>
                <span class="verdict-text">${data.companyInfo.decision}</span>
            </div>
            <p class="verdict-oneliner">${data.executiveSummary.recommendation.detail}</p>
        </div>

        <!-- THE QUICK STATS -->
        <div class="quick-stats-row">
            <div class="quick-stat">
                <span class="quick-stat-label">${I18n.t("depth.the_ask")}</span>
                <span class="quick-stat-value">${data.depthMode?.theAsk || "¥30M / 120 Days"}</span>
            </div>
            <div class="quick-stat">
                <span class="quick-stat-label">${I18n.t("depth.the_prize")}</span>
                <span class="quick-stat-value">${data.depthMode?.thePrize || "$438B TAM"}</span>
            </div>
            <div class="quick-stat blocker">
                <span class="quick-stat-label">${I18n.t("depth.the_blocker")}</span>
                <span class="quick-stat-value">${data.depthMode?.theBlocker || "APPI Privacy"}</span>
            </div>
        </div>

        <!-- GUT CHECK QUOTE -->
        <div class="gut-check-quote">
            <div class="quote-icon">💬</div>
            <blockquote>${data.depthMode?.gutCheck || "Let them sell one pilot to a stranger first. If they can't get a signed check without us subsidizing it, we kill the tech layer."}</blockquote>
        </div>
    `;
}

function render5MinContent(data) {
    return `
        <!-- KEY METRICS STRIP -->
        ${renderSummaryWidgets(data.summaryStats)}

        <!-- OPPORTUNITIES VS RISKS -->
        ${renderOpportunitiesRisks(data)}

        <!-- SHOULD WE / CAN WE -->
        <section class="should-can-section">
            <h3>${I18n.t("depth.strategic_tension")}</h3>
            <div class="should-can-grid">
                <div class="should-can-card should">
                    <h4>${I18n.t("matrix.should_we")}</h4>
                    <div class="should-can-rating">${data.executiveSummary.matrix.shouldWeDoIt}</div>
                    <p>${data.executiveSummary.matrix.shouldWeDoItText}</p>
                </div>
                <div class="should-can-card can">
                    <h4>${I18n.t("matrix.can_we")}</h4>
                    <div class="should-can-rating">${data.executiveSummary.matrix.canWeDoIt}</div>
                    <p>${data.executiveSummary.matrix.canWeDoItText}</p>
                </div>
            </div>
        </section>

        <!-- GO CONDITIONS -->
        <section class="go-conditions">
            <h3>${I18n.t("depth.go_conditions")}</h3>
            <div class="conditions-list">
                ${(data.depthMode?.goConditions || [
                    "APPI legal opinion confirms deployability in corporate settings",
                    "1+ signed LOI from non-Kajima client at hardware premium price",
                    "Pilot data shows >15% improvement in occupant satisfaction"
                ]).map(condition => `
                    <div class="condition-item">
                        <span class="condition-checkbox">☐</span>
                        <span class="condition-text">${condition}</span>
                    </div>
                `).join('')}
            </div>
        </section>
    `;
}

function render10MinContent(data) {
    // Build 6T Risk Scorecard
    const sixTCards = data.riskAnalysis.sixTs.map(risk => {
        const severityClass = risk.severity === "high" ? "severity-high" : 
                             risk.severity === "medium" ? "severity-medium" : "severity-low";
        return `
            <div class="sixT-row ${severityClass}">
                <div class="sixT-name">${risk.title}</div>
                <div class="sixT-severity">
                    <span class="severity-badge ${risk.severity}">${risk.severity.toUpperCase()}</span>
                </div>
                <div class="sixT-summary">${risk.summary}</div>
            </div>
        `;
    }).join('');

    return `
        <!-- 6T RISK SCORECARD -->
        <section class="sixT-scorecard">
            <h3>${I18n.t("depth.sixT_scorecard")}</h3>
            <div class="sixT-table">
                ${sixTCards}
            </div>
        </section>

        <!-- CAPABILITY GAPS -->
        ${renderCapabilityGaps(data.capabilityGaps)}

        <!-- 120-DAY VALIDATION PLAN -->
        <section class="validation-plan">
            <h3>${I18n.t("depth.validation_plan")}</h3>
            <div class="plan-phases">
                ${(data.depthMode?.validationPlan || [
                    { phase: "1", title: "Packaging", days: "Days 1-30", tasks: ["Define 'Wellbeing SKU' (Soto-beya + sensors)", "Create ROI-focused sales deck"], output: "Sales Deck & Pricing Model" },
                    { phase: "2", title: "Sales Testing", days: "Days 31-90", tasks: ["Pitch to 15 existing corporate clients", "Test specific pricing tiers"], output: "3+ LOIs at 10%+ premium" },
                    { phase: "3", title: "Compliance", days: "Days 31-60", tasks: ["Third-party APPI audit of sensor suite"], output: "Clean legal opinion" },
                    { phase: "4", title: "Decision Gate", days: "Day 120", tasks: ["🟢 GO if: 3+ LOIs + Clean legal + Pilot data", "🟡 PIVOT if: Interest but no premium", "🔴 KILL if: Zero LOIs or regulatory block"], output: "Final Recommendation" }
                ]).map(phase => `
                    <div class="plan-phase">
                        <div class="phase-header">
                            <span class="phase-number">Phase ${phase.phase}</span>
                            <span class="phase-title">${phase.title}</span>
                            <span class="phase-days">${phase.days}</span>
                        </div>
                        <div class="phase-tasks">
                            ${phase.tasks.map(task => `<div class="phase-task">• ${task}</div>`).join('')}
                        </div>
                        <div class="phase-output">
                            <strong>Output:</strong> ${phase.output}
                        </div>
                    </div>
                `).join('')}
            </div>
        </section>

        <!-- DISCUSSION QUESTIONS -->
        <section class="discussion-questions">
            <h3>${I18n.t("depth.discussion_questions")}</h3>
            <div class="questions-list">
                ${(data.depthMode?.discussionQuestions || [
                    "Are we willing to create a separate comp band to hire data scientists who earn more than our senior engineers?",
                    "If APPI blocks biometric sensing, does the remaining 'low-tech' wellness market justify this R&D investment?",
                    "Why haven't we sold a pilot yet? Is it price, product, or channel?"
                ]).map((q, i) => `
                    <div class="question-item">
                        <span class="question-number">${i + 1}</span>
                        <span class="question-text">"${q}"</span>
                    </div>
                `).join('')}
            </div>
        </section>
    `;
}

function renderDeepDiveContent(data) {
    const highlights = data.executiveSummary.highlights
        .map(
            (highlight) => `
            <div class="highlight-card">
                <p class="highlight-title">${highlight.title}</p>
                <p class="highlight-detail">${highlight.detail}</p>
            </div>
        `
        )
        .join("");

    return `
        <!-- Strategic Goal Banner -->
        <div class="strategic-banner">
            <h2>${I18n.t("exec.strategic_goal")}</h2>
            <p>${data.executiveSummary.strategicGoal}</p>
        </div>

        <!-- Strategic Highlights -->
        <section class="content-block">
            <h3>${I18n.t("exec.strategic_highlights")}</h3>
            <div class="highlight-grid">
                ${highlights}
            </div>
        </section>

        <!-- 6T Risk Overview -->
        ${renderRiskMatrixCard(data.riskAnalysis, true)}

        <!-- Strategic Matrix -->
        <section class="content-block">
            <h3>${I18n.t("exec.strategic_matrix")}</h3>
            <div class="matrix-container">
                <div class="matrix-grid-wrapper">
                    <div class="matrix-axis-y"><span>${I18n.t("matrix.y_axis")}</span></div>
                    <div class="matrix-2x2">
                        <div class="quadrant top-left">
                            <span class="quadrant-label">${I18n.t("matrix.quad.top_left")}</span>
                        </div>
                        <div class="quadrant top-right">
                            <span class="quadrant-label">${I18n.t("matrix.quad.top_right")}</span>
                        </div>
                        <div class="quadrant bottom-left">
                            <span class="quadrant-label">${I18n.t("matrix.quad.bottom_left")}</span>
                        </div>
                        <div class="quadrant bottom-right">
                            <span class="quadrant-label">${I18n.t("matrix.quad.bottom_right")}</span>
                        </div>
                        
                        <!-- Dynamic Marker -->
                        <div class="matrix-marker-dot" style="top: 75%; left: 75%;">
                            <div class="marker-label">${I18n.t("matrix.you_are_here")}</div>
                        </div>
                    </div>
                </div>
                <div class="matrix-axis-x"><span>${I18n.t("matrix.x_axis")}</span></div>
                
                <div class="matrix-text-summary">
                    <div class="matrix-text-item">
                        <strong>${I18n.t("matrix.can_we")}</strong>: ${data.executiveSummary.matrix.canWeDoIt}
                        <p>${data.executiveSummary.matrix.canWeDoItText}</p>
                    </div>
                    <div class="matrix-text-item">
                        <strong>${I18n.t("matrix.should_we")}</strong>: ${data.executiveSummary.matrix.shouldWeDoIt}
                        <p>${data.executiveSummary.matrix.shouldWeDoItText}</p>
                    </div>
                </div>
            </div>
        </section>
    `;
}


function renderOpportunitiesRisks(data) {
    const opportunities = data.executiveSummary.keyOpportunities || [];
    const risks = data.riskAnalysis.topRisks || [];

    const opportunityItems = opportunities
        .map(
            (item) => `
            <div class="split-item">
                <h4>${item.title}</h4>
                <p>${item.detail}</p>
            </div>
        `
        )
        .join("");

    const riskItems = risks
        .map(
            (item) => `
            <div class="split-item">
                <h4>${item.title}</h4>
                <p>${item.detail}</p>
            </div>
        `
        )
        .join("");

    return `
        <div class="split-panel">
            <div class="split-col opportunities">
                <div class="split-col-header">
                    <div class="split-col-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                            <polyline points="17 6 23 6 23 12"></polyline>
                        </svg>
                    </div>
                    <h3 class="split-col-title">${I18n.t("exec.key_opportunities")}</h3>
                </div>
                ${opportunityItems}
            </div>
            <div class="split-col risks">
                <div class="split-col-header">
                    <div class="split-col-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                            <line x1="12" y1="9" x2="12" y2="13"></line>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                    </div>
                    <h3 class="split-col-title">${I18n.t("exec.critical_risks")}</h3>
                </div>
                ${riskItems}
            </div>
        </div>
    `;
}

function renderCapabilityGaps(gaps) {
    if (!gaps || !gaps.length) return "";

    const gapCards = gaps
        .map(
            (gap) => `
            <div class="gap-card ${gap.severity}">
                <span class="gap-severity">${gap.severity}</span>
                <h4 class="gap-role">${gap.role}</h4>
                <p class="gap-reason">${gap.reason}</p>
            </div>
        `
        )
        .join("");

    return `
        <section class="capability-gaps">
            <div class="capability-gaps-header">
                <h3>${I18n.t("exec.capability_gaps")}</h3>
            </div>
            <div class="capability-gaps-grid">
                ${gapCards}
            </div>
        </section>
    `;
}

function renderRoadmapTimeline(stages) {
    if (!stages || !stages.length) return "";

    const stageItems = stages
        .map(
            (stage) => `
            <div class="roadmap-stage ${stage.active ? 'active' : ''}">
                <div class="roadmap-node">${stage.stage}</div>
                <div class="roadmap-content">
                    <h4 class="roadmap-title">${stage.title}</h4>
                    <p class="roadmap-timeframe">${stage.timeframe}</p>
                    <p class="roadmap-actions">${stage.actions}</p>
                </div>
            </div>
        `
        )
        .join("");

    return `
        <section class="content-block">
            <h3>${I18n.t("exec.roadmap")}</h3>
            <div class="roadmap-timeline">
                ${stageItems}
            </div>
        </section>
    `;
}

function renderFinancialDashboard(financialData) {
    if (!financialData) return "";

    const unitEconomicsRows = (financialData.unitEconomics || [])
        .map(
            (item) => `
            <div class="financial-stat">
                <span class="financial-stat-label">${item.label}</span>
                <span class="financial-stat-value">${item.value}</span>
            </div>
        `
        )
        .join("");

    const revenueModelRows = (financialData.revenueModel || [])
        .map(
            (item) => `
            <div class="financial-stat">
                <span class="financial-stat-label">${item.label}</span>
                <span class="financial-stat-value">${item.value}</span>
            </div>
        `
        )
        .join("");

    const assumptions = (financialData.keyAssumptions || [])
        .map((item) => `<li>${item}</li>`)
        .join("");

    return `
        <div class="financial-grid">
            <div class="financial-card">
                <div class="financial-card-header">
                    <h4 class="financial-card-title">${I18n.t("fin.unit_economics")}</h4>
                    <span class="financial-card-badge">${I18n.t("fin.core_metrics")}</span>
                </div>
                ${unitEconomicsRows}
            </div>
            <div class="financial-card">
                <div class="financial-card-header">
                    <h4 class="financial-card-title">${I18n.t("fin.revenue_model")}</h4>
                    <span class="financial-card-badge">${I18n.t("fin.revenue_streams")}</span>
                </div>
                ${revenueModelRows}
            </div>
        </div>
        ${assumptions.length ? `
        <section class="content-block">
            <h3>${I18n.t("fin.assumptions")}</h3>
            <ul class="watchouts">
                ${assumptions}
            </ul>
        </section>
        ` : ""}
        <div class="financial-grid">
            <div class="financial-card">
                <div class="financial-card-header">
                    <h4 class="financial-card-title">${I18n.t("fin.revenue_proj")}</h4>
                </div>
                <div class="chart-placeholder">
                    ${I18n.t("fin.chart_pending")}
                </div>
            </div>
            <div class="financial-card">
                <div class="financial-card-header">
                    <h4 class="financial-card-title">${I18n.t("fin.burn_rate")}</h4>
                </div>
                <div class="chart-placeholder">
                    ${I18n.t("fin.chart_pending")}
                </div>
            </div>
        </div>
    `;
}

function renderRiskMatrixCard(riskAnalysis, compact = false) {
    const riskGrid = renderRiskGrid(riskAnalysis.sixTs, compact);
    
    return `
        <section class="risk-matrix" id="riskMatrixSection">
            <div class="risk-matrix-header">
                <div class="risk-matrix-header-content">
                    <h3>${I18n.t("exec.risk_overview")}</h3>
                    <p class="risk-summary">${riskAnalysis.overall}</p>
                </div>
            </div>
            <div class="risk-content">
                ${riskGrid}
            </div>
        </section>
    `;
}

function renderRiskGrid(items, compact = false) {
    return `
        <div class="risk-grid">
            ${items.map(item => `
                <div class="risk-card">
                    <div class="risk-card-header">
                        <span class="risk-title">${item.title}</span>
                        <span class="risk-badge ${item.severity}">${item.severity}</span>
                    </div>
                    <div class="risk-rating">${item.rating}</div>
                    <p class="risk-desc">${item.summary}</p>
                </div>
            `).join('')}
        </div>
    `;
}




function renderSummaryWidgets(stats) {
    const widgets = stats
        .map(
            (stat) => `
            <div class="widget-card">
                <p class="widget-label">${stat.label}</p>
                <p class="widget-value">${stat.value}</p>
                <p class="widget-helper">${stat.helper}</p>
            </div>
        `
        )
        .join("");

    return `
        <section class="summary-widgets">
            ${widgets}
        </section>
    `;
}

function destroyActiveCharts() {
    activeCharts.forEach(chart => chart.destroy());
    activeCharts = [];
}





function renderChapter(chapter) {
    triggerAnimation();
    destroyActiveCharts();
    const container = document.getElementById("contentContainer");

    // Setup chart placeholders if any
    const chartMounts = [];
    let chartsMarkup = "";

    if (chapter.charts && chapter.charts.length) {
        chartsMarkup = chapter.charts.map(c => {
            chartMounts.push(c);
            return `<div class="chart-container"><canvas id="${c.id}"></canvas></div>`;
        }).join("");
    }

    const tablesMarkup = (chapter.tables || [])
        .map(
            (table) => `
            <div class="data-table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            ${table.headers.map((h) => `<th>${h}</th>`).join("")}
                        </tr>
                    </thead>
                    <tbody>
                        ${table.rows
                            .map(
                                (row) => `
                            <tr>
                                ${row.map((cell) => `<td>${cell}</td>`).join("")}
                            </tr>
                        `
                            )
                            .join("")}
                    </tbody>
                </table>
            </div>
        `
        )
        .join("");

    const contentBlocks = (chapter.contentBlocks || [])
        .map(
            (block) => `
            <div class="content-block">
                <h3>${block.title}</h3>
                <p>${block.body}</p>
            </div>
        `
        )
        .join("");

    const callouts = (chapter.callouts || [])
        .map(
            (callout) => `
            <div class="highlight-box ${callout.tone || ""}">
                <p>${callout.text}</p>
            </div>
        `
        )
        .join("");

    const roadmapMarkup = renderRoadmapTimeline(chapter.roadmap);
    const financialMarkup = renderFinancialDashboard(chapter.financialData);

    container.innerHTML = `
        <section class="chapter-header">
            <p class="eyebrow">${I18n.t("common.chapter")}</p>
            <h2 class="chapter-title">${chapter.title}</h2>
            <p class="chapter-summary">${chapter.summary}</p>
        </section>

        ${renderMetrics(chapter.keyMetrics || [])}

        ${financialMarkup}

        ${roadmapMarkup}

        ${chartsMarkup ? `<div class="charts-container">${chartsMarkup}</div>` : ""}

        ${tablesMarkup}
        ${contentBlocks}
        ${callouts}
    `;

    initCharts(chartMounts);

    // Initialize Sensitivity Panel for Financial chapter
    if (chapter.id === "financial-operational") {
        renderSensitivityPanel('contentContainer');
    }
}

function renderMetrics(metrics) {
    if (!metrics.length) return "";
    return `
        <div class="summary-widgets">
            ${metrics.map(m => `
                <div class="widget-card">
                    <p class="widget-label">${m.label}</p>
                    <p class="widget-value">${m.value}</p>
                    <p class="widget-helper">${m.description}</p>
                </div>
            `).join("")}
        </div>
    `;
}

function initCharts(chartConfigs) {
    chartConfigs.forEach(config => {
        const ctx = document.getElementById(config.id);
        if (ctx) {
            const chart = new Chart(ctx, {
                type: config.type,
                data: {
                    labels: config.labels,
                    datasets: config.datasets
                },
                options: config.options || {
                    responsive: true,
                    plugins: {
                        legend: { position: 'top' },
                        title: { display: true, text: config.title }
                    }
                }
            });
            activeCharts.push(chart);
        }
    });
}

// Lens Renders
function renderBeliefLens(data) {
    triggerAnimation();
    destroyActiveCharts();
    const container = document.getElementById("contentContainer");
    const beliefs = data.decisionFrameworks.beliefLens || [];

    container.innerHTML = `
        <section class="chapter-header">
            <p class="eyebrow">${I18n.t("nav.decision_lens")}</p>
            <h2 class="chapter-title">${I18n.t("nav.belief_check")}</h2>
        </section>
        <div class="lens-grid">
            ${beliefs.map(b => `
                <div class="lens-card">
                    <span class="belief-status">${b.status}</span>
                    <h3 style="margin: 1rem 0 0.5rem 0; font-size: 1.1rem;">${b.belief}</h3>
                    <p class="lens-statement">"${b.statement}"</p>
                </div>
            `).join("")}
        </div>
    `;
}

function renderStrategicLens(data) {
    triggerAnimation();
    destroyActiveCharts();
    const container = document.getElementById("contentContainer");
    const lens = data.decisionFrameworks.strategicLens;

    container.innerHTML = `
        <section class="chapter-header">
            <p class="eyebrow">${I18n.t("nav.decision_lens")}</p>
            <h2 class="chapter-title">${I18n.t("nav.strategy_matrix")}</h2>
        </section>
        <section class="content-block">
            <div class="lens-grid">
                <div class="lens-card">
                    <h3 style="margin-bottom:1rem;">${I18n.t("matrix.should_we")}</h3>
                    <p style="font-size:1.2rem; font-weight:700; margin-bottom:1rem;">${lens.shouldWe.rating}</p>
                    <p style="margin-bottom:1.5rem; line-height:1.6; color:var(--text-secondary);">${lens.shouldWe.rationale}</p>
                    ${lens.shouldWe.dimensions.map(dim => `
                        <div style="padding:0.75rem 0; border-top:1px solid #eee;">
                            <div style="display:flex; justify-content:space-between; margin-bottom:0.25rem;">
                                <strong>${dim.label}</strong>
                                <span class="belief-status">${dim.value}</span>
                            </div>
                            <p style="font-size:0.9rem; color:#666;">${dim.text}</p>
                        </div>
                    `).join("")}
                </div>
                <div class="lens-card">
                    <h3 style="margin-bottom:1rem;">${I18n.t("matrix.can_we")}</h3>
                    <p style="font-size:1.2rem; font-weight:700; margin-bottom:1rem;">${lens.canWe.rating}</p>
                    <p style="margin-bottom:1.5rem; line-height:1.6; color:var(--text-secondary);">${lens.canWe.rationale}</p>
                    ${lens.canWe.dimensions.map(dim => `
                        <div style="padding:0.75rem 0; border-top:1px solid #eee;">
                            <div style="display:flex; justify-content:space-between; margin-bottom:0.25rem;">
                                <strong>${dim.label}</strong>
                                <span class="belief-status">${dim.value}</span>
                            </div>
                            <p style="font-size:0.9rem; color:#666;">${dim.text}</p>
                        </div>
                    `).join("")}
                </div>
            </div>
        </section>
    `;
}

function renderDebateClub(data) {
    triggerAnimation();
    destroyActiveCharts();
    const container = document.getElementById("contentContainer");
    const debate = data.decisionFrameworks.debateClub || [];

    const messages = debate
        .map((item) => {
            const isInnovationHawk = item.persona === "The Innovation Hawk";
            const messageClass = isInnovationHawk ? "user" : "assistant";
            const bubbleClass = isInnovationHawk ? "blue" : item.persona === "The Risk Hawk" ? "red" : "gray";
            
            return `
                <div class="debate-message ${messageClass}">
                    <div class="debate-avatar ${bubbleClass}">
                        ${item.persona.charAt(0)}
                    </div>
                    <div class="debate-message-body">
                        <div class="debate-message-header">
                            <span class="debate-persona">${item.persona}</span>
                            <span class="debate-role">${item.role}</span>
                        </div>
                        <div class="debate-bubble ${bubbleClass}">
                            <p>${item.text}</p>
                        </div>
                    </div>
                </div>
            `;
        })
        .join("");

    container.innerHTML = `
        <section class="chapter-header">
            <p class="eyebrow">${I18n.t("nav.decision_lens")}</p>
            <h2 class="chapter-title">${I18n.t("nav.debate_club")}</h2>
        </section>
        <div class="debate-container">
            ${messages}
        </div>
    `;
}

function renderRiskMatrixSection(data) {
    triggerAnimation();
    destroyActiveCharts();
    const container = document.getElementById("contentContainer");
    const topRisks = data.riskAnalysis.topRisks
        .map(
            (risk) => `
            <div class="highlight-box danger">
                <h4 style="color: #991b1b; margin-bottom: 0.5rem;">${risk.title}</h4>
                <p>${risk.detail}</p>
            </div>
        `
        )
        .join("");

    container.innerHTML = `
        <section class="chapter-header">
            <p class="eyebrow">${I18n.t("nav.risk")}</p>
            <h2 class="chapter-title">${I18n.t("nav.six_t_risk")}</h2>
        </section>

        ${renderRiskMatrixCard(data.riskAnalysis, false)}
        
        <section class="content-block">
            <h3>${I18n.t("exec.critical_risks")}</h3>
            ${topRisks}
        </section>
    `;
    
}

