// js/evacuation.js
import { supabase } from './supabase.js';

// Wait for the map to be ready (set globally in dashboard.js)
const waitForMap = setInterval(() => {
    if (window.map) {
        clearInterval(waitForMap);
        initializeEvacuation();
    }
}, 100);

let userMarker = null;
let routeLine = null;
let evacMarkers = [];

// --- CONFIG: Legacy anon key (eyJ...) for direct fetch ---
const EVAC_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjbXJ0cnRjb3Jiam9mdWtvZ2tkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE1MjI5NjQsImV4cCI6MjEwNzA5ODk2NH0.w6-o5yl2HQCioFJq0w1FxL82cPqSjGnM6lbsTVAol38';
const EVAC_API_URL = 'https://lcmrtrtcorbjofukogkd.supabase.co/rest/v1/evacuation_centers_view?select=*&is_active=eq.true';

function initializeEvacuation() {
    const map = window.map;

    // --- Load evacuation centers from Supabase (via raw fetch) ---
    async function loadEvacuationCenters() {
        try {
            const response = await fetch(EVAC_API_URL, {
                headers: {
                    'apikey': EVAC_API_KEY,
                    'Authorization': `Bearer ${EVAC_API_KEY}`
                }
            });

            const data = await response.json();

            if (!data || data.length === 0) {
                return;
            }

            const evacIcon = L.divIcon({
                className: 'evac-marker',
                html: '<div style="background-color: #2e7d32; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; font-size: 16px; box-shadow: 0 2px 5px rgba(0,0,0,0.5);">🏠</div>',
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            });

            data.forEach(center => {
                if (!center.location_geojson) return;

                let geo;
                try {
                    geo = JSON.parse(center.location_geojson);
                } catch (e) {
                    return;
                }

                const lng = geo.coordinates[0];
                const lat = geo.coordinates[1];

                const marker = L.marker([lat, lng], { icon: evacIcon })
                    .bindPopup(`
                        <strong>🏠 ${center.name}</strong><br>
                        📍 ${center.address}<br>
                        👥 Capacity: ${center.current_occupancy}/${center.capacity}
                    `)
                    .addTo(map);
                evacMarkers.push({ marker, center, lat, lng });
            });
        } catch (err) {
            console.error('Evacuation centers fetch error:', err);
        }
    }

    loadEvacuationCenters();

    // --- Handle "Find Nearest Evacuation Center" button ---
    document.getElementById('find-evac-btn').addEventListener('click', () => {
        const btn = document.getElementById('find-evac-btn');
        const infoEl = document.getElementById('evac-info');

        btn.disabled = true;
        btn.textContent = '📡 Getting your location...';
        infoEl.style.display = 'none';

        if (!navigator.geolocation) {
            btn.disabled = false;
            btn.textContent = '📍 Find Nearest Evacuation Center';
            alert('Geolocation is not supported by your browser.');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;

                const userIcon = L.divIcon({
                    className: 'user-marker',
                    html: '<div style="background-color: #2196F3; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.5);"></div>',
                    iconSize: [20, 20],
                    iconAnchor: [10, 10]
                });

                if (userMarker) map.removeLayer(userMarker);
                userMarker = L.marker([userLat, userLng], { icon: userIcon })
                    .bindPopup('📍 You are here')
                    .addTo(map);

                let nearest = null;
                let nearestDist = Infinity;

                evacMarkers.forEach(e => {
                    const dist = haversine(userLat, userLng, e.lat, e.lng);
                    if (dist < nearestDist) {
                        nearestDist = dist;
                        nearest = e;
                    }
                });

                if (!nearest) {
                    infoEl.textContent = '❌ No active evacuation centers found.';
                    infoEl.style.display = 'block';
                    btn.disabled = false;
                    btn.textContent = '📍 Find Nearest Evacuation Center';
                    return;
                }

                if (routeLine) map.removeLayer(routeLine);
                routeLine = L.polyline(
                    [[userLat, userLng], [nearest.lat, nearest.lng]],
                    { color: '#ff6b35', weight: 4, dashArray: '10, 10' }
                ).addTo(map);

                map.fitBounds([
                    [userLat, userLng],
                    [nearest.lat, nearest.lng]
                ], { padding: [50, 50] });

                const walkingMinutes = Math.round((nearestDist / 5) * 60);

                infoEl.innerHTML = `
                    <strong>🏠 Nearest Evacuation Center</strong><br>
                    <strong>${nearest.center.name}</strong><br>
                    📍 ${nearest.center.address}<br>
                    <span class="distance">📏 Distance: ${nearestDist.toFixed(2)} km</span><br>
                    🚶 Estimated walk: ~${walkingMinutes} min
                `;
                infoEl.style.display = 'block';

                btn.disabled = false;
                btn.textContent = '📍 Find Nearest Evacuation Center';
            },
            (error) => {
                infoEl.textContent = `❌ GPS Error: ${error.message}. Please enable location access.`;
                infoEl.style.display = 'block';
                btn.disabled = false;
                btn.textContent = '📍 Find Nearest Evacuation Center';
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    });
}

// --- Haversine distance formula (km) ---
function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}