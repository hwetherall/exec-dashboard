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
        if (currentSectionId === 'validation-dashboard' || currentSectionId === 'hypothesis-tracker') {
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
    // Get dynamic verdict from Do It Checklist if available
    const verdict = window.DoItChecklist?.getOverallVerdict?.() || {
        verdict: companyInfo.decision,
        badgeClass: getStatusBadge(companyInfo.status)
    };
    
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
                <span class="status-badge ${verdict.badgeClass}" id="headerDecisionTag">${verdict.verdict}</span>
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
                { id: "validation-dashboard", label: "Validation Dashboard", icon: icons.target }
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
        case "validation-dashboard":
        case "hypothesis-tracker":
            HypothesisTracker.render();
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
    const companyInfo = data.companyInfo;

    // Initialize DoItChecklist if available
    if (window.DoItChecklist) {
        window.DoItChecklist.init();
    }

    // Filter fields for specific sections
    const leftColFields = ["Stage", "Industry", "Location", "Source"];
    const rightColFields = ["Analyst", "Decision", "Recommendation"];
    
    // Helper to find value
    const getValue = (key) => data.overviewTable.find(r => r.field === key)?.value || "—";

    const statsWidgets = data.summaryStats.map(stat => `
        <div class="corp-metric-item">
            <span class="corp-metric-label">${stat.label}</span>
            <div class="corp-metric-value-group">
                <span class="corp-metric-value">${stat.value}</span>
                <span class="corp-metric-sub">${stat.helper}</span>
            </div>
        </div>
    `).join("");

    // Render the Do It Checklist hero section
    const checklistHTML = window.DoItChecklist ? window.DoItChecklist.render() : '';

    container.innerHTML = `
        <!-- Do It Checklist Hero -->
        <div id="doItChecklistContainer">
            ${checklistHTML}
        </div>

        <div class="corp-document-container">
            <!-- Header Section -->
            <div class="corp-header">
                <div class="corp-header-main">
                    <p class="corp-eyebrow">Executive Summary &mdash; ${companyInfo.stage}</p>
                    <h1 class="corp-title">${companyInfo.name}</h1>
                    <p class="corp-subtitle">${companyInfo.headline}</p>
                </div>
                <div class="corp-header-meta">
                    <div class="corp-status-box ${window.DoItChecklist?.getOverallVerdict?.()?.badgeClass || 'status-conditional'}" id="overviewStatusBox">
                        <span class="corp-status-label">Investment Decision</span>
                        <span class="corp-status-value" id="overviewDecisionTag">${window.DoItChecklist?.getOverallVerdict?.()?.verdict || companyInfo.decision}</span>
                    </div>
                </div>
            </div>

            <!-- Key Metrics Band -->
            <div class="corp-metrics-band">
                ${statsWidgets}
            </div>

            <!-- Deal Data Grid -->
            <div class="corp-data-grid">
                <!-- Column 1 -->
                <div class="corp-data-col">
                    <h3 class="corp-section-label">Entity Profile</h3>
                    ${leftColFields.map(field => `
                        <div class="corp-data-row">
                            <span class="corp-data-label">${field}</span>
                            <span class="corp-data-value">${getValue(field)}</span>
                        </div>
                    `).join("")}
                    <div class="corp-data-row">
                        <span class="corp-data-label">Description</span>
                        <span class="corp-data-value">${getValue("Short Description")}</span>
                    </div>
                </div>

                <!-- Column 2 -->
                <div class="corp-data-col">
                    <h3 class="corp-section-label">Deal Context</h3>
                    ${rightColFields.map(field => {
                        const val = getValue(field);
                        const isRec = field === "Recommendation";
                        return `
                        <div class="corp-data-row ${isRec ? 'highlight-row' : ''}">
                            <span class="corp-data-label">${field}</span>
                            <span class="corp-data-value ${isRec ? 'text-serif-bold' : ''}">${val}</span>
                        </div>
                    `}).join("")}
                </div>
            </div>
        </div>
    `;
}

// 6T Risk Analysis
function renderSixTRisk(data) {
    const container = document.getElementById("contentContainer");
    
    const riskCells = data.sixTRisks.map(risk => {
        const riskClass = risk.risk === 'high' ? 'high' : 
                          risk.risk === 'medium' ? 'medium' : 'low';
        
        return `
            <div class="corp-risk-cell">
                <div class="corp-risk-header">
                    <span class="corp-risk-title">${risk.category}</span>
                    <span class="corp-risk-indicator ${riskClass}"></span>
                </div>
                <p class="corp-risk-desc">${risk.assessment}</p>
            </div>
        `;
    }).join("");

    container.innerHTML = `
        <div class="corp-content-block">
            <p class="corp-eyebrow">Risk Framework</p>
            <h2 class="corp-title">6T Risk Analysis</h2>
            <p class="corp-paragraph">Systematic assessment across Team, TAM, Technology, Traction, Terms, and Trends.</p>
            
            <div class="corp-risk-grid">
                ${riskCells}
            </div>
        </div>
    `;
}

// Tell It To Me Straight
function renderTellItStraight(data) {
    const container = document.getElementById("contentContainer");
    const tits = data.tellItStraight;
    
    const keyFacts = data.keyFacts.map(fact => `<li>${fact}</li>`).join("");
    
    const beliefs = data.beliefChecklist.map(belief => {
        return `
            <div class="tits-checklist-item">
                <div class="tits-checklist-content">
                    <p class="tits-checklist-text">${belief.belief}</p>
                </div>
            </div>
        `;
    }).join("");

    container.innerHTML = `
        <div class="corp-content-block">
            <p class="corp-eyebrow">Master Overview</p>
            <h2 class="corp-title">Tell It To Me Straight</h2>
            
            <div class="tits-accordion">
                <!-- Section 1: Tell it to me straight -->
                <div class="tits-accordion-item">
                    <button class="tits-accordion-header active" onclick="toggleTitsSection(this)">
                        <span>Tell it to me straight</span>
                        <div class="tits-accordion-icon">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                        </div>
                    </button>
                    <div class="tits-accordion-content" style="display: block;">
                        <div class="tits-overview-card">
                            <div class="tits-overview-header">
                                <p class="tits-quote">"${tits.quote}"</p>
                                <span class="tits-source">Investment Committee Unofficial Take</span>
                            </div>

                            <div class="tits-overview-body">
                                <div class="tits-body-section issue">
                                    <h4 class="tits-label">Core Issue</h4>
                                    <p class="tits-text">${tits.coreIssue}</p>
                                </div>
                                <div class="tits-body-section verdict">
                                    <h4 class="tits-label">Actionable Verdict</h4>
                                    <p class="tits-text bold">${tits.actionableVerdict}</p>
                                </div>
                            </div>

                            <div class="tits-overview-footer">
                                <h4 class="tits-label">Strategic Fit Summary</h4>
                                <p class="tits-text">${tits.strategicFitSummary}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Section 2: Facts -->
                <div class="tits-accordion-item">
                    <button class="tits-accordion-header" onclick="toggleTitsSection(this)">
                        <span>Facts</span>
                        <div class="tits-accordion-icon">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                        </div>
                    </button>
                    <div class="tits-accordion-content" style="display: none;">
                        <h3 class="corp-section-label">Key Facts</h3>
                        <ul class="corp-list">
                            ${keyFacts}
                        </ul>
                    </div>
                </div>

                <!-- Section 3: Belief Checklist -->
                <div class="tits-accordion-item">
                    <button class="tits-accordion-header" onclick="toggleTitsSection(this)">
                        <span>Belief Checklist</span>
                        <div class="tits-accordion-icon">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                        </div>
                    </button>
                    <div class="tits-accordion-content" style="display: none;">
                        <div class="tits-checklist-container">
                            <div class="tits-checklist-header-row">
                                <span>Core Assumption</span>
                            </div>
                            ${beliefs}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Toggle function for the accordion
window.toggleTitsSection = function(header) {
    // Toggle active state
    header.classList.toggle('active');
    
    // Toggle content visibility
    const content = header.nextElementSibling;
    if (content.style.display === 'none') {
        content.style.display = 'block';
    } else {
        content.style.display = 'none';
    }
}

// Should We Do It?
function renderShouldWe(data) {
    const container = document.getElementById("contentContainer");
    const should = data.shouldWeDoIt;
    
    container.innerHTML = `
        <div class="corp-content-block">
            <p class="corp-eyebrow">Strategic Analysis</p>
            <h2 class="corp-title">Should We Do It?</h2>
            
            <div class="corp-verdict-box neutral">
                <div class="corp-verdict-main">
                    <span class="corp-verdict-label">Verdict: ${should.verdict} (${should.confidence})</span>
                    <h3 class="corp-verdict-title">${should.summary}</h3>
                </div>
            </div>

            ${Object.values(should.sections).map(section => `
                <div style="margin-bottom: 2.5rem;">
                    <h3 class="corp-section-label">${section.title}</h3>
                    <p class="corp-paragraph">${section.content}</p>
                </div>
            `).join("")}
        </div>
    `;
}

// Can We Do It?
function renderCanWe(data) {
    const container = document.getElementById("contentContainer");
    const can = data.canWeDoIt;
    
    const teamGaps = data.teamAnalysis.gaps.map(gap => `
        <div class="corp-risk-cell" style="border: 1px solid var(--border-color); margin-bottom: 1rem;">
            <div class="corp-risk-header">
                <span class="corp-risk-title">${gap.role}</span>
                <span class="corp-status-value" style="font-size: 0.75rem; color: ${gap.severity === 'critical' ? '#ef4444' : '#f59e0b'}">${gap.severity.toUpperCase()}</span>
            </div>
            <p class="corp-risk-desc">${gap.detail}</p>
        </div>
    `).join("");

    container.innerHTML = `
        <div class="corp-content-block">
            <p class="corp-eyebrow">Strategic Analysis</p>
            <h2 class="corp-title">Can We Do It?</h2>
            
            <div class="corp-verdict-box negative">
                <div class="corp-verdict-main">
                    <span class="corp-verdict-label">Verdict: ${can.verdict} (${can.confidence})</span>
                    <h3 class="corp-verdict-title">${can.summary}</h3>
                </div>
            </div>

            ${Object.values(can.sections).map(section => `
                <div style="margin-bottom: 2.5rem;">
                    <h3 class="corp-section-label">${section.title}</h3>
                    <p class="corp-paragraph">${section.content}</p>
                </div>
            `).join("")}

            <div style="margin-top: 3rem;">
                <h3 class="corp-section-label">Team Capability Gaps</h3>
                <p class="corp-paragraph">${data.teamAnalysis.summary}</p>
                <div style="display: grid; gap: 1rem; margin-bottom: 2rem;">
                    ${teamGaps}
                </div>
                
                <div class="corp-callout">
                    <p class="corp-callout-title">RECOMMENDATION</p>
                    <p class="corp-callout-text">${data.teamAnalysis.recommendation}</p>
                </div>
            </div>
        </div>
    `;
}

// Opportunity Validation
function renderOppValidation(data) {
    const container = document.getElementById("contentContainer");
    const opp = data.sections.oppValidation;
    
    const competitorRows = opp.competition.competitors.map(c => `
        <tr>
            <td class="corp-table-name">${c.name}</td>
            <td>${c.strength}</td>
            <td>${c.weakness}</td>
        </tr>
    `).join("");

    container.innerHTML = `
        <div class="corp-content-block">
            <p class="corp-eyebrow">Section Overview</p>
            <h2 class="corp-title">${opp.title}</h2>
            
            <div style="margin-bottom: 3rem;">
                <h3 class="corp-section-label">${opp.problem.title}</h3>
                <p class="corp-paragraph">${opp.problem.content}</p>
                <div class="corp-callout">
                    <p class="corp-callout-title">SOLUTION HYPOTHESIS</p>
                    <p class="corp-callout-text">${opp.problem.solution}</p>
                </div>
            </div>

            <div style="margin-bottom: 3rem;">
                <h3 class="corp-section-label">${opp.market.title}</h3>
                <p class="corp-paragraph">${opp.market.content}</p>
                <div class="corp-quote-box">
                    <p class="corp-quote-text">"${opp.market.keyFact}"</p>
                    <span class="corp-quote-source">Market Insight</span>
                </div>
            </div>

            <div style="margin-bottom: 3rem;">
                <h3 class="corp-section-label">${opp.competition.title}</h3>
                <table class="corp-table">
                    <thead>
                        <tr>
                            <th style="width: 25%">Competitor</th>
                            <th style="width: 37.5%">Core Strength</th>
                            <th style="width: 37.5%">Key Weakness</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${competitorRows}
                    </tbody>
                </table>
                
                <div class="corp-callout" style="background: #f0fdf4; border-color: #bbf7d0;">
                    <p class="corp-callout-title" style="color: #166534;">WHITE SPACE</p>
                    <p class="corp-callout-text" style="color: #14532d;">${opp.competition.whiteSpace}</p>
                </div>
                <div class="corp-callout" style="background: #fef2f2; border-color: #fecaca; margin-top: 1rem;">
                    <p class="corp-callout-title" style="color: #991b1b;">CRITICAL THREAT</p>
                    <p class="corp-callout-text" style="color: #7f1d1d;">${opp.competition.criticalThreat}</p>
                </div>
            </div>

            <div style="margin-bottom: 3rem;">
                <h3 class="corp-section-label">${opp.regulatory.title}</h3>
                <p class="corp-paragraph">${opp.regulatory.content}</p>
                <p class="corp-paragraph"><strong>IP Risk:</strong> ${opp.regulatory.ipRisk}</p>
            </div>

            <div class="corp-verdict-box neutral">
                <div class="corp-verdict-main">
                    <span class="corp-verdict-label">Meta-Analysis Verdict</span>
                    <h3 class="corp-verdict-title">${opp.metaAnalysis.verdict}</h3>
                    <p class="corp-verdict-desc">${opp.metaAnalysis.content}</p>
                </div>
            </div>
        </div>
    `;
}

// Path to Success
function renderPathToSuccess(data) {
    const container = document.getElementById("contentContainer");
    const path = data.sections.pathToSuccess;

    container.innerHTML = `
        <div class="corp-content-block">
            <p class="corp-eyebrow">Section Overview</p>
            <h2 class="corp-title">${path.title}</h2>
            
            <div style="margin-bottom: 3rem;">
                <h3 class="corp-section-label">${path.productTech.title}</h3>
                <p class="corp-paragraph">${path.productTech.content}</p>
                <div class="corp-callout">
                    <p class="corp-callout-title">KEY DEPENDENCY</p>
                    <p class="corp-callout-text">${path.productTech.keyDependency}</p>
                </div>
                <p class="corp-paragraph" style="margin-top: 1rem; font-size: 0.9rem;"><strong>Threshold:</strong> ${path.productTech.threshold}</p>
            </div>

            <div style="margin-bottom: 3rem;">
                <h3 class="corp-section-label">${path.gtm.title}</h3>
                <p class="corp-paragraph">${path.gtm.content}</p>
                <p class="corp-paragraph"><strong>Sales Requirement:</strong> ${path.gtm.salesRequirement}</p>
                <div class="corp-callout" style="background: #f0fdf4; border-color: #bbf7d0;">
                    <p class="corp-callout-title" style="color: #166534;">SUCCESS CRITERIA</p>
                    <p class="corp-callout-text" style="color: #14532d;">${path.gtm.successCriteria}</p>
                </div>
            </div>

            <div style="margin-bottom: 3rem;">
                <h3 class="corp-section-label">${path.revenueModel.title}</h3>
                <p class="corp-paragraph">${path.revenueModel.content}</p>
                <div class="corp-callout" style="background: #fef2f2; border-color: #fecaca;">
                    <p class="corp-callout-title" style="color: #991b1b;">RISK FACTOR</p>
                    <p class="corp-callout-text" style="color: #7f1d1d;">${path.revenueModel.risk}</p>
                </div>
            </div>

            <div class="corp-quote-box">
                <p class="corp-quote-text">"${path.linchpin.content}"</p>
                <span class="corp-quote-source">Strategic Linchpin</span>
            </div>
        </div>
    `;
}

// Operations
function renderOperations(data) {
    const container = document.getElementById("contentContainer");
    const ops = data.sections.operations;

    const metricsCards = ops.unitEconomics.metrics.map(m => `
        <div class="corp-metric-item">
            <span class="corp-metric-label">${m.label}</span>
            <div class="corp-metric-value-group">
                <span class="corp-metric-value">${m.value}</span>
                <span class="corp-metric-sub">${m.detail}</span>
            </div>
        </div>
    `).join("");

    const financialRows = ops.financials.phases.map(p => `
        <tr>
            <td class="corp-table-name">${p.metric}</td>
            <td>${p.year1}</td>
            <td>${p.year3}</td>
        </tr>
    `).join("");

    container.innerHTML = `
        <div class="corp-content-block">
            <p class="corp-eyebrow">Section Overview</p>
            <h2 class="corp-title">${ops.title}</h2>
            
            <h3 class="corp-section-label">${ops.unitEconomics.title}</h3>
            <div class="corp-metrics-band" style="margin-bottom: 2rem;">
                ${metricsCards}
            </div>
            
            <div class="corp-callout">
                <p class="corp-callout-title">CRITICAL ASSUMPTION</p>
                <p class="corp-callout-text">${ops.unitEconomics.criticalAssumption}</p>
            </div>
            <p class="corp-paragraph" style="color: #991b1b; font-size: 0.9rem;"><strong>Risk:</strong> ${ops.unitEconomics.risk}</p>

            <div style="margin-top: 3rem; margin-bottom: 3rem;">
                <h3 class="corp-section-label">${ops.financials.title}</h3>
                <table class="corp-table">
                    <thead>
                        <tr>
                            <th style="width: 40%">Metric</th>
                            <th style="width: 30%">Year 1 (Validation)</th>
                            <th style="width: 30%">Year 3 (Scale Target)</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${financialRows}
                    </tbody>
                </table>
                <p class="corp-paragraph"><strong>Priority:</strong> ${ops.financials.operationalPriority}</p>
                <p class="corp-paragraph" style="font-size: 0.9rem;"><strong>Hardware Trap:</strong> ${ops.financials.hardwareTrap}</p>
            </div>

            <div style="margin-bottom: 3rem;">
                <h3 class="corp-section-label">${ops.legal.title}</h3>
                <ul class="corp-list">
                    <li><strong>APPI Risk:</strong> ${ops.legal.appiRisk}</li>
                    <li><strong>Requirement:</strong> ${ops.legal.requirement}</li>
                    <li><strong>Patent Risk:</strong> ${ops.legal.patentRisk}</li>
                </ul>
            </div>

            <div class="corp-verdict-box negative">
                <div class="corp-verdict-main">
                    <span class="corp-verdict-label">Execution Readiness</span>
                    <h3 class="corp-verdict-title">${ops.executionReadiness.verdict}</h3>
                    <p class="corp-verdict-desc">${ops.executionReadiness.content}</p>
                    <p class="corp-verdict-desc" style="margin-top: 1rem; color: #991b1b;"><strong>Material Risk:</strong> ${ops.executionReadiness.materialRisk}</p>
                </div>
            </div>

            <div id="sensitivityPanelContainer"></div>
        </div>
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
        <div class="corp-step-item">
            <div class="corp-step-marker"></div>
            <div class="corp-step-header">
                <span class="corp-step-title">Step ${step.step}: ${step.title}</span>
            </div>
            <div class="corp-step-content">
                <p style="margin-bottom: 0.5rem;"><strong>Rationale:</strong> ${step.rationale}</p>
                <ul style="padding-left: 1.2rem; margin-bottom: 0.75rem; list-style: disc;">
                    ${step.activities.map(a => `<li style="margin-bottom: 0.25rem;">${a}</li>`).join("")}
                </ul>
                <div style="background: #f0fdf4; padding: 0.75rem; border-left: 3px solid #22c55e; margin-bottom: 0.5rem;">
                    <p style="margin: 0; font-size: 0.85rem; color: #166534;"><strong>Gate:</strong> ${step.successGate}</p>
                </div>
                ${step.fallback ? `
                    <div style="background: #fef2f2; padding: 0.75rem; border-left: 3px solid #ef4444;">
                        <p style="margin: 0; font-size: 0.85rem; color: #991b1b;"><strong>Fallback:</strong> ${step.fallback}</p>
                    </div>
                ` : ''}
            </div>
        </div>
    `).join("");

    container.innerHTML = `
        <div class="corp-content-block">
            <p class="corp-eyebrow">Due Diligence</p>
            <h2 class="corp-title">Action Plan</h2>
            <p class="corp-paragraph">Critical actions required to validate the investment thesis. Prioritizes resolution of Tier 1 deal-breakers before authorizing significant capital expenditure.</p>
            
            <div style="margin-top: 3rem;">
                <div class="corp-step-list">
                    ${steps}
                </div>
            </div>
        </div>
    `;
}

// ═══════════════════════════════════════════════════════════════
// INVESTMENT COMMITTEE
// ═══════════════════════════════════════════════════════════════

// Track expanded beliefs
let expandedBeliefs = new Set();
let expandedDebateSections = new Set();

/**
 * Get hypothesis status from tracker
 */
function getHypothesisStatus(hypothesisId) {
    try {
        const state = HypothesisTracker.getState();
        if (state && state.hypotheses) {
            const hypothesis = state.hypotheses.find(h => h.id === hypothesisId);
            if (hypothesis) {
                return hypothesis.outcome || 'pending';
            }
        }
    } catch (e) {
        // Tracker might not be initialized
    }
    return 'pending';
}

/**
 * Get strength bars HTML (1-3 bars based on strength)
 */
function getStrengthBars(strength) {
    const levels = { weak: 1, medium: 2, strong: 3 };
    const level = levels[strength] || 2;
    let bars = '';
    for (let i = 1; i <= 3; i++) {
        bars += `<span class="strength-bar ${i <= level ? 'active' : ''}"></span>`;
    }
    return bars;
}

/**
 * Show Belief Modal
 */
function showBeliefModal(beliefId) {
    const ic = window.memoData.investmentCommittee;
    const belief = ic.beliefs.find(b => b.id === beliefId);
    if (!belief) return;

    // Create modal if not exists
    let modal = document.getElementById('beliefModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'beliefModal';
        modal.className = 'chat-modal'; // Reuse existing generic modal class
        modal.style.display = 'none';
        modal.innerHTML = `
            <div class="chat-modal-backdrop" onclick="closeBeliefModal()"></div>
            <div class="chat-modal-content" style="width: 800px; max-width: 95vw; max-height: 90vh; display: flex; flex-direction: column;">
                <div class="chat-modal-header">
                    <div class="chat-modal-title" id="beliefModalTitle"></div>
                    <button class="chat-modal-close" onclick="closeBeliefModal()">${icons.x}</button>
                </div>
                <div class="chat-modal-body" id="beliefModalBody" style="overflow-y: auto; flex: 1;"></div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // Update Content
    document.getElementById('beliefModalTitle').innerHTML = `
        <span style="background: #f1f5f9; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.75rem; margin-right: 0.75rem; font-family: monospace;">${belief.id}</span>
        ${belief.title}
    `;
    document.getElementById('beliefModalBody').innerHTML = renderBeliefDeepDiveContent(belief);

    // Show
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeBeliefModal() {
    const modal = document.getElementById('beliefModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

/**
 * Show Belief Modal
 */
function showBeliefModal(beliefId) {
    const ic = window.memoData.investmentCommittee;
    const belief = ic.beliefs.find(b => b.id === beliefId);
    if (!belief) return;

    // Create modal if not exists
    let modal = document.getElementById('beliefModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'beliefModal';
        modal.className = 'chat-modal'; // Reuse existing generic modal class
        modal.style.display = 'none';
        modal.innerHTML = `
            <div class="chat-modal-backdrop" onclick="closeBeliefModal()"></div>
            <div class="chat-modal-content" style="width: 800px; max-width: 95vw; max-height: 90vh; display: flex; flex-direction: column;">
                <div class="chat-modal-header">
                    <div class="chat-modal-title" id="beliefModalTitle"></div>
                    <button class="chat-modal-close" onclick="closeBeliefModal()">${icons.x}</button>
                </div>
                <div class="chat-modal-body" id="beliefModalBody" style="overflow-y: auto; flex: 1;"></div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // Update Content
    document.getElementById('beliefModalTitle').innerHTML = `
        <span style="background: #f1f5f9; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.75rem; margin-right: 0.75rem; font-family: monospace;">${belief.id}</span>
        ${belief.title}
    `;
    document.getElementById('beliefModalBody').innerHTML = renderBeliefDeepDiveContent(belief);

    // Show
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeBeliefModal() {
    const modal = document.getElementById('beliefModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

/**
 * Toggle belief card expansion (Deprecated for inline, now opens modal)
 */
function toggleBeliefCard(beliefId) {
    showBeliefModal(beliefId);
}

/**
 * Toggle debate section expansion
 */
function toggleDebateSection(index) {
    if (expandedDebateSections.has(index)) {
        expandedDebateSections.delete(index);
    } else {
        expandedDebateSections.add(index);
    }
    
    const section = document.querySelector(`[data-debate-section="${index}"]`);
    if (section) {
        section.classList.toggle('expanded');
    }
}

/**
 * Render debate message
 */
function renderDebateMessage(exchange) {
    const avatarEmoji = exchange.avatar === 'bull' ? '🐂' : 
                        exchange.avatar === 'bear' ? '🐻' : '⚙️';
    
    return `
        <div class="debate-message ${exchange.avatar}">
            <div class="debate-avatar ${exchange.avatar}">${avatarEmoji}</div>
            <div class="debate-content">
                <div class="debate-speaker">
                    <span class="debate-speaker-name ${exchange.avatar}">${exchange.speaker}</span>
                    <span class="debate-speaker-role">${exchange.role}</span>
                </div>
                <div class="debate-bubble">${exchange.text}</div>
            </div>
        </div>
    `;
}

/**
 * Render deep dive content for a belief (reused for Modal)
 */
function renderBeliefDeepDiveContent(belief) {
    const hypothesisStatus = getHypothesisStatus(belief.killSwitch.linkedHypothesis);
    const winnerClass = belief.verdict.winner === 'Bull' ? 'winner-bull' : 
                        belief.verdict.winner === 'Bear' ? 'winner-bear' : 'winner-draw';
    
    // Pull debate transcript for this belief and present it as an expandable field
    const debateSection = window.memoData.investmentCommittee.debateTranscript.find(d => 
        d.section.includes(belief.title) || d.section.includes(belief.id)
    );
    const debateHTML = debateSection ? `
        <details style="margin: 1.5rem 0; background: #fafbfc; border: 1px solid var(--border-color); border-radius: 10px; padding: 1rem;" >
            <summary style="cursor: pointer; font-weight: 700; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem;">
                💬 Bull vs Bear Transcript (evidence)
            </summary>
            <div class="debate-messages" style="display: flex; flex-direction: column; gap: 1rem; padding: 1rem 0 0 0; background: transparent;">
                ${debateSection.exchanges.map(e => renderDebateMessage(e)).join('')}
            </div>
        </details>
    ` : '';
    
    return `
        <div class="belief-deep-dive" style="border: none; background: transparent; padding: 0;">
            <div class="tension-block">
                <div class="tension-label">The Tension</div>
                <p>${belief.tension}</p>
            </div>
            
            <div class="argument-grid">
                <div class="argument-box bull">
                    <div class="argument-header">
                        <span class="argument-avatar bull">🐂</span>
                        <span class="argument-name bull">Bull Case</span>
                    </div>
                    <p>${belief.bullCase.argument}</p>
                </div>
                <div class="argument-box bear">
                    <div class="argument-header">
                        <span class="argument-avatar bear">🐻</span>
                        <span class="argument-name bear">Bear Case</span>
                    </div>
                    <p>${belief.bearCase.argument}</p>
                </div>
            </div>
            
            <div class="judge-ruling ${winnerClass}">
                <div class="ruling-header">
                    <span class="ruling-icon">⚖️</span>
                    <span class="ruling-title">Judge's Ruling</span>
                    <span class="ruling-winner">${belief.verdict.winner} ${belief.verdict.winner === 'Draw' ? '' : 'Wins'}</span>
                </div>
                <p>${belief.verdict.ruling}</p>
            </div>
            
            ${debateHTML}
            
            <div class="kill-switch">
                <div class="kill-switch-header">
                    <span class="kill-switch-icon">🔘</span>
                    <span class="kill-switch-label">Kill Switch Test</span>
                    <span class="kill-switch-hypothesis">
                        <span class="h-status-dot ${hypothesisStatus}"></span>
                        ${belief.killSwitch.linkedHypothesis}
                    </span>
                </div>
                <p>${belief.killSwitch.test}</p>
            </div>
        </div>
    `;
}

/**
 * Render a single belief card
 */
function renderBeliefCard(belief) {
    const hypothesisStatus = getHypothesisStatus(belief.linkedHypothesis);
    
    return `
        <div class="belief-card" data-belief-id="${belief.id}">
            <div class="belief-card-header" onclick="showBeliefModal('${belief.id}')">
                <div class="belief-card-top">
                    <span class="belief-id">${belief.id}</span>
                    <span class="belief-difficulty ${belief.difficulty.toLowerCase()}">${belief.difficulty} Difficulty</span>
                </div>
                <h4>${belief.title}</h4>
                <p class="belief-statement">${belief.shortStatement}</p>
            </div>
            
            <div class="bull-bear-indicator">
                <div class="indicator-side bull">
                    <span class="indicator-icon">🐂</span>
                    <span class="indicator-label">Bull</span>
                    <div class="indicator-strength">
                        ${getStrengthBars(belief.bullCase.strength)}
                    </div>
                </div>
                <div class="indicator-side bear">
                    <span class="indicator-icon">🐻</span>
                    <span class="indicator-label">Bear</span>
                    <div class="indicator-strength">
                        ${getStrengthBars(belief.bearCase.strength)}
                    </div>
                </div>
            </div>
            
            <div class="hypothesis-link-badge">
                <span>Linked: ${belief.linkedHypothesis}</span>
            </div>
            
            <div class="belief-card-footer" onclick="event.stopPropagation(); showBeliefModal('${belief.id}')">
                Click to view Deep Dive
            </div>
        </div>
    `;
}

/**
 * Main Investment Committee render function
 */
function renderInvestmentCommittee(data) {
    const container = document.getElementById("contentContainer");
    const ic = data.investmentCommittee;

    // Reset expansion state
    expandedBeliefs.clear();
    expandedDebateSections.clear();
    // Auto-expand first debate section
    expandedDebateSections.add(0);

    container.innerHTML = `
        <section class="chapter-header">
            <p class="eyebrow">Decision Lab</p>
            <h2 class="chapter-title">${ic.title}</h2>
            <p class="chapter-summary">${ic.subtitle}</p>
        </section>

        <!-- Belief Bridge Section -->
        <div class="ic-section-header">
            <div class="ic-section-icon" style="background: #f0f9ff; color: #0284c7;">🌉</div>
            <h3>The Belief Bridge</h3>
        </div>
        
        <div class="belief-bridge">
            ${ic.beliefs.map(belief => renderBeliefCard(belief)).join('')}
        </div>

        <!-- Final Assessment -->
        <div class="ic-section-header">
            <div class="ic-section-icon" style="background: #f0fdf4; color: #16a34a;">⚖️</div>
            <h3>Final Assessment</h3>
        </div>
        
        <div class="final-assessment">
            <div class="final-assessment-summary">
                <p>${ic.finalAssessment.summary}</p>
            </div>
            <div class="final-conditions">
                <div class="condition-card go">
                    <div class="condition-header">
                        <span class="condition-icon">✅</span>
                        <span class="condition-label">GO Condition</span>
                    </div>
                    <p>${ic.finalAssessment.goCondition}</p>
                </div>
                <div class="condition-card no-go">
                    <div class="condition-header">
                        <span class="condition-icon">❌</span>
                        <span class="condition-label">NO-GO Condition</span>
                    </div>
                    <p>${ic.finalAssessment.noGoCondition}</p>
                </div>
            </div>
        </div>
    `;
}

// Expose toggle functions globally
window.toggleBeliefCard = toggleBeliefCard;
window.toggleDebateSection = toggleDebateSection;
window.showBeliefModal = showBeliefModal;
window.closeBeliefModal = closeBeliefModal;
