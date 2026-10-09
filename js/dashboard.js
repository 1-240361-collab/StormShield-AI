// js/dashboard.js
import { supabase } from './supabase.js';

// --- Auth Guard: Redirect if not logged in ---
async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        window.location.href = 'index.html';
        return;
    }
    // Show user's name
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
const map = L.map('map').setView([14.5995, 120.9842], 13); // Manila coordinates
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// --- Load Recent Incidents (Placeholder for now) ---
async function loadIncidents() {
    const { data, error } = await supabase
        .from('incidents')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

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
}
loadIncidents();

// --- Weather Alert (Placeholder) ---
// We will replace this with Open-Meteo API later
document.getElementById('weather-alert').textContent = '✅ No active weather alerts for your area.';

// --- SOS Button (Placeholder) ---
document.getElementById('sos-btn').addEventListener('click', () => {
    alert('🆘 SOS Feature coming soon! This will alert responders with your GPS location.');
});