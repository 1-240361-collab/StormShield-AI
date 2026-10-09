// js/incidents.js
import { supabase } from './supabase.js';

// --- Auth Guard ---
const { data: { session } } = await supabase.auth.getSession();
if (!session) window.location.href = 'index.html';

// --- Map Setup ---
let selectedLocation = null;
const map = L.map('report-map').setView([14.5995, 120.9842], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

let marker = null;
map.on('click', (e) => {
    const { lat, lng } = e.latlng;
    selectedLocation = { lat, lng };
    
    if (marker) map.removeLayer(marker);
    marker = L.marker([lat, lng]).addTo(map);
    
    document.getElementById('location-status').textContent = 
        `✅ Location set: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
});

// --- Photo Preview ---
document.getElementById('photo').addEventListener('change', (e) => {
    const file = e.target.files[0];
    const preview = document.getElementById('photo-preview');
    preview.innerHTML = '';
    if (file) {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        preview.appendChild(img);
    }
});

// --- Form Submission ---
document.getElementById('report-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submit-report');
    const errorEl = document.getElementById('report-error');
    const successEl = document.getElementById('report-success');
    
    errorEl.textContent = '';
    successEl.textContent = '';
    
    const type = document.getElementById('type').value;
    const description = document.getElementById('description').value;
    const photoFile = document.getElementById('photo').files[0];

    // Validation
    if (!type) return errorEl.textContent = 'Please select an incident type.';
    if (!selectedLocation) return errorEl.textContent = 'Please pin your location on the map.';

    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    try {
        let imageUrl = null;

        // 1. Upload photo if provided
        if (photoFile) {
            const fileName = `${Date.now()}-${photoFile.name}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('incident-photos')
                .upload(fileName, photoFile);
            
            if (uploadError) throw uploadError;
            
            const { data: urlData } = supabase.storage
                .from('incident-photos')
                .getPublicUrl(fileName);
            imageUrl = urlData.publicUrl;
        }

        // 2. Insert incident into database
        const { error: insertError } = await supabase
            .from('incidents')
            .insert({
                user_id: session.user.id,
                type: type,
                description: description,
                image_url: imageUrl,
                // PostGIS expects WKT format for geography(point)
                location: `POINT(${selectedLocation.lng} ${selectedLocation.lat})`,
                status: 'pending',
                severity: 1
            });

        if (insertError) throw insertError;

        successEl.textContent = '✅ Report submitted successfully! Responders have been notified.';
        
        // Reset form
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);

    } catch (error) {
        errorEl.textContent = `Error: ${error.message}`;
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Report';
    }
});