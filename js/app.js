let currentSectionId = "executive-summary";
let activeCharts = [];

document.addEventListener("DOMContentLoaded", () => {
    if (!window.memoData) {
        console.error("Memo data is missing.");
        return;
    }
    initDashboard(window.memoData);
});

const icons = {
    overview: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>`,
    chapter: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
    risk: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
    logo: `<img src="assets/kajima-logo.png" alt="Kajima Logo" class="logo-img">`
};

function initDashboard(data) {
    const app = document.getElementById("app");
    app.innerHTML = `
        <aside class="sidebar">
            <div class="logo-area">
                ${icons.logo}
                <div>
                    <small>Investment Intelligence</small>
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
    renderExecutiveSummary(data);
}

function buildHeader(companyInfo) {
    const badgeClass = getStatusBadge(companyInfo.status);
    // Truncate long decision text for the badge, but keep full text accessible
    const shortDecision = companyInfo.decision.split('–')[0].split('with')[0].trim();
    
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
            label: "Overview",
            items: [{ id: "executive-summary", label: "Executive Summary", icon: icons.overview }],
        },
        {
            label: "Chapters",
            items: data.chapters.map((chapter) => ({
                id: chapter.id,
                label: chapter.title,
                icon: icons.chapter
            })),
        },
        {
            label: "Risk",
            items: [{ id: "six-t-risk", label: "6T Risk Matrix", icon: icons.risk }],
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
    if (targetId === currentSectionId) return;
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

function renderExecutiveSummary(data) {
    triggerAnimation();
    destroyActiveCharts();
    const container = document.getElementById("contentContainer");

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

    container.innerHTML = `
        <!-- Strategic Goal Banner -->
        <div class="strategic-banner">
            <h2>Strategic Goal</h2>
            <p>${data.executiveSummary.strategicGoal}</p>
        </div>

        <!-- Strategic Recommendation -->
        <div class="recommendation-block">
            <p class="rec-label">Strategic Recommendation</p>
            <h3 class="rec-title">${data.executiveSummary.recommendation.title}</h3>
            <p class="rec-detail">${data.executiveSummary.recommendation.detail}</p>
        </div>

        <!-- Strategic Highlights -->
        <section class="content-block">
            <h3>Strategic Highlights</h3>
            <div class="highlight-grid">
                ${highlights}
            </div>
        </section>

        ${renderSummaryWidgets(data.summaryStats)}

        <!-- Opportunities vs Risks Split Panel -->
        ${renderOpportunitiesRisks(data)}

        <!-- Capability Gaps -->
        ${renderCapabilityGaps(data.capabilityGaps)}

        <!-- 6T Risk Overview -->
        ${renderRiskMatrixCard(data.riskAnalysis, true)}

        <!-- Strategic Matrix -->
        <section class="content-block">
            <h3>Strategic Matrix</h3>
            <div class="matrix-container">
                <div class="matrix-grid-wrapper">
                    <div class="matrix-axis-y"><span>Strategic Fit (Should We?)</span></div>
                    <div class="matrix-2x2">
                        <div class="quadrant top-left">
                            <span class="quadrant-label">Strategy without Capability</span>
                        </div>
                        <div class="quadrant top-right">
                            <span class="quadrant-label">Clear Winner</span>
                        </div>
                        <div class="quadrant bottom-left">
                            <span class="quadrant-label">No Go</span>
                        </div>
                        <div class="quadrant bottom-right">
                            <span class="quadrant-label">Execution without Strategy</span>
                        </div>
                        
                        <!-- Dynamic Marker -->
                        <div class="matrix-marker-dot" style="top: 75%; left: 75%;">
                            <div class="marker-label">You Are Here</div>
                        </div>
                    </div>
                </div>
                <div class="matrix-axis-x"><span>Execution Capacity (Can We?)</span></div>
                
                <div class="matrix-text-summary">
                    <div class="matrix-text-item">
                        <strong>Can We Do It?</strong>: ${data.executiveSummary.matrix.canWeDoIt}
                        <p>${data.executiveSummary.matrix.canWeDoItText}</p>
                    </div>
                    <div class="matrix-text-item">
                        <strong>Should We Do It?</strong>: ${data.executiveSummary.matrix.shouldWeDoIt}
                        <p>${data.executiveSummary.matrix.shouldWeDoItText}</p>
                    </div>
                </div>
            </div>
        </section>
    `;
    
    // Initialize the risk radar chart after DOM update
    setTimeout(() => {
        initRiskRadarChart(data.riskAnalysis.sixTs, 'riskRadarChartCompact');
    }, 50);
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
                    <h3 class="split-col-title">Key Opportunities</h3>
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
                    <h3 class="split-col-title">Critical Risks to Resolve</h3>
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
                <h3>Critical Capability Gaps</h3>
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
            <h3>Implementation Roadmap</h3>
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
                    <h4 class="financial-card-title">Unit Economics</h4>
                    <span class="financial-card-badge">Core Metrics</span>
                </div>
                ${unitEconomicsRows}
            </div>
            <div class="financial-card">
                <div class="financial-card-header">
                    <h4 class="financial-card-title">Revenue Model</h4>
                    <span class="financial-card-badge">Revenue Streams</span>
                </div>
                ${revenueModelRows}
            </div>
        </div>
        ${assumptions.length ? `
        <section class="content-block">
            <h3>Key Assumptions to Validate</h3>
            <ul class="watchouts">
                ${assumptions}
            </ul>
        </section>
        ` : ""}
        <div class="financial-grid">
            <div class="financial-card">
                <div class="financial-card-header">
                    <h4 class="financial-card-title">Revenue Projection</h4>
                </div>
                <div class="chart-placeholder">
                    Chart data pending — awaiting Carson's input
                </div>
            </div>
            <div class="financial-card">
                <div class="financial-card-header">
                    <h4 class="financial-card-title">Burn Rate Analysis</h4>
                </div>
                <div class="chart-placeholder">
                    Chart data pending — awaiting Carson's input
                </div>
            </div>
        </div>
    `;
}

function renderRiskMatrixCard(riskAnalysis, compact = false) {
    const riskGrid = renderRiskGrid(riskAnalysis.sixTs, compact);
    const canvasId = compact ? 'riskRadarChartCompact' : 'riskRadarChartFull';
    const radarMarkup = renderRiskRadar(riskAnalysis.sixTs, canvasId);
    
    const chartIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>`;
    const gridIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>`;
    
    return `
        <section class="risk-matrix" id="riskMatrixSection">
            <div class="risk-matrix-header">
                <div class="risk-matrix-header-content">
                    <h3>6T Risk Overview</h3>
                    <p class="risk-summary">${riskAnalysis.overall}</p>
                </div>
                <div class="view-toggle-container">
                    <button class="view-toggle-btn active" data-view="chart" onclick="toggleRiskView('chart', '${canvasId}')">
                        ${chartIcon}
                        Chart
                    </button>
                    <button class="view-toggle-btn" data-view="cards" onclick="toggleRiskView('cards', '${canvasId}')">
                        ${gridIcon}
                        Cards
                    </button>
                </div>
            </div>
            <div class="risk-view-chart ${compact ? 'compact' : ''}" id="riskViewChart">
                ${radarMarkup}
            </div>
            <div class="risk-view-cards" id="riskViewCards" style="display: none;">
                ${riskGrid}
            </div>
        </section>
    `;
}

function renderRiskGrid(items, compact = false) {
    const gridItems = items
        .map(
            (item) => `
            <div class="risk-item ${item.severity}" data-risk="${item.title}">
                <div class="risk-title">${item.title}</div>
                <div class="risk-rating">${item.rating}</div>
                <p class="risk-detail">${item.summary}</p>
            </div>
        `
        )
        .join("");

    return `
        <div class="risk-grid ${compact ? "compact" : ""}">
            ${gridItems}
        </div>
    `;
}

function severityToValue(severity) {
    const map = { high: 3, medium: 2, low: 1 };
    return map[severity] || 1;
}

function renderRiskRadar(sixTs, canvasId = 'riskRadarChart') {
    const labels = sixTs.map(t => t.title);
    const values = sixTs.map(t => severityToValue(t.severity));
    
    return `
        <div class="risk-radar-container">
            <div class="risk-radar-chart-wrapper">
                <canvas id="${canvasId}"></canvas>
            </div>
            <div class="risk-radar-legend">
                <div class="legend-title">Risk Severity Scale</div>
                <div class="legend-items">
                    <div class="legend-item">
                        <span class="legend-dot high"></span>
                        <span>High Risk (3)</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-dot medium"></span>
                        <span>Medium Risk (2)</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-dot low"></span>
                        <span>Low Risk (1)</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function initRiskRadarChart(sixTs, canvasId = 'riskRadarChart') {
    const canvas = document.getElementById(canvasId);
    if (!canvas || typeof Chart === "undefined") return null;

    const labels = sixTs.map(t => t.title);
    const values = sixTs.map(t => severityToValue(t.severity));
    const colors = sixTs.map(t => {
        if (t.severity === 'high') return 'rgba(185, 28, 28, 0.8)';
        if (t.severity === 'medium') return 'rgba(180, 83, 9, 0.8)';
        return 'rgba(21, 128, 61, 0.8)';
    });

    const config = {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: '6T Risk Profile',
                data: values,
                backgroundColor: 'rgba(30, 58, 95, 0.2)',
                borderColor: 'rgba(30, 58, 95, 0.8)',
                borderWidth: 2,
                pointBackgroundColor: colors,
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8,
                pointHoverBackgroundColor: colors,
                pointHoverBorderColor: '#fff',
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    titleFont: {
                        family: "'DM Sans', sans-serif",
                        size: 13,
                        weight: '600'
                    },
                    bodyFont: {
                        family: "'DM Sans', sans-serif",
                        size: 12
                    },
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        title: function(context) {
                            return context[0].label;
                        },
                        label: function(context) {
                            const index = context.dataIndex;
                            const risk = sixTs[index];
                            const severityLabel = risk.severity.charAt(0).toUpperCase() + risk.severity.slice(1);
                            return [`Severity: ${severityLabel}`, `${risk.rating}`];
                        },
                        afterLabel: function(context) {
                            const index = context.dataIndex;
                            const risk = sixTs[index];
                            // Wrap long summary text
                            const words = risk.summary.split(' ');
                            const lines = [];
                            let currentLine = '';
                            words.forEach(word => {
                                if ((currentLine + word).length > 40) {
                                    lines.push(currentLine.trim());
                                    currentLine = word + ' ';
                                } else {
                                    currentLine += word + ' ';
                                }
                            });
                            if (currentLine.trim()) lines.push(currentLine.trim());
                            return lines;
                        }
                    }
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    min: 0,
                    max: 3,
                    ticks: {
                        stepSize: 1,
                        display: false
                    },
                    grid: {
                        color: 'rgba(148, 163, 184, 0.3)',
                        circular: true
                    },
                    angleLines: {
                        color: 'rgba(148, 163, 184, 0.3)'
                    },
                    pointLabels: {
                        font: {
                            family: "'Source Serif 4', Georgia, serif",
                            size: 13,
                            weight: '600'
                        },
                        color: '#0f172a',
                        padding: 15
                    }
                }
            },
            elements: {
                line: {
                    tension: 0.1
                }
            },
            onHover: function(event, elements) {
                const canvas = event.native.target;
                canvas.style.cursor = elements.length ? 'pointer' : 'default';
                
                // Highlight corresponding risk card
                document.querySelectorAll('.risk-item').forEach(item => {
                    item.classList.remove('highlighted');
                });
                
                if (elements.length > 0) {
                    const index = elements[0].index;
                    const riskTitle = sixTs[index].title;
                    const riskCard = document.querySelector(`.risk-item[data-risk="${riskTitle}"]`);
                    if (riskCard) {
                        riskCard.classList.add('highlighted');
                    }
                }
            },
            onClick: function(event, elements) {
                if (elements.length > 0) {
                    const index = elements[0].index;
                    const riskTitle = sixTs[index].title;
                    
                    // Switch to cards view
                    window.toggleRiskView('cards', canvasId);
                    
                    // Scroll to and highlight the clicked risk card
                    setTimeout(() => {
                        const riskCard = document.querySelector(`.risk-item[data-risk="${riskTitle}"]`);
                        if (riskCard) {
                            riskCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            riskCard.classList.add('highlighted');
                            
                            // Remove highlight after a delay
                            setTimeout(() => {
                                riskCard.classList.remove('highlighted');
                            }, 2000);
                        }
                    }, 100);
                }
            }
        }
    };

    const chartInstance = new Chart(canvas.getContext('2d'), config);
    activeCharts.push(chartInstance);
    return chartInstance;
}

function renderChapter(chapter) {
    triggerAnimation();
    destroyActiveCharts();
    const container = document.getElementById("contentContainer");
    const chartMounts = [];
    const chartsMarkup = (chapter.charts || [])
        .map((chart, index) => {
            const canvasId = `${chapter.id}-${chart.id || index}`;
            chartMounts.push({ canvasId, chart });
            return `
                <div class="chart-card">
                    <div class="chart-card-header">
                        <h4>${chart.title}</h4>
                    </div>
                    <canvas id="${canvasId}"></canvas>
                </div>
            `;
        })
        .join("");

    const tablesMarkup = (chapter.tables || [])
        .map(
            (table) => `
            <div class="content-block">
                <h3>${table.title}</h3>
                <table class="data-table">
                    <thead>
                        <tr>
                            ${table.headers.map((header) => `<th>${header}</th>`).join("")}
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
            <p class="eyebrow">Chapter</p>
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
}

function renderMetrics(metrics) {
    if (!metrics.length) return "";
    const cards = metrics
        .map(
            (metric) => `
            <div class="metric-card">
                <div class="metric-number">${metric.value}</div>
                <div class="metric-label">${metric.label}</div>
                <p class="metric-desc">${metric.description}</p>
            </div>
        `
        )
        .join("");
    return `<div class="metrics-grid">${cards}</div>`;
}

function renderSummaryWidgets(stats) {
    if (!stats.length) return "";
    const widgets = stats
        .map(
            (item) => `
            <div class="widget-card">
                <p class="widget-label">${item.label}</p>
                <p class="widget-value">${item.value}</p>
                <p class="widget-helper">${item.helper}</p>
            </div>
        `
        )
        .join("");
    return `<div class="summary-widgets">${widgets}</div>`;
}

function initCharts(mounts) {
    if (!Array.isArray(mounts) || !mounts.length) return;
    destroyActiveCharts();

    mounts.forEach(({ canvasId, chart }) => {
        const canvas = document.getElementById(canvasId);
        if (!canvas || typeof Chart === "undefined") return;

        const config = {
            type: chart.type,
            data: {
                labels: chart.labels,
                datasets: chart.datasets,
            },
            options: chart.options || {
                plugins: {
                    legend: {
                        labels: {
                            color: "#1e293b",
                        },
                    },
                },
                scales: {
                    x: {
                        ticks: { color: "#64748b" },
                        grid: { color: "#e2e8f0" },
                    },
                    y: {
                        ticks: { color: "#64748b" },
                        grid: { color: "#e2e8f0" },
                    },
                },
            },
        };

        const chartInstance = new Chart(canvas.getContext("2d"), config);
        activeCharts.push(chartInstance);
    });
}

function destroyActiveCharts() {
    if (!activeCharts.length) return;
    activeCharts.forEach((chart) => chart.destroy());
    activeCharts = [];
}

// Global function for toggle buttons
window.toggleRiskView = function(view, canvasId) {
    const chartView = document.getElementById('riskViewChart');
    const cardsView = document.getElementById('riskViewCards');
    const buttons = document.querySelectorAll('.view-toggle-btn');
    
    buttons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === view);
    });
    
    if (view === 'chart') {
        chartView.style.display = 'block';
        cardsView.style.display = 'none';
    } else {
        chartView.style.display = 'none';
        cardsView.style.display = 'block';
    }
}

// Store sixTs data globally for chart initialization
let currentSixTs = null;

function renderRiskMatrixSection(data) {
    triggerAnimation();
    destroyActiveCharts();
    const container = document.getElementById("contentContainer");
    const topRisks = data.riskAnalysis.topRisks
        .map(
            (risk) => `
            <div class="highlight-box danger">
                <h4>${risk.title}</h4>
                <p>${risk.detail}</p>
            </div>
        `
        )
        .join("");

    container.innerHTML = `
        <section class="chapter-header">
            <p class="eyebrow">Risk Lens</p>
            <h2 class="chapter-title">6T Risk Matrix</h2>
            <p class="chapter-summary">${data.riskAnalysis.overall}</p>
        </section>
        ${renderRiskMatrixCard(data.riskAnalysis, false)}
        <section class="content-block">
            <h3>Priority Items for the Next 90 Days</h3>
            ${topRisks}
        </section>
    `;
    
    // Initialize the risk radar chart after DOM update
    setTimeout(() => {
        initRiskRadarChart(data.riskAnalysis.sixTs, 'riskRadarChartFull');
    }, 50);
}
