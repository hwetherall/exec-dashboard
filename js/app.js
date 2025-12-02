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
    logo: `<img src="assets/Mayfield_Logo.svg.png" alt="Mayfield Logo" class="logo-img">`
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

    const watchouts = data.executiveSummary.watchouts
        .map((item) => `<li>${item}</li>`)
        .join("");

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
            <p class="eyebrow">Executive View</p>
            <h2 class="chapter-title">Investment Readiness Snapshot</h2>
            <p class="chapter-summary">${data.executiveSummary.short}</p>
        </section>

        ${renderSummaryWidgets(data.summaryStats)}

        <section class="content-block">
            <h3>Strategic Highlights</h3>
            <div class="highlight-grid">
                ${highlights}
            </div>
        </section>

        <section class="content-block">
            <h3>Deep Dive</h3>
            <p>${data.executiveSummary.long}</p>
        </section>

        <section class="content-block">
            <h3>Top Watchouts</h3>
            <ul class="watchouts">
                ${watchouts}
            </ul>
        </section>

        <section class="content-block">
            <h3>Critical Risks to Resolve</h3>
            ${topRisks}
        </section>

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

        ${renderRiskMatrixCard(data.riskAnalysis, true)}
    `;
}

function renderRiskMatrixCard(riskAnalysis, compact = false) {
    const riskGrid = renderRiskGrid(riskAnalysis.sixTs, compact);
    return `
        <section class="risk-matrix">
            <div class="risk-matrix-header">
                <div>
                    <h3>6T Risk Overview</h3>
                    <p class="risk-summary">${riskAnalysis.overall}</p>
                </div>
            </div>
            ${riskGrid}
        </section>
    `;
}

function renderRiskGrid(items, compact = false) {
    const gridItems = items
        .map(
            (item) => `
            <div class="risk-item ${item.severity}">
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

    container.innerHTML = `
        <section class="chapter-header">
            <p class="eyebrow">Chapter</p>
            <h2 class="chapter-title">${chapter.title}</h2>
            <p class="chapter-summary">${chapter.summary}</p>
        </section>

        ${renderMetrics(chapter.keyMetrics || [])}

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
        ${renderRiskMatrixCard(data.riskAnalysis)}
        <section class="content-block">
            <h3>Priority Items for the Next 90 Days</h3>
            ${topRisks}
        </section>
    `;
}
