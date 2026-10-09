// js/sos.js
import { supabase } from './supabase.js';

const sosBtn = document.getElementById('sos-btn');
const sosModal = document.getElementById('sos-modal');
const sosCancel = document.getElementById('sos-cancel');
const sosConfirm = document.getElementById('sos-confirm');
const sosStatus = document.getElementById('sos-status');

let userLocation = null;
let watchId = null;

// --- Open SOS Modal & Start GPS Tracking ---
sosBtn.addEventListener('click', () => {
    sosModal.style.display = 'flex';
    sosStatus.textContent = '📡 Getting your GPS location...';
    sosConfirm.disabled = true;

    if (!navigator.geolocation) {
        sosStatus.textContent = '❌ Geolocation is not supported by your browser.';
        return;
    }

    // Watch position for continuous updates
    watchId = navigator.geolocation.watchPosition(
        (position) => {
            userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            sosStatus.textContent = `✅ Location locked: ${userLocation.lat.toFixed(5)}, ${userLocation.lng.toFixed(5)}`;
            sosConfirm.disabled = false;
        },
        (error) => {
            sosStatus.textContent = `❌ GPS Error: ${error.message}. Please enable location access.`;
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
});

// --- Cancel SOS ---
sosCancel.addEventListener('click', () => {
    sosModal.style.display = 'none';
    if (watchId) navigator.geolocation.clearWatch(watchId);
    watchId = null;
    userLocation = null;
});

// --- Confirm SOS & Send Alert ---
sosConfirm.addEventListener('click', async () => {
    if (!userLocation) return;

    sosConfirm.disabled = true;
    sosConfirm.textContent = 'Sending...';

    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error('You must be logged in to send an SOS.');

        const { error } = await supabase.from('sos_alerts').insert({
            user_id: session.user.id,
            location: `POINT(${userLocation.lng} ${userLocation.lat})`,
            status: 'active'
        });

        if (error) throw error;

        sosStatus.textContent = '🚨 SOS SENT! Responders have been alerted to your location.';
        sosStatus.style.color = '#2e7d32';
        
        // Clear the watch after successful send
        if (watchId) navigator.geolocation.clearWatch(watchId);
        
        // Auto-close after 5 seconds
        setTimeout(() => {
            sosModal.style.display = 'none';
            sosStatus.style.color = '';
        }, 5000);

    } catch (error) {
        sosStatus.textContent = `❌ Error: ${error.message}`;
        sosConfirm.disabled = false;
        sosConfirm.textContent = '🆘 SEND SOS NOW';
    }
});