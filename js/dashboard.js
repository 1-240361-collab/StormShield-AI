

// js/dashboard.js
import { supabase } from './supabase.js';

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
const map = L.map('map').setView([14.3122, 121.1114], 14);
window.map = map;
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Layer group for incident markers
const incidentMarkers = L.layerGroup().addTo(map);

// --- Load Incidents ---
async function loadIncidents() {
    const { data, error } = await supabase
        .from('incidents')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

    const list = document.getElementById('incidents-list');
    
    if (error || !data || data.length === 0) {
        list.innerHTML = '<p class="empty-state">No incidents reported yet.</p>';
        return;
    }

    list.innerHTML = data.map(incident => `
        <div class="incident-item">
            <strong>${incident.type.toUpperCase()}</strong>
            <p>${incident.description || 'No description'}</p>
            <small>${new Date(incident.created_at).toLocaleString()}</small>
        </div>
    `).join('');

    // Clear old markers and add new ones
    incidentMarkers.clearLayers();
    data.forEach(incident => {
        if (incident.location) {
            // PostGIS returns GeoJSON if we ask nicely, or we parse WKT
            const match = incident.location.match(/POINT\(([-\d.]+) ([-\d.]+)\)/);
            if (match) {
                const lng = parseFloat(match[1]);
                const lat = parseFloat(match[2]);
                L.marker([lat, lng])
                    .bindPopup(`<strong>${incident.type.toUpperCase()}</strong><br>${incident.description || ''}`)
                    .addTo(incidentMarkers);
            }
        }
    });
}
loadIncidents();

// --- Real-Time: Listen for new incidents ---
supabase
    .channel('public:incidents')
    .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'incidents' }, 
        (payload) => {
            console.log('🔴 New incident received:', payload.new);
            loadIncidents(); // Refresh the feed
            showNotification('📝 New Incident Reported', `${payload.new.type.toUpperCase()}: ${payload.new.description || 'No description'}`);
        }
    )
    .subscribe();

// --- Real-Time: Listen for new SOS alerts ---
supabase
    .channel('public:sos_alerts')
    .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'sos_alerts' }, 
        (payload) => {
            console.log('🚨 SOS Alert received:', payload.new);
            showNotification('🚨 SOS EMERGENCY', 'Someone needs help! Check the map for location.');
        }
    )
    .subscribe();

// --- Browser Notification Helper ---
function showNotification(title, body) {
    // Check if the browser supports notifications
    if (!('Notification' in window)) return;

    // Request permission if not granted
    if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification(title, { body, icon: 'https://cdn-icons-png.flaticon.com/512/564/564619.png' });
            }
        });
    } else if (Notification.permission === 'granted') {
        new Notification(title, { body, icon: 'https://cdn-icons-png.flaticon.com/512/564/564619.png' });
    }
}

// --- Weather Alert (Placeholder) ---
document.getElementById('weather-alert').textContent = '✅ No active weather alerts for your area.';