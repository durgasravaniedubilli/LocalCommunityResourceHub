// Dummy Data for Resources
const resources = [
    {
        id: 1,
        name: "Downtown Food Pantry",
        category: "food",
        address: "125 Main St, City Center",
        phone: "(555) 123-0001",
        desc: "Provides emergency food boxes and hot meals every weekday from 11 AM to 2 PM.",
        lat: 40.7128,
        lng: -74.0060,
        icon: "fa-utensils"
    },
    {
        id: 2,
        name: "Safe Haven Shelter",
        category: "housing",
        address: "442 Oak Avenue, Westside",
        phone: "(555) 123-0002",
        desc: "Emergency overnight shelter for individuals and families. Intake begins at 4 PM daily.",
        lat: 40.7200,
        lng: -74.0100,
        icon: "fa-house-chimney"
    },
    {
        id: 3,
        name: "Community Health Clinic",
        category: "health",
        address: "890 Wellness Way, Eastside",
        phone: "(555) 123-0003",
        desc: "Free and low-cost medical and dental care. Walk-ins welcome for urgent needs.",
        lat: 40.7150,
        lng: -73.9950,
        icon: "fa-truck-medical"
    },
    {
        id: 4,
        name: "Future Builders Tutoring",
        category: "education",
        address: "200 Learning Blvd, Northside",
        phone: "(555) 123-0004",
        desc: "Free after-school tutoring for K-12 students. Adult literacy classes available on weekends.",
        lat: 40.7300,
        lng: -73.9900,
        icon: "fa-book-open"
    },
    {
        id: 5,
        name: "Neighborhood Soup Kitchen",
        category: "food",
        address: "55 Community Rd, Southside",
        phone: "(555) 123-0005",
        desc: "Hot dinner served daily at 6 PM. Everyone welcome, no questions asked.",
        lat: 40.7050,
        lng: -74.0150,
        icon: "fa-utensils"
    }
];

// Initialize Map
let map;
let markersLayer;

document.addEventListener('DOMContentLoaded', () => {
    initMap();
    renderResources(resources);
    setupFilters();
    setupForm();
});

function initMap() {
    // Center map around a dummy coordinate (New York City for example)
    map = L.map('map').setView([40.715, -74.000], 13);

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    markersLayer = L.layerGroup().addTo(map);

    // Add CSS fix to ensure map container respects sizes on mobile properly after init
    setTimeout(() => {
        map.invalidateSize();
    }, 100);

    // Add markers for all resources initially
    addMarkers(resources);
}

function addMarkers(data) {
    markersLayer.clearLayers();

    data.forEach(resource => {
        if(resource.lat && resource.lng) {
            const marker = L.marker([resource.lat, resource.lng]).addTo(markersLayer);
            
            // Custom Popup content
            const popupContent = `
                <div style="font-family: 'Inter', sans-serif;">
                    <h3 style="color: #482A41; margin-bottom: 5px; font-size: 1.1rem;">${resource.name}</h3>
                    <p style="margin: 0 0 5px 0; font-size: 0.9rem; color: #666;">
                        <i class="fa-solid ${resource.icon}" style="color: #572E54;"></i> ${resource.category.charAt(0).toUpperCase() + resource.category.slice(1)}
                    </p>
                    <p style="margin: 0; font-size: 0.85rem;">${resource.address}</p>
                </div>
            `;
            
            marker.bindPopup(popupContent);
        }
    });
}

function renderResources(data) {
    const grid = document.getElementById('resources-grid');
    grid.innerHTML = '';

    if (data.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #666;">No resources found matching your criteria.</p>';
        return;
    }

    data.forEach(resource => {
        const card = document.createElement('div');
        card.className = 'resource-card';
        
        card.innerHTML = `
            <div class="resource-card-header">
                <span class="resource-category">${resource.category}</span>
                <i class="fa-solid ${resource.icon} resource-icon"></i>
            </div>
            <div class="resource-card-body">
                <h3>${resource.name}</h3>
                <div class="resource-detail">
                    <i class="fa-solid fa-location-dot"></i>
                    <span>${resource.address}</span>
                </div>
                <div class="resource-detail">
                    <i class="fa-solid fa-phone"></i>
                    <span>${resource.phone || 'Not provided'}</span>
                </div>
                <p class="resource-desc">${resource.desc}</p>
            </div>
            <div class="resource-card-footer">
                <button class="btn secondary-btn" onclick="focusOnMap(${resource.lat}, ${resource.lng})">
                    View on Map
                </button>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

// Global function to center map from card click
window.focusOnMap = function(lat, lng) {
    if(map) {
        map.setView([lat, lng], 16);
        // Scroll to map section smoothly
        document.getElementById('map-section').scrollIntoView({ behavior: 'smooth' });
    }
};

function setupFilters() {
    const filterSelect = document.getElementById('category-filter');
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const categoryCards = document.querySelectorAll('.category-card');

    // Dropdown Filter
    filterSelect.addEventListener('change', (e) => {
        const category = e.target.value;
        filterData(category, searchInput.value);
    });

    // Search Bar Filter
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        filterData(filterSelect.value, searchInput.value);
        // Scroll to resources
        document.getElementById('resources').scrollIntoView({ behavior: 'smooth' });
    });

    // Category Quick Links
    categoryCards.forEach(card => {
        card.addEventListener('click', (e) => {
            const category = card.getAttribute('data-category');
            filterSelect.value = category;
            filterData(category, searchInput.value);
        });
    });
}

function filterData(category, searchTerm) {
    let filtered = resources;

    // Filter by Category
    if (category !== 'all') {
        filtered = filtered.filter(r => r.category === category);
    }

    // Filter by Search Term
    if (searchTerm.trim() !== '') {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(r => 
            r.name.toLowerCase().includes(term) || 
            r.desc.toLowerCase().includes(term) ||
            r.category.toLowerCase().includes(term) ||
            r.address.toLowerCase().includes(term)
        );
    }

    renderResources(filtered);
    addMarkers(filtered);
}

function setupForm() {
    const form = document.getElementById('resource-form');
    const successMsg = document.getElementById('form-success-message');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // In a real app, you would gather data here and send to a backend:
        // const newResource = {
        //     name: document.getElementById('org-name').value,
        //     ...
        // };
        
        // Simulating immediate feedback for the user
        form.style.display = 'none';
        successMsg.classList.remove('hidden');
        
        // Reset form for potential future use (though it's hidden now)
        form.reset();
        
        // Optional: Bring it back after some time
        setTimeout(() => {
            form.style.display = 'flex';
            successMsg.classList.add('hidden');
        }, 8000);
    });
}
