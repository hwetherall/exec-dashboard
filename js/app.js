/**
 * Main Application - Executive Summary Dashboard
 * Wellbeing Real Estate Initiative
 */

let currentSectionId = "overview-table";
let activeCharts = [];

// ═══════════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════════

document.addEventListener("DOMContentLoaded", () => {
    const initialLang = I18n.getLanguage();
    loadDataForLanguage(initialLang);
    
    I18n.onLanguageChange((lang) => {
        loadDataForLanguage(lang);
        initDashboard(window.memoData);
        if (currentSectionId === 'hypothesis-tracker') {
            HypothesisTracker.render();
        }
    });
});

function loadDataForLanguage(lang) {
    if (lang === 'ja' && window.memoDataJP) {
        window.memoData = window.memoDataJP;
    } else {
        if (window.memoDataJP && window.memoData === window.memoDataJP) {
            if (!window.memoDataEN) {
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

// Store original English data
if (window.memoData && !window.memoDataEN) {
    window.memoDataEN = window.memoData;
}

// ═══════════════════════════════════════════════════════════════
// ICONS
// ═══════════════════════════════════════════════════════════════

const icons = {
    overview: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>`,
    chat: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`,
    strategy: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`,
    check: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
    x: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`,
    file: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>`,
    risk: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
    target: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>`,
    lightbulb: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"></path><path d="M10 22h4"></path><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"></path></svg>`,
    compass: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>`,
    settings: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`,
    users: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
    globe: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`,
    logo: `<img src="assets/kajima-logo.png" alt="Kajima Logo" class="logo-img">`
};

// ═══════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ═══════════════════════════════════════════════════════════════

function initDashboard(data) {
    const app = document.getElementById("app");
    app.innerHTML = `
        <aside class="sidebar">
            <div class="logo-area">
                ${icons.logo}
                <div>
                    <small>Investment Memo</small>
                </div>
            </div>
            <div class="sidebar-company-card">
                <p class="sidebar-company-name">${data.companyInfo.name}</p>
                <p class="sidebar-company-meta">${data.companyInfo.stage}</p>
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
    handleNavigation(currentSectionId, data);
}

function buildHeader(companyInfo) {
    const badgeClass = getStatusBadge(companyInfo.status);
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
                <span class="status-badge ${badgeClass}">${companyInfo.decision}</span>
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
        case "invest": return "status-invest";
        case "pass": return "status-pass";
        default: return "status-diligence";
    }
}

// ═══════════════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════════════

function renderSidebar(data) {
    const navMenu = document.getElementById("navMenu");
    
    const navSections = [
        {
            label: "Overview",
            items: [
                { id: "overview-table", label: "Overview Table", icon: icons.overview },
                { id: "six-t-risk", label: "6T Risk Analysis", icon: icons.risk }
            ]
        },
        {
            label: "Strategic Analysis",
            items: [
                { id: "tell-it-straight", label: "Tell It To Me Straight", icon: icons.chat },
                { id: "should-we", label: "Should We Do It?", icon: icons.check },
                { id: "can-we", label: "Can We Do It?", icon: icons.x }
            ]
        },
        {
            label: "Section Overviews",
            items: [
                { id: "opp-validation", label: "Opportunity Validation", icon: icons.lightbulb },
                { id: "path-to-success", label: "Path to Success", icon: icons.compass },
                { id: "operations", label: "Operations", icon: icons.settings }
            ]
        },
        {
            label: "Due Diligence",
            items: [
                { id: "hypothesis-tracker", label: "Hypothesis Tracker", icon: icons.target },
                { id: "action-plan", label: "Action Plan", icon: icons.file }
            ]
        },
        {
            label: "Decision Lab",
            items: [
                { id: "investment-committee", label: "Investment Committee", icon: icons.users }
            ]
        }
    ];

    navMenu.innerHTML = navSections.map(section => `
        <div class="nav-section">
            <p class="nav-section-label">${section.label}</p>
            ${section.items.map(item => `
                <button class="nav-item ${item.id === currentSectionId ? "active" : ""}" data-target="${item.id}">
                    <span class="nav-icon">${item.icon}</span>
                    ${item.label}
                </button>
            `).join("")}
        </div>
    `).join("");

    navMenu.querySelectorAll(".nav-item").forEach(button => {
        button.addEventListener("click", (event) => {
            const targetId = event.currentTarget.dataset.target;
            handleNavigation(targetId, data);
        });
    });
}

function handleNavigation(targetId, data) {
    currentSectionId = targetId;
    
    document.querySelectorAll(".nav-item").forEach(btn => 
        btn.classList.toggle("active", btn.dataset.target === targetId)
    );

    triggerAnimation();
    destroyActiveCharts();

    switch (targetId) {
        case "overview-table":
            renderOverviewTable(data);
            break;
        case "six-t-risk":
            renderSixTRisk(data);
            break;
        case "tell-it-straight":
            renderTellItStraight(data);
            break;
        case "should-we":
            renderShouldWe(data);
            break;
        case "can-we":
            renderCanWe(data);
            break;
        case "opp-validation":
            renderOppValidation(data);
            break;
        case "path-to-success":
            renderPathToSuccess(data);
            break;
        case "operations":
            renderOperations(data);
            break;
        case "hypothesis-tracker":
            HypothesisTracker.render();
            break;
        case "action-plan":
            renderActionPlan(data);
            break;
        case "investment-committee":
            renderInvestmentCommittee(data);
            break;
        default:
            renderOverviewTable(data);
    }
}

function triggerAnimation() {
    const container = document.getElementById("contentContainer");
    if (container) {
        container.style.animation = 'none';
        container.offsetHeight;
        container.style.animation = null;
    }
}

function destroyActiveCharts() {
    activeCharts.forEach(chart => chart.destroy());
    activeCharts = [];
}

// ═══════════════════════════════════════════════════════════════
// SECTION RENDERERS
// ═══════════════════════════════════════════════════════════════

// Overview Table
function renderOverviewTable(data) {
    const container = document.getElementById("contentContainer");
    
    const tableRows = data.overviewTable.map(row => `
        <tr>
            <td class="field-cell"><strong>${row.field}</strong></td>
            <td class="value-cell">${row.value}</td>
        </tr>
    `).join("");

    const statsWidgets = data.summaryStats.map(stat => `
        <div class="widget-card">
            <p class="widget-label">${stat.label}</p>
            <p class="widget-value">${stat.value}</p>
            <p class="widget-helper">${stat.helper}</p>
        </div>
    `).join("");

    container.innerHTML = `
        <section class="chapter-header">
            <p class="eyebrow">Stage 0</p>
            <h2 class="chapter-title">Overview Table</h2>
            <p class="chapter-summary">High-level snapshot of the investment opportunity.</p>
        </section>

        <div class="summary-widgets">
            ${statsWidgets}
        </div>

        <div class="data-table-container">
            <table class="data-table overview-table">
                <thead>
                    <tr>
                        <th style="width: 30%">Field</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
        </div>
    `;
}

// 6T Risk Analysis
function renderSixTRisk(data) {
    const container = document.getElementById("contentContainer");
    
    const riskCards = data.sixTRisks.map(risk => {
        const riskClass = risk.risk === 'high' ? 'severity-high' : 
                          risk.risk === 'medium' ? 'severity-medium' : 'severity-low';
        const riskIcon = risk.risk === 'high' ? '🔴' : 
                         risk.risk === 'medium' ? '🟡' : '🟢';
        
        return `
            <div class="risk-card ${riskClass}">
                <div class="risk-card-header">
                    <span class="risk-title">${risk.category}</span>
                    <span class="risk-icon">${riskIcon}</span>
                </div>
                <p class="risk-desc">${risk.assessment}</p>
            </div>
        `;
    }).join("");

    container.innerHTML = `
        <section class="chapter-header">
            <p class="eyebrow">Risk Framework</p>
            <h2 class="chapter-title">6T Risk Analysis</h2>
            <p class="chapter-summary">Systematic assessment across Team, TAM, Technology, Traction, Terms, and Trends.</p>
        </section>

        <div class="risk-grid">
            ${riskCards}
        </div>
    `;
}

// Tell It To Me Straight
function renderTellItStraight(data) {
    const container = document.getElementById("contentContainer");
    const tits = data.tellItStraight;
    
    const keyFacts = data.keyFacts.map(fact => `<li>${fact}</li>`).join("");
    
    const beliefs = data.beliefChecklist.map(belief => {
        const statusClass = belief.status === 'high_risk' ? 'status-high-risk' :
                           belief.status === 'in_lab' ? 'status-in-lab' : 'status-unvalidated';
        return `
            <div class="belief-item">
                <span class="belief-status-badge ${statusClass}">${belief.status.replace('_', ' ')}</span>
                <p>${belief.belief}</p>
            </div>
        `;
    }).join("");

    container.innerHTML = `
        <section class="chapter-header">
            <p class="eyebrow">Master Overview</p>
            <h2 class="chapter-title">Tell It To Me Straight</h2>
        </section>

        <div class="gut-check-quote large">
            <div class="quote-icon">💬</div>
            <blockquote>${tits.quote}</blockquote>
        </div>

        <div class="highlight-box warning">
            <h4>Core Issue</h4>
            <p>${tits.coreIssue}</p>
        </div>

        <div class="highlight-box success">
            <h4>Actionable Verdict</h4>
            <p>${tits.actionableVerdict}</p>
        </div>

        <div class="content-block">
            <h3>Strategic Fit Summary</h3>
            <p>${tits.strategicFitSummary}</p>
        </div>

        <div class="content-block">
            <h3>Key Facts</h3>
            <ul class="facts-list">
                ${keyFacts}
            </ul>
        </div>

        <div class="content-block">
            <h3>Belief Checklist</h3>
            <p class="section-subtitle">Key assumptions that must be validated:</p>
            <div class="beliefs-list">
                ${beliefs}
            </div>
        </div>
    `;
}

// Should We Do It?
function renderShouldWe(data) {
    const container = document.getElementById("contentContainer");
    const should = data.shouldWeDoIt;
    
    container.innerHTML = `
        <section class="chapter-header">
            <p class="eyebrow">Strategic Analysis</p>
            <h2 class="chapter-title">Should We Do It?</h2>
        </section>

        <div class="verdict-banner verdict-conditional">
            <div class="verdict-badge">
                <span class="verdict-icon">🟡</span>
                <span class="verdict-text">${should.verdict} (${should.confidence} Confidence)</span>
            </div>
            <p class="verdict-oneliner">${should.summary}</p>
        </div>

        ${Object.values(should.sections).map(section => `
            <div class="content-block">
                <h3>${section.title}</h3>
                <p>${section.content}</p>
            </div>
        `).join("")}
    `;
}

// Can We Do It?
function renderCanWe(data) {
    const container = document.getElementById("contentContainer");
    const can = data.canWeDoIt;
    
    const teamGaps = data.teamAnalysis.gaps.map(gap => `
        <div class="gap-card ${gap.severity}">
            <span class="gap-severity">${gap.severity}</span>
            <h4 class="gap-role">${gap.role}</h4>
            <p class="gap-reason">${gap.detail}</p>
        </div>
    `).join("");

    container.innerHTML = `
        <section class="chapter-header">
            <p class="eyebrow">Strategic Analysis</p>
            <h2 class="chapter-title">Can We Do It?</h2>
        </section>

        <div class="verdict-banner verdict-pass">
            <div class="verdict-badge">
                <span class="verdict-icon">🔴</span>
                <span class="verdict-text">${can.verdict} (${can.confidence} Confidence)</span>
            </div>
            <p class="verdict-oneliner">${can.summary}</p>
        </div>

        ${Object.values(can.sections).map(section => `
            <div class="content-block">
                <h3>${section.title}</h3>
                <p>${section.content}</p>
            </div>
        `).join("")}

        <section class="capability-gaps">
            <h3>Team Capability Gaps</h3>
            <p class="section-subtitle">${data.teamAnalysis.summary}</p>
            <div class="capability-gaps-grid">
                ${teamGaps}
            </div>
            <div class="highlight-box info" style="margin-top: 1.5rem;">
                <p><strong>Recommendation:</strong> ${data.teamAnalysis.recommendation}</p>
            </div>
        </section>
    `;
}

// Opportunity Validation
function renderOppValidation(data) {
    const container = document.getElementById("contentContainer");
    const opp = data.sections.oppValidation;
    
    const competitorRows = opp.competition.competitors.map(c => `
        <tr>
            <td><strong>${c.name}</strong></td>
            <td>${c.strength}</td>
            <td>${c.weakness}</td>
        </tr>
    `).join("");

    container.innerHTML = `
        <section class="chapter-header">
            <p class="eyebrow">Section Overview</p>
            <h2 class="chapter-title">${opp.title}</h2>
        </section>

        <div class="content-block">
            <h3>${opp.problem.title}</h3>
            <p>${opp.problem.content}</p>
            <p style="margin-top: 1rem;">${opp.problem.solution}</p>
        </div>

        <div class="content-block">
            <h3>${opp.market.title}</h3>
            <p>${opp.market.content}</p>
            <div class="highlight-box info" style="margin-top: 1rem;">
                <p><strong>Key Insight:</strong> ${opp.market.keyFact}</p>
            </div>
        </div>

        <div class="content-block">
            <h3>${opp.competition.title}</h3>
            <div class="data-table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Competitor</th>
                            <th>Core Strength</th>
                            <th>Key Weakness</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${competitorRows}
                    </tbody>
                </table>
            </div>
            <div class="highlight-box success" style="margin-top: 1rem;">
                <p><strong>White Space:</strong> ${opp.competition.whiteSpace}</p>
            </div>
            <div class="highlight-box danger" style="margin-top: 1rem;">
                <p><strong>Critical Threat:</strong> ${opp.competition.criticalThreat}</p>
            </div>
        </div>

        <div class="content-block">
            <h3>${opp.regulatory.title}</h3>
            <p>${opp.regulatory.content}</p>
            <p style="margin-top: 1rem;"><strong>IP Risk:</strong> ${opp.regulatory.ipRisk}</p>
        </div>

        <div class="content-block">
            <h3>${opp.metaAnalysis.title}</h3>
            <div class="verdict-banner verdict-conditional" style="margin-bottom: 1rem;">
                <div class="verdict-badge">
                    <span class="verdict-text">${opp.metaAnalysis.verdict}</span>
                </div>
            </div>
            <p>${opp.metaAnalysis.content}</p>
        </div>
    `;
}

// Path to Success
function renderPathToSuccess(data) {
    const container = document.getElementById("contentContainer");
    const path = data.sections.pathToSuccess;

    container.innerHTML = `
        <section class="chapter-header">
            <p class="eyebrow">Section Overview</p>
            <h2 class="chapter-title">${path.title}</h2>
        </section>

        <div class="content-block">
            <h3>${path.productTech.title}</h3>
            <p>${path.productTech.content}</p>
            <div class="highlight-box warning" style="margin-top: 1rem;">
                <p><strong>Key Dependency:</strong> ${path.productTech.keyDependency}</p>
            </div>
            <div class="highlight-box info" style="margin-top: 1rem;">
                <p><strong>Threshold:</strong> ${path.productTech.threshold}</p>
            </div>
        </div>

        <div class="content-block">
            <h3>${path.gtm.title}</h3>
            <p>${path.gtm.content}</p>
            <p style="margin-top: 1rem;"><strong>Sales Requirement:</strong> ${path.gtm.salesRequirement}</p>
            <div class="highlight-box success" style="margin-top: 1rem;">
                <p><strong>Success Criteria:</strong> ${path.gtm.successCriteria}</p>
            </div>
        </div>

        <div class="content-block">
            <h3>${path.revenueModel.title}</h3>
            <p>${path.revenueModel.content}</p>
            <div class="highlight-box danger" style="margin-top: 1rem;">
                <p><strong>Risk:</strong> ${path.revenueModel.risk}</p>
            </div>
        </div>

        <div class="content-block">
            <h3>${path.linchpin.title}</h3>
            <div class="gut-check-quote">
                <div class="quote-icon">⚠️</div>
                <blockquote>${path.linchpin.content}</blockquote>
            </div>
        </div>
    `;
}

// Operations
function renderOperations(data) {
    const container = document.getElementById("contentContainer");
    const ops = data.sections.operations;

    const metricsCards = ops.unitEconomics.metrics.map(m => `
        <div class="widget-card">
            <p class="widget-label">${m.label}</p>
            <p class="widget-value">${m.value}</p>
            <p class="widget-helper">${m.detail}</p>
        </div>
    `).join("");

    const financialRows = ops.financials.phases.map(p => `
        <tr>
            <td><strong>${p.metric}</strong></td>
            <td>${p.year1}</td>
            <td>${p.year3}</td>
        </tr>
    `).join("");

    container.innerHTML = `
        <section class="chapter-header">
            <p class="eyebrow">Section Overview</p>
            <h2 class="chapter-title">${ops.title}</h2>
        </section>

        <div class="content-block">
            <h3>${ops.unitEconomics.title}</h3>
            <div class="summary-widgets">
                ${metricsCards}
            </div>
            <div class="highlight-box warning" style="margin-top: 1.5rem;">
                <p><strong>Critical Assumption:</strong> ${ops.unitEconomics.criticalAssumption}</p>
            </div>
            <div class="highlight-box danger" style="margin-top: 1rem;">
                <p><strong>Risk:</strong> ${ops.unitEconomics.risk}</p>
            </div>
        </div>

        <div class="content-block">
            <h3>${ops.financials.title}</h3>
            <div class="data-table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Metric</th>
                            <th>Year 1 (Validation)</th>
                            <th>Year 3 (Scale Target)</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${financialRows}
                    </tbody>
                </table>
            </div>
            <p style="margin-top: 1rem;"><strong>Priority:</strong> ${ops.financials.operationalPriority}</p>
            <p style="margin-top: 0.5rem;"><strong>Hardware Trap:</strong> ${ops.financials.hardwareTrap}</p>
        </div>

        <div class="content-block">
            <h3>${ops.legal.title}</h3>
            <p><strong>APPI Risk:</strong> ${ops.legal.appiRisk}</p>
            <p style="margin-top: 1rem;"><strong>Requirement:</strong> ${ops.legal.requirement}</p>
            <p style="margin-top: 1rem;"><strong>Patent Risk:</strong> ${ops.legal.patentRisk}</p>
        </div>

        <div class="content-block">
            <h3>${ops.executionReadiness.title}</h3>
            <div class="verdict-banner verdict-pass" style="margin-bottom: 1rem;">
                <div class="verdict-badge">
                    <span class="verdict-icon">🟡</span>
                    <span class="verdict-text">${ops.executionReadiness.verdict}</span>
                </div>
            </div>
            <p>${ops.executionReadiness.content}</p>
            <div class="highlight-box danger" style="margin-top: 1rem;">
                <p><strong>Material Risk:</strong> ${ops.executionReadiness.materialRisk}</p>
            </div>
        </div>

        <div id="sensitivityPanelContainer"></div>
    `;

    // Initialize sensitivity panel
    setTimeout(() => {
        renderSensitivityPanel('sensitivityPanelContainer');
    }, 100);
}

// Action Plan
function renderActionPlan(data) {
    const container = document.getElementById("contentContainer");
    
    const steps = data.actionPlan.map(step => `
        <div class="action-step">
            <div class="step-header">
                <span class="step-number">${step.step}</span>
                <h4 class="step-title">${step.title}</h4>
            </div>
            <div class="step-body">
                <p class="step-rationale"><strong>Rationale:</strong> ${step.rationale}</p>
                <div class="step-activities">
                    <strong>Key Activities:</strong>
                    <ul>
                        ${step.activities.map(a => `<li>${a}</li>`).join("")}
                    </ul>
                </div>
                <div class="step-gate">
                    <strong>Success Gate:</strong> ${step.successGate}
                </div>
                ${step.fallback ? `
                    <div class="step-fallback">
                        <strong>Fallback:</strong> ${step.fallback}
                    </div>
                ` : ''}
            </div>
        </div>
    `).join("");

    container.innerHTML = `
        <section class="chapter-header">
            <p class="eyebrow">Due Diligence</p>
            <h2 class="chapter-title">Action Plan</h2>
            <p class="chapter-summary">Critical actions required to validate the investment thesis. Prioritizes resolution of Tier 1 deal-breakers before authorizing significant capital expenditure.</p>
        </section>

        <div class="action-steps">
            ${steps}
        </div>
    `;
}

// Investment Committee (Placeholder)
function renderInvestmentCommittee(data) {
    const container = document.getElementById("contentContainer");
    const ic = data.investmentCommittee;

    container.innerHTML = `
        <section class="chapter-header">
            <p class="eyebrow">Decision Lab</p>
            <h2 class="chapter-title">${ic.title}</h2>
            <p class="chapter-summary">${ic.subtitle}</p>
        </section>

        <div class="placeholder-section">
            <div class="placeholder-icon">🔮</div>
            <h3>Coming Soon</h3>
            <p>This section will explore the "What Would We Have to Believe?" framework, enabling structured debate around key investment assumptions.</p>
            <div class="placeholder-features">
                <div class="placeholder-feature">
                    <span class="feature-icon">💡</span>
                    <span>Belief Cards</span>
                </div>
                <div class="placeholder-feature">
                    <span class="feature-icon">⚖️</span>
                    <span>Weighted Scoring</span>
                </div>
                <div class="placeholder-feature">
                    <span class="feature-icon">🤖</span>
                    <span>AI-Driven Synthesis</span>
                </div>
            </div>
        </div>
    `;
}
