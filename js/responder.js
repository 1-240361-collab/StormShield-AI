// js/responder.js
// StormShield AI - Responder Command Center

import { supabase } from './supabase.js';
import { severityLabel, typeLabel, analyzeDamage } from './damage-analysis.js';

// --- Auth Guard ---
async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        window.location.href = 'index.html';
        return;
    }
    const { data: { user } } = await supabase.auth.getUser();
    const userNameEl = document.getElementById('user-name');
    if (user && userNameEl) {
        userNameEl.textContent = `👤 ${user.user_metadata.full_name || user.email}`;
    }
}
checkAuth();

// --- Logout ---
document.getElementById('logout-btn').addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.href = 'index.html';
});

// --- Initialize Map ---
const map = L.map('responder-map').setView([14.3122, 121.1114], 11);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Layer groups
const incidentLayer = L.layerGroup().addTo(map);
const sosLayer = L.layerGroup().addTo(map);

let allIncidents = [];
let allSOS = [];

// --- Load Incidents ---
async function loadIncidents() {
    const { data, error } = await supabase
        .from('incidents')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

    if (error) {
        console.error('Failed to load incidents:', error);
        return;
    }

    // Enrich with analysis if severity is missing or low confidence
    allIncidents = (data || []).map(incident => {
        const analysis = analyzeDamage(incident.description || '', incident.type);
        return {
            ...incident,
            _analysis: analysis,
            _severity: incident.severity && incident.severity > 1 ? incident.severity : analysis.severity,
        };
    });

    renderIncidents();
    renderIncidentMarkers();
    updateStats();
}

// --- Render Incidents List ---
function renderIncidents() {
    const listEl = document.getElementById('incidents-list');
    const filter = document.getElementById('filter-type').value;

    let filtered = allIncidents;
    if (filter !== 'all') {
        filtered = allIncidents.filter(i => i.type === filter);
    }

    // Sort by severity descending, then by created_at
    filtered.sort((a, b) => {
        if (b._severity !== a._severity) return b._severity - a._severity;
        return new Date(b.created_at) - new Date(a.created_at);
    });

    if (filtered.length === 0) {
        listEl.innerHTML = '<p class="empty-state">No incidents match this filter.</p>';
        return;
    }

    listEl.innerHTML = filtered.map(incident => {
        const typeInfo = typeLabel(incident.type);
        const sevInfo = severityLabel(incident._severity);
        const date = new Date(incident.created_at).toLocaleString();
        const status = incident.status || 'pending';

        const statusBadge = status === 'resolved'
            ? '<span style="color:#27ae60; font-size:0.7rem;">✅ RESOLVED</span>'
            : status === 'in_progress'
                ? '<span style="color:#3498db; font-size:0.7rem;">🔵 IN PROGRESS</span>'
                : '<span style="color:#f0c419; font-size:0.7rem;">⏳ PENDING</span>';

        return `
            <div class="incident-card severity-${incident._severity}" data-id="${incident.id}">
                <div class="incident-header">
                    <span class="incident-type">${typeInfo.icon} ${typeInfo.text}</span>
                    <span class="severity-badge sev-${incident._severity}">${sevInfo.text}</span>
                </div>
                <div class="incident-description">${incident.description || 'No description provided.'}</div>
                <div class="incident-meta">
                    <span>${date}</span>
                    <span>${statusBadge}</span>
                </div>
                <div class="incident-actions">
                    <button class="btn-incident btn-view" data-action="view" data-id="${incident.id}">📍 View</button>
                    ${status === 'resolved'
                        ? ''
                        : `<button class="btn-incident btn-assign" data-action="assign" data-id="${incident.id}">🚑 Assign</button>
                           <button class="btn-incident btn-resolve" data-action="resolve" data-id="${incident.id}">✅ Resolve</button>`}
                </div>
            </div>
        `;
    }).join('');

    // Add event listeners
    listEl.querySelectorAll('[data-action]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const action = btn.dataset.action;
            const id = btn.dataset.id;
            handleIncidentAction(action, id);
        });
    });

    listEl.querySelectorAll('.incident-card').forEach(card => {
        card.addEventListener('click', () => {
            const id = card.dataset.id;
            const incident = allIncidents.find(i => i.id === id);
            if (incident && incident.location) {
                const coords = parsePostGISPoint(incident.location);
                if (coords) {
                    map.setView([coords.lat, coords.lng], 16);
                }
            }
        });
    });
}

// --- Handle Incident Actions ---
async function handleIncidentAction(action, id) {
    if (action === 'view') {
        const incident = allIncidents.find(i => i.id === id);
        if (!incident) return;
        const coords = parsePostGISPoint(incident.location);
        if (coords) map.setView([coords.lat, coords.lng], 16);
        return;
    }

    let newStatus = null;
    if (action === 'assign') newStatus = 'in_progress';
    if (action === 'resolve') newStatus = 'resolved';

    if (!newStatus) return;

    const { error } = await supabase
        .from('incidents')
        .update({ status: newStatus })
        .eq('id', id);

    if (error) {
        console.error('Failed to update incident:', error);
        alert('Failed to update. Please try again.');
        return;
    }

    // Update local state and re-render
    const incident = allIncidents.find(i => i.id === id);
    if (incident) incident.status = newStatus;
    renderIncidents();
    updateStats();
}

// --- Render Incident Map Markers ---
function renderIncidentMarkers() {
    incidentLayer.clearLayers();

    allIncidents.forEach(incident => {
        const coords = parsePostGISPoint(incident.location);
        if (!coords) return;

        const sevInfo = severityLabel(incident._severity);
        const typeInfo = typeLabel(incident.type);

        const icon = L.divIcon({
            className: 'incident-marker',
            html: `<div style="background-color: ${sevInfo.color}; width: 26px; height: 26px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; font-size: 13px; box-shadow: 0 2px 6px rgba(0,0,0,0.6);">${typeInfo.icon}</div>`,
            iconSize: [26, 26],
            iconAnchor: [13, 13]
        });

        L.marker([coords.lat, coords.lng], { icon })
            .bindPopup(`
                <strong>${typeInfo.icon} ${typeInfo.text}</strong><br>
                <em>${sevInfo.icon} ${sevInfo.text} Severity</em><br>
                ${incident.description || 'No description'}<br>
                <small>${new Date(incident.created_at).toLocaleString()}</small>
            `)
            .addTo(incidentLayer);
    });
}

// --- Load SOS Alerts ---
async function loadSOS() {
    const { data, error } = await supabase
        .from('sos_alerts')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(50);

    if (error) {
        console.error('Failed to load SOS:', error);
        return;
    }

    allSOS = data || [];
    renderSOS();
    renderSOSMarkers();
    updateStats();
}

// --- Render SOS List ---
function renderSOS() {
    const listEl = document.getElementById('sos-list');

    if (allSOS.length === 0) {
        listEl.innerHTML = '<p class="empty-state">✅ No active SOS. All clear.</p>';
        return;
    }

    listEl.innerHTML = allSOS.map(sos => {
        const coords = parsePostGISPoint(sos.location);
        const locationText = coords
            ? `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`
            : 'Location unavailable';
        const time = new Date(sos.created_at).toLocaleTimeString();

        return `
            <div class="sos-card" data-id="${sos.id}">
                <div class="sos-header">
                    <span class="sos-title">🆘 SOS ALERT</span>
                    <span class="sos-time">${time}</span>
                </div>
                <div class="sos-location">📍 ${locationText}</div>
                <div class="sos-actions">
                    <button class="btn-respond" data-action="respond-sos" data-id="${sos.id}">🚨 MARK RESPONDED</button>
                </div>
            </div>
        `;
    }).join('');

    // Actions
    listEl.querySelectorAll('[data-action="respond-sos"]').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const id = btn.dataset.id;
            await handleSOSResponse(id);
        });
    });

    // Zoom on click
    listEl.querySelectorAll('.sos-card').forEach(card => {
        card.addEventListener('click', () => {
            const id = card.dataset.id;
            const sos = allSOS.find(s => s.id === id);
            if (sos && sos.location) {
                const coords = parsePostGISPoint(sos.location);
                if (coords) map.setView([coords.lat, coords.lng], 17);
            }
        });
    });
}

async function handleSOSResponse(id) {
    const { error } = await supabase
        .from('sos_alerts')
        .update({ status: 'responded' })
        .eq('id', id);

    if (error) {
        console.error('Failed to update SOS:', error);
        alert('Failed to update. Please try again.');
        return;
    }

    allSOS = allSOS.filter(s => s.id !== id);
    renderSOS();
    renderSOSMarkers();
    updateStats();
}

// --- Render SOS Map Markers ---
function renderSOSMarkers() {
    sosLayer.clearLayers();

    allSOS.forEach(sos => {
        const coords = parsePostGISPoint(sos.location);
        if (!coords) return;

        const icon = L.divIcon({
            className: 'sos-marker',
            html: '<div style="background-color: #8b0000; width: 34px; height: 34px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; font-size: 16px; box-shadow: 0 0 20px rgba(255,0,0,0.8); animation: pulse 2s infinite;">🆘</div>',
            iconSize: [34, 34],
            iconAnchor: [17, 17]
        });

        L.marker([coords.lat, coords.lng], { icon })
            .bindPopup(`<strong>🆘 SOS EMERGENCY</strong><br>${new Date(sos.created_at).toLocaleString()}`)
            .addTo(sosLayer);
    });
}

// --- Stats ---
function updateStats() {
    document.getElementById('stat-total').textContent = allIncidents.length;
    document.getElementById('stat-sos').textContent = allSOS.length;
    document.getElementById('stat-severe').textContent = allIncidents.filter(i => i._severity >= 4).length;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const resolvedToday = allIncidents.filter(i =>
        i.status === 'resolved' && new Date(i.created_at) >= today
    ).length;
    document.getElementById('stat-resolved').textContent = resolvedToday;
}

// --- Parse PostGIS location ---
function parsePostGISPoint(location) {
    if (!location) return null;

    // GeoJSON format
    if (typeof location === 'object' && location.coordinates) {
        return { lng: location.coordinates[0], lat: location.coordinates[1] };
    }

    // WKT string
    if (typeof location === 'string') {
        const match = location.match(/POINT\(([-\d.]+) ([-\d.]+)\)/);
        if (match) return { lng: parseFloat(match[1]), lat: parseFloat(match[2]) };
    }

    return null;
}

// --- Filter Handler ---
document.getElementById('filter-type').addEventListener('change', renderIncidents);

// --- Initial Load ---
loadIncidents();
loadSOS();

// --- Real-time Updates ---
supabase
    .channel('responder:incidents')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'incidents' }, () => loadIncidents())
    .subscribe();

supabase
    .channel('responder:sos')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'sos_alerts' }, () => loadSOS())
    .subscribe();