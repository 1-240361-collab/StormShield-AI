// js/damage-analysis.js
// StormShield AI - Damage Report Analysis
// Classifies incident type and assigns a severity score based on text description

const DAMAGE_KEYWORDS = {
    flood: {
        keywords: ['flood', 'flooded', 'flooding', 'baha', 'water rising', 'flash flood', 'rising water', 'river overflow', 'knee-deep', 'chest-deep', 'surge', 'drown'],
        baseSeverity: 3,
    },
    fire: {
        keywords: ['fire', 'sunog', 'burning', 'flames', 'smoke', 'blaze', 'explosion', 'exploded', 'gas leak', 'wildfire'],
        baseSeverity: 4,
    },
    earthquake: {
        keywords: ['earthquake', 'quake', 'lindol', 'tremor', 'magnitude', 'shaking', 'collapsed', 'rubble', 'aftershock'],
        baseSeverity: 4,
    },
    medical: {
        keywords: ['injured', 'injury', 'bleeding', 'unconscious', 'heart attack', 'stroke', 'choking', 'broken bone', 'fracture', 'wound', 'medical', 'hospital', 'emergency', 'ambulance', 'breathing'],
        baseSeverity: 4,
    },
    landslide: {
        keywords: ['landslide', 'mudslide', 'pagguho', 'erosion', 'ground collapse'],
        baseSeverity: 4,
    },
    storm: {
        keywords: ['typhoon', 'storm', 'bagyo', 'hurricane', 'strong wind', 'gust', 'downed', 'power line', 'tree fell', 'roof blown'],
        baseSeverity: 3,
    },
    structural: {
        keywords: ['collapsed', 'crack', 'structural', 'building damage', 'wall fell', 'roof collapse', 'leaning'],
        baseSeverity: 3,
    },
    other: {
        keywords: [],
        baseSeverity: 1,
    },
};

// Urgency modifiers that push severity higher
const URGENCY_KEYWORDS = ['trapped', 'urgent', 'help', 'dying', 'critical', 'severe', 'massive', 'large', 'many people', 'children', 'elderly', 'pregnant', 'sos', 'immediate', 'now', 'quick'];

// Numbers that indicate scale (e.g., "5 people", "10 houses")
const SCALE_PATTERNS = [
    { pattern: /\b(\d{2,})\s*(people|persons|residents|victims|families|houses|buildings|structures)/i, weight: 2 },
    { pattern: /\b(\d)\s*(people|persons|residents|victims|families|houses|buildings|structures)/i, weight: 1 },
    { pattern: /\b(many|multiple|several|dozens|hundreds)\b/i, weight: 2 },
];

/**
 * Analyze a damage report and return classification + severity
 * @param {string} description - User-provided incident description
 * @param {string} selectedType - The type the user selected in the form (if any)
 * @returns {object} { type, severity, confidence, reasons }
 */
export function analyzeDamage(description, selectedType = null) {
    const text = (description || '').toLowerCase();

    // 1. Detect type by keyword matching
    let detectedType = selectedType || 'other';
    let bestTypeScore = 0;

    for (const [type, data] of Object.entries(DAMAGE_KEYWORDS)) {
        let score = 0;
        for (const kw of data.keywords) {
            if (text.includes(kw)) score += kw.length;
        }
        if (score > bestTypeScore) {
            bestTypeScore = score;
            detectedType = type;
        }
    }

    // If user selected a type and we have low confidence, trust the user
    if (selectedType && selectedType !== 'other' && bestTypeScore < 3) {
        detectedType = selectedType;
    }

    // 2. Calculate severity (1-5)
    const typeData = DAMAGE_KEYWORDS[detectedType] || DAMAGE_KEYWORDS.other;
    let severity = typeData.baseSeverity;

    // Add for urgency keywords
    const foundUrgency = URGENCY_KEYWORDS.filter(kw => text.includes(kw));
    severity += Math.min(foundUrgency.length, 1); // Max +1 from urgency

    // Add for scale
    for (const { pattern, weight } of SCALE_PATTERNS) {
        if (pattern.test(text)) {
            severity += weight;
            break;
        }
    }

    // Clamp to 1-5
    severity = Math.max(1, Math.min(5, severity));

    // 3. Build reasons (for responder context)
    const reasons = [];
    if (bestTypeScore > 0) reasons.push(`Matched ${bestTypeScore} chars of type keywords`);
    if (foundUrgency.length) reasons.push(`Urgency words: ${foundUrgency.join(', ')}`);
    if (severity >= 4) reasons.push('High severity detected');

    // 4. Confidence (0-100)
    const confidence = Math.min(100, bestTypeScore * 5 + foundUrgency.length * 10);

    return {
        type: detectedType,
        severity,
        confidence,
        reasons,
        matchedKeywords: foundUrgency,
    };
}

/**
 * Get a human-readable severity label
 */
export function severityLabel(severity) {
    const labels = {
        1: { text: 'Low', color: '#6cb52d', icon: '🟢' },
        2: { text: 'Moderate', color: '#f0c419', icon: '🟡' },
        3: { text: 'High', color: '#ff8c00', icon: '🟠' },
        4: { text: 'Severe', color: '#e74c3c', icon: '🔴' },
        5: { text: 'Critical', color: '#8b0000', icon: '⚫' },
    };
    return labels[severity] || labels[1];
}

/**
 * Get a human-readable incident type label
 */
export function typeLabel(type) {
    const labels = {
        flood: { text: 'Flood', icon: '🌊' },
        fire: { text: 'Fire', icon: '🔥' },
        earthquake: { text: 'Earthquake', icon: '🌍' },
        medical: { text: 'Medical', icon: '🚑' },
        landslide: { text: 'Landslide', icon: '⛰️' },
        storm: { text: 'Storm', icon: '🌀' },
        structural: { text: 'Structural Damage', icon: '🏚️' },
        other: { text: 'Other', icon: '⚠️' },
    };
    return labels[type] || labels.other;
}