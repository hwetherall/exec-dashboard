// js/sensitivityPanel.js
// Sensitivity Analysis Panel for Financial Chapter
// ============================================

// ============================================
// DATA
// ============================================

const baseProjections = {
    revenue: {
        year1: 225,   // midpoint of 150-300
        year2: 650,   // midpoint of 500-800
        year3: 1500,  // midpoint of 1200-1800
        year4: 2500,
        year5: 4000
    },
    ebitda: {
        year1: -400,
        year2: -350,
        year3: -100,
        year4: 200,
        year5: 800
    },
    fcf: {
        year1: -450,
        year2: -400,
        year3: -150,
        year4: 100,
        year5: 600
    }
};

const baseAssumptions = {
    premium: 10,              // % construction premium (base case: 5-15% range)
    salesCycle: 9,            // months (base case)
    techAttachRate: 25,       // % of projects with recurring revenue
    staffUtilization: 60,     // % billable time
    implementationVariance: 0 // % cost overrun
};

const sliderConfig = [
    {
        id: 'premium',
        label: 'Willingness to Pay Premium',
        min: 0,
        max: 20,
        step: 1,
        base: 10,
        unit: '%',
        warningThreshold: 5,
        warningBelow: true,
        warningMessage: 'Below 5% makes unit economics unviable'
    },
    {
        id: 'salesCycle',
        label: 'Sales Cycle Length',
        min: 6,
        max: 15,
        step: 1,
        base: 9,
        unit: ' mo',
        warningThreshold: null,
        warningMessage: null
    },
    {
        id: 'techAttachRate',
        label: 'Tech Attach Rate (Recurring Revenue)',
        min: 10,
        max: 40,
        step: 5,
        base: 25,
        unit: '%',
        warningThreshold: null,
        warningMessage: null
    },
    {
        id: 'staffUtilization',
        label: 'Staff Utilization',
        min: 40,
        max: 75,
        step: 5,
        base: 60,
        unit: '%',
        warningThreshold: null,
        warningMessage: null
    },
    {
        id: 'implementationVariance',
        label: 'Implementation Cost Variance',
        min: -10,
        max: 20,
        step: 5,
        base: 0,
        unit: '%',
        warningThreshold: 10,
        warningBelow: false,
        warningMessage: 'High variance erodes project margins significantly'
    }
];

// ============================================
// STATE
// ============================================

let currentInputs = { ...baseAssumptions };
let sensitivityChart = null;
let baseMetrics = null;

// ============================================
// CALCULATION ENGINE
// ============================================

function calculateProjections(inputs) {
    const {
        premium,
        salesCycle,
        techAttachRate,
        staffUtilization,
        implementationVariance
    } = inputs;

    // 1. REVENUE ADJUSTMENT
    // Premium impact: linear scaling from base
    // If base premium is 10%, and user selects 5%, revenue scales to 75%
    // Formula: revenueMultiplier = 0.5 + (premium / 20)
    // This gives: 0% premium = 0.5x, 10% = 1.0x, 20% = 1.5x
    const premiumMultiplier = 0.5 + (premium / 20);

    // Sales cycle impact: longer cycle delays revenue recognition
    // Base is 9 months. Each month deviation shifts revenue timing.
    // Shorter cycle (6mo) = earlier revenue = 1.1x Y1-2
    // Longer cycle (15mo) = delayed revenue = 0.7x Y1-2, catches up Y3+
    const cycleDeviation = salesCycle - 9;
    const earlyYearCycleFactor = 1 - (cycleDeviation * 0.05); // ±5% per month
    const lateYearCycleFactor = 1 + (cycleDeviation * 0.02);  // partial catch-up

    // 2. MARGIN ADJUSTMENT
    // Tech attach rate affects blended margin
    // Base: 25% attach gives ~35% blended margin
    // Formula: marginBoost = (techAttachRate - 25) * 0.5
    // This adds/subtracts percentage points to margin
    const marginBoostFromAttach = (techAttachRate - 25) * 0.5;

    // Implementation variance directly reduces margin
    // +10% cost overrun = -10% margin impact
    const marginDragFromCost = -implementationVariance;

    // Staff utilization affects operating leverage
    // Base 60% utilization. Lower = higher effective cost per billable hour
    // Formula: opexMultiplier = 60 / staffUtilization
    // 40% utilization = 1.5x opex, 75% = 0.8x opex
    const opexMultiplier = 60 / staffUtilization;

    // 3. APPLY ADJUSTMENTS TO EACH YEAR
    const adjusted = {
        revenue: {},
        ebitda: {},
        fcf: {}
    };

    const years = ['year1', 'year2', 'year3', 'year4', 'year5'];

    years.forEach((year, index) => {
        // Revenue: apply premium and cycle factors
        const cycleFactor = index < 2 ? earlyYearCycleFactor : lateYearCycleFactor;
        adjusted.revenue[year] = Math.round(
            baseProjections.revenue[year] * premiumMultiplier * cycleFactor
        );

        // EBITDA: revenue adjustment + margin adjustments + opex adjustment
        const baseEbitdaMargin = baseProjections.ebitda[year] / baseProjections.revenue[year];
        const adjustedMargin = baseEbitdaMargin + (marginBoostFromAttach / 100) + (marginDragFromCost / 100);

        // For negative EBITDA years, apply opex multiplier to the loss
        if (baseProjections.ebitda[year] < 0) {
            adjusted.ebitda[year] = Math.round(baseProjections.ebitda[year] * opexMultiplier);
        } else {
            adjusted.ebitda[year] = Math.round(adjusted.revenue[year] * adjustedMargin);
        }

        // FCF: EBITDA minus assumed CapEx (simplified: EBITDA - 50 per year)
        adjusted.fcf[year] = adjusted.ebitda[year] - 50;
    });

    // 4. CALCULATE SUMMARY METRICS
    const cumulativeFCF = Object.values(adjusted.fcf).reduce((sum, val) => sum + val, 0);

    // Find break-even year (first year with positive cumulative FCF)
    let runningTotal = 0;
    let breakEvenYear = null;
    years.forEach((year, index) => {
        runningTotal += adjusted.fcf[year];
        if (runningTotal > 0 && breakEvenYear === null) {
            breakEvenYear = index + 1;
        }
    });

    // Peak cash burn (most negative cumulative point)
    runningTotal = 0;
    let peakBurn = 0;
    years.forEach(year => {
        runningTotal += adjusted.fcf[year];
        if (runningTotal < peakBurn) {
            peakBurn = runningTotal;
        }
    });

    return {
        projections: adjusted,
        metrics: {
            cumulativeFCF5Year: cumulativeFCF,
            breakEvenYear: breakEvenYear || '>5',
            peakCashBurn: Math.abs(peakBurn),
            year5Revenue: adjusted.revenue.year5,
            year5EBITDA: adjusted.ebitda.year5
        }
    };
}

function classifyScenario(metrics) {
    const { breakEvenYear, cumulativeFCF5Year, peakCashBurn } = metrics;

    // OPTIMISTIC: Break-even by Y3, positive 5-year FCF
    if (breakEvenYear !== '>5' && breakEvenYear <= 3 && cumulativeFCF5Year > 0) {
        return {
            label: 'OPTIMISTIC',
            cssClass: 'optimistic',
            icon: '✓',
            message: 'Strong unit economics with rapid path to profitability. Assumptions may be aggressive—validate premium capture with market data.'
        };
    }

    // BASE CASE: Break-even Y4, moderate FCF
    if (breakEvenYear === 4 && cumulativeFCF5Year > -500) {
        return {
            label: 'BASE CASE',
            cssClass: 'base',
            icon: '●',
            message: 'Projections align with management base case. Execution risk remains on sales cycle and tech attach rate.'
        };
    }

    // DISTRESSED: No break-even in sight, deep negative FCF
    if (breakEvenYear === '>5' && cumulativeFCF5Year < -1000) {
        return {
            label: 'DISTRESSED',
            cssClass: 'distressed',
            icon: '✗',
            message: 'Current assumptions do not support a viable business case. Fundamental repositioning required before proceeding.'
        };
    }

    // STRESSED: Break-even Y5 or later, negative FCF
    if (breakEvenYear === '>5' || breakEvenYear >= 5 || cumulativeFCF5Year < -500) {
        return {
            label: 'STRESSED',
            cssClass: 'stressed',
            icon: '⚠',
            message: 'Extended path to profitability increases capital requirements. Consider reducing scope or securing additional runway buffer.'
        };
    }

    // Default to cautious
    return {
        label: 'CAUTIOUS',
        cssClass: 'stressed',
        icon: '⚠',
        message: 'Mixed signals—some assumptions favorable, others concerning. Deep-dive on highest-impact variables.'
    };
}

// ============================================
// RENDERING
// ============================================

function renderSensitivityPanel(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Remove existing panel if it exists
    const existingPanel = document.getElementById('sensitivityPanel');
    if (existingPanel) {
        existingPanel.remove();
    }

    // Destroy existing chart if it exists
    if (sensitivityChart) {
        sensitivityChart.destroy();
        sensitivityChart = null;
    }

    // Calculate base metrics for delta comparison
    baseMetrics = calculateProjections(baseAssumptions).metrics;

    // Create panel container
    const panel = document.createElement('div');
    panel.className = 'sensitivity-panel';
    panel.id = 'sensitivityPanel';

    panel.innerHTML = `
        <div class="sensitivity-header">
            <div class="sensitivity-header-content">
                <h3>Sensitivity Analysis</h3>
                <p class="sensitivity-subtitle">Adjust assumptions to see how they impact projected outcomes</p>
            </div>
            <button class="reset-btn" id="resetBtn">Reset to Base Case</button>
        </div>

        <div class="sensitivity-sliders" id="sensitivitySliders">
            ${renderSliders()}
        </div>

        <div class="sensitivity-metric-cards" id="metricCards">
            <!-- Will be populated by updateMetricCards -->
        </div>

        <div class="sensitivity-chart-container">
            <canvas id="sensitivityChart"></canvas>
        </div>

        <div class="scenario-indicator-wrapper" id="scenarioIndicator">
            <!-- Will be populated by updateScenarioIndicator -->
        </div>
    `;

    container.appendChild(panel);

    // Initialize components
    initEventListeners();
    initSensitivityChart();
    updateUI();
}

function renderSliders() {
    return sliderConfig.map(config => {
        const value = currentInputs[config.id];
        const displayValue = value + config.unit;
        
        return `
            <div class="sensitivity-slider">
                <label class="slider-label">${config.label}</label>
                <div class="slider-row">
                    <span class="slider-min">${config.min}${config.unit}</span>
                    <input type="range" 
                           id="slider-${config.id}" 
                           min="${config.min}" 
                           max="${config.max}" 
                           step="${config.step}" 
                           value="${value}"
                           class="slider-input">
                    <span class="slider-max">${config.max}${config.unit}</span>
                    <span class="slider-value" id="value-${config.id}">${displayValue}</span>
                </div>
                <span class="slider-warning" id="warning-${config.id}"></span>
            </div>
        `;
    }).join('');
}

function updateMetricCards(metrics) {
    const container = document.getElementById('metricCards');
    if (!container) return;

    const formatBreakEven = (val) => val === '>5' ? '>5 Years' : `Year ${val}`;
    const formatCurrency = (val) => `¥${val.toLocaleString()}M`;

    const cards = [
        {
            label: 'Break-Even',
            value: formatBreakEven(metrics.breakEvenYear),
            baseValue: baseMetrics.breakEvenYear,
            currentValue: metrics.breakEvenYear,
            isBreakEven: true
        },
        {
            label: '5-Year Cumulative FCF',
            value: formatCurrency(metrics.cumulativeFCF5Year),
            baseValue: baseMetrics.cumulativeFCF5Year,
            currentValue: metrics.cumulativeFCF5Year,
            positiveIsGood: true
        },
        {
            label: 'Peak Cash Burn',
            value: formatCurrency(metrics.peakCashBurn),
            baseValue: baseMetrics.peakCashBurn,
            currentValue: metrics.peakCashBurn,
            positiveIsGood: false
        }
    ];

    container.innerHTML = cards.map(card => {
        let deltaClass = 'neutral';
        let deltaText = '—';

        if (card.isBreakEven) {
            const baseNum = card.baseValue === '>5' ? 6 : card.baseValue;
            const currNum = card.currentValue === '>5' ? 6 : card.currentValue;
            if (currNum < baseNum) {
                deltaClass = 'positive';
                deltaText = `▲ ${baseNum - currNum}yr faster`;
            } else if (currNum > baseNum) {
                deltaClass = 'negative';
                deltaText = `▼ ${currNum - baseNum}yr slower`;
            }
        } else {
            const diff = card.currentValue - card.baseValue;
            if (diff !== 0) {
                const isPositive = card.positiveIsGood ? diff > 0 : diff < 0;
                deltaClass = isPositive ? 'positive' : 'negative';
                const arrow = isPositive ? '▲' : '▼';
                deltaText = `${arrow} ¥${Math.abs(diff).toLocaleString()}M`;
            }
        }

        const valueClass = card.label === '5-Year Cumulative FCF' 
            ? (card.currentValue >= 0 ? 'value-positive' : 'value-negative')
            : '';

        return `
            <div class="sensitivity-metric-card">
                <div class="metric-label">${card.label}</div>
                <div class="metric-value ${valueClass}">${card.value}</div>
                <div class="metric-delta ${deltaClass}">${deltaText}</div>
            </div>
        `;
    }).join('');
}

function initSensitivityChart() {
    const canvas = document.getElementById('sensitivityChart');
    if (!canvas || typeof Chart === 'undefined') return;

    const result = calculateProjections(currentInputs);
    const ebitdaData = Object.values(result.projections.ebitda);

    sensitivityChart = new Chart(canvas.getContext('2d'), {
        type: 'bar',
        data: {
            labels: ['Y1', 'Y2', 'Y3', 'Y4', 'Y5'],
            datasets: [
                {
                    label: 'Base Case',
                    data: Object.values(baseProjections.ebitda),
                    backgroundColor: 'rgba(156, 163, 175, 0.5)',
                    borderColor: 'rgba(156, 163, 175, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Adjusted',
                    data: ebitdaData,
                    backgroundColor: 'rgba(30, 58, 95, 0.7)',
                    borderColor: 'rgba(30, 58, 95, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: {
                            family: "'DM Sans', sans-serif",
                            size: 12
                        },
                        color: '#475569',
                        padding: 20
                    }
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
                        label: (context) => `${context.dataset.label}: ¥${context.raw}M`
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#64748b',
                        font: {
                            family: "'DM Sans', sans-serif",
                            size: 12
                        }
                    },
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'EBITDA (¥M)',
                        color: '#64748b',
                        font: {
                            family: "'DM Sans', sans-serif",
                            size: 12
                        }
                    },
                    ticks: {
                        color: '#64748b',
                        font: {
                            family: "'DM Sans', sans-serif",
                            size: 11
                        }
                    },
                    grid: {
                        color: (context) => context.tick.value === 0 ? '#0f172a' : '#e2e8f0',
                        lineWidth: (context) => context.tick.value === 0 ? 2 : 1
                    }
                }
            }
        }
    });

    // Track chart for cleanup
    if (typeof activeCharts !== 'undefined') {
        activeCharts.push(sensitivityChart);
    }
}

function updateChart() {
    if (!sensitivityChart) return;

    const result = calculateProjections(currentInputs);
    const ebitdaData = Object.values(result.projections.ebitda);
    
    sensitivityChart.data.datasets[1].data = ebitdaData;
    sensitivityChart.update('default');
}

function updateScenarioIndicator(metrics) {
    const container = document.getElementById('scenarioIndicator');
    if (!container) return;

    const scenario = classifyScenario(metrics);

    container.innerHTML = `
        <div class="scenario-indicator ${scenario.cssClass}">
            <span class="scenario-icon">${scenario.icon}</span>
            <div class="scenario-content">
                <div class="scenario-label">Current Scenario: ${scenario.label}</div>
                <p class="scenario-message">${scenario.message}</p>
            </div>
        </div>
    `;
}

// ============================================
// EVENT HANDLING
// ============================================

function initEventListeners() {
    // Slider event listeners
    sliderConfig.forEach(config => {
        const slider = document.getElementById(`slider-${config.id}`);
        if (!slider) return;

        slider.addEventListener('input', (e) => {
            handleSliderChange(config.id, parseFloat(e.target.value), config);
        });
    });

    // Reset button
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetToBaseCase);
    }
}

function handleSliderChange(sliderId, value, config) {
    // Update state
    currentInputs[sliderId] = value;

    // Update displayed value
    const valueDisplay = document.getElementById(`value-${sliderId}`);
    if (valueDisplay) {
        valueDisplay.textContent = value + config.unit;
    }

    // Check for warnings
    const warningDisplay = document.getElementById(`warning-${sliderId}`);
    if (warningDisplay && config.warningThreshold !== null) {
        const showWarning = config.warningBelow 
            ? value < config.warningThreshold 
            : value > config.warningThreshold;
        warningDisplay.textContent = showWarning ? config.warningMessage : '';
    }

    // Update all outputs
    updateUI();
}

function updateUI() {
    const result = calculateProjections(currentInputs);
    
    updateMetricCards(result.metrics);
    updateChart();
    updateScenarioIndicator(result.metrics);
}

function resetToBaseCase() {
    // Reset inputs
    currentInputs = { ...baseAssumptions };

    // Reset slider positions and displays
    sliderConfig.forEach(config => {
        const slider = document.getElementById(`slider-${config.id}`);
        const valueDisplay = document.getElementById(`value-${config.id}`);
        const warningDisplay = document.getElementById(`warning-${config.id}`);

        if (slider) {
            slider.value = config.base;
        }
        if (valueDisplay) {
            valueDisplay.textContent = config.base + config.unit;
        }
        if (warningDisplay) {
            warningDisplay.textContent = '';
        }
    });

    // Update UI
    updateUI();
}

// ============================================
// INITIALIZATION
// ============================================

function initSensitivityPanel(containerId = 'contentContainer') {
    // Reset state
    currentInputs = { ...baseAssumptions };
    sensitivityChart = null;
    
    // Render the panel
    renderSensitivityPanel(containerId);
}

// Export for use in app.js
window.initSensitivityPanel = initSensitivityPanel;

