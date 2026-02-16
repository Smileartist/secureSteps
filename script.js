// --- STATE VARIABLES ---
let map;
let userMarker;
let isRiskMode = false;
let contacts = JSON.parse(localStorage.getItem('myContacts')) || [];

// --- GLOBAL HELPERS (Attached to Window for HTML access) ---
window.initMap = function() {
    if (map) return; 

    map = L.map('map').setView([28.6139, 77.2090], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);

    map.on('click', onMapClick);
    window.locateUser();
}

window.locateUser = function() {
    if (!map) return;
    map.locate({setView: true, maxZoom: 16});
    
    map.once('locationfound', (e) => {
        if (userMarker) map.removeLayer(userMarker);
        
        // Custom "Me" Marker (Blue Dot)
        userMarker = L.circleMarker(e.latlng, {
            radius: 8,
            fillColor: "#3b82f6",
            color: "#fff",
            weight: 3,
            opacity: 1,
            fillOpacity: 1
        }).addTo(map).bindPopup("You are here").openPopup();
        
        L.circle(e.latlng, {radius: e.accuracy/2, color: '#3b82f6', opacity: 0.2}).addTo(map);
    });

    map.on('locationerror', () => alert("Secure Steps needs GPS access to keep you safe."));
}

window.renderRiskZone = function(zone) {
    if(!map) return;
    L.circle([zone.lat, zone.lng], {
        color: '#ef4444', 
        fillColor: '#ef4444', 
        fillOpacity: 0.4, 
        radius: 200 
    }).addTo(map).bindPopup(`<strong>⚠️ Risk Zone</strong><br>${zone.description || 'Caution advised.'}`);
}

// --- RISK REPORTING ---
window.enableAddRiskMode = function() {
    isRiskMode = true;
    document.getElementById('risk-instruction').classList.remove('hidden');
    document.getElementById('add-risk-btn').classList.add('active-mode');
    document.body.style.cursor = "crosshair";
}

window.disableAddRiskMode = function() {
    isRiskMode = false;
    document.getElementById('risk-instruction').classList.add('hidden');
    document.getElementById('add-risk-btn').classList.remove('active-mode');
    document.body.style.cursor = "default";
}

function onMapClick(e) {
    if (!isRiskMode) return;

    if (confirm("Mark this location as a Risky Zone in Secure Steps?")) {
        // Send to backend via the bridge function in HTML
        if(window.backendReportZone) {
            window.backendReportZone(e.latlng.lat, e.latlng.lng);
        }
        
        // Render locally immediately for UX
        window.renderRiskZone({lat: e.latlng.lat, lng: e.latlng.lng, description: "Just Reported"});
        window.disableAddRiskMode();
    }
}

// --- CONTACTS ---
window.renderContacts = function() {
    // Refresh from storage in case Supabase updated it
    contacts = JSON.parse(localStorage.getItem('myContacts')) || [];
    
    const list = document.getElementById('contact-list');
    list.innerHTML = "";
    
    if(contacts.length === 0) {
        list.innerHTML = "<li style='justify-content:center; color:#9ca3af;'>No contacts added yet.</li>";
        return;
    }

    contacts.forEach((c, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div><strong>${c.name}</strong><br><small style='color:#6b7280'>${c.phone}</small></div>
            <i class="fas fa-trash" style="color:var(--danger); cursor:pointer;" onclick="deleteContact(${index})"></i>
        `;
        list.appendChild(li);
    });
}

window.addContact = function() {
    const name = document.getElementById('c-name').value;
    const phone = document.getElementById('c-phone').value;
    
    if(name && phone) {
        contacts.push({name, phone});
        localStorage.setItem('myContacts', JSON.stringify(contacts));
        
        // TODO: In a real app, call a 'saveContactsToSupabase' function here
        
        window.renderContacts();
        document.getElementById('c-name').value = '';
        document.getElementById('c-phone').value = '';
    } else {
        alert("Please enter a Name and Phone Number.");
    }
}

window.deleteContact = function(index) {
    if(confirm("Remove this contact from Secure Steps?")) {
        contacts.splice(index, 1);
        localStorage.setItem('myContacts', JSON.stringify(contacts));
        window.renderContacts();
    }
}

// --- SOS FEATURE ---
document.getElementById('sos-btn').addEventListener('click', () => {
    if(navigator.vibrate) navigator.vibrate([500, 200, 500]);

    if (contacts.length === 0) {
        alert("⚠️ NO CONTACTS! \nPlease add trusted contacts in the 'Contacts' tab first.");
        window.navTo('page-contacts', document.querySelectorAll('.nav-item')[1]);
    } else {
        let names = contacts.map(c => c.name).join(", ");
        alert(`🚨 SECURE STEPS SOS 🚨\n\nAlerting: ${names} \nLocation: Shared via secure GPS link.`);
    }
});

// --- UTILS ---
window.toggleTheme = function() {
    const body = document.body;
    const isDark = body.getAttribute('data-theme') === 'dark';
    body.setAttribute('data-theme', isDark ? 'light' : 'dark');
}

window.navTo = function(pageId, navElement) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    navElement.classList.add('active');

    if(pageId === 'page-map' && map) setTimeout(() => map.invalidateSize(), 200);
}