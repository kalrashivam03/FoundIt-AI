// --------------------------------
// Google Vision API Functions
// --------------------------------

// Convert file to base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            // Remove the data:image/jpeg;base64, prefix
            const base64 = reader.result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = error => reject(error);
    });
}

// Analyze image using Google Vision API
async function analyzeImageWithVision(imageFile) {
    try {
        const base64Image = await fileToBase64(imageFile);

        const requestBody = {
            requests: [{
                image: {
                    content: base64Image
                },
                features: [
                    {
                        type: 'LABEL_DETECTION',
                        maxResults: 10
                    },
                    {
                        type: 'OBJECT_LOCALIZATION',
                        maxResults: 5
                    },
                    {
                        type: 'TEXT_DETECTION',
                        maxResults: 5
                    }
                ]
            }]
        };

        const response = await fetch(GOOGLE_VISION_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        return processVisionResponse(data);
    } catch (error) {
        console.error('Vision API Error:', error);
        // Return mock data for demo purposes
        return getMockVisionData();
    }
}

// Process Google Vision API response
function processVisionResponse(data) {
    const response = data.responses[0];
    const labels = response.labelAnnotations || [];
    const objects = response.localizedObjectAnnotations || [];
    const texts = response.textAnnotations || [];

    const analysis = {
        labels: labels.map(label => ({
            description: label.description,
            score: Math.round(label.score * 100)
        })),
        objects: objects.map(obj => ({
            name: obj.name,
            score: Math.round(obj.score * 100)
        })),
        text: texts.length > 0 ? texts[0].description : '',
        suggestedCategory: suggestCategory(labels, objects),
        autoDescription: generateAutoDescription(labels, objects, texts)
    };

    return analysis;
}

// Mock data for demo when API is not available
function getMockVisionData() {
    return {
        labels: [
            { description: 'electronic device', score: 95 },
            { description: 'smartphone', score: 88 },
            { description: 'mobile phone', score: 82 }
        ],
        objects: [
            { name: 'Mobile phone', score: 90 }
        ],
        text: '',
        suggestedCategory: 'Electronics',
        autoDescription: 'A mobile phone/smartphone electronic device'
    };
}

// Suggest category based on detected labels and objects
function suggestCategory(labels, objects) {
    const categories = {
        'Electronics': ['electronic', 'phone', 'computer', 'laptop', 'tablet', 'charger', 'headphones'],
        'Clothing': ['shirt', 'jacket', 'pants', 'shoes', 'hat', 'bag', 'wallet'],
        'Accessories': ['watch', 'jewelry', 'glasses', 'key', 'umbrella'],
        'Documents': ['book', 'notebook', 'card', 'id', 'passport'],
        'Other': []
    };

    const allKeywords = [...labels.map(l => l.description.toLowerCase()), ...objects.map(o => o.name.toLowerCase())];

    for (const [category, keywords] of Object.entries(categories)) {
        if (keywords.some(keyword => allKeywords.some(item => item.includes(keyword)))) {
            return category;
        }
    }

    return 'Other';
}

// Generate automatic description
function generateAutoDescription(labels, objects, texts) {
    const topLabels = labels.slice(0, 3).map(l => l.description);
    const topObjects = objects.slice(0, 2).map(o => o.name);

    let description = [...new Set([...topObjects, ...topLabels])].join(', ');

    if (texts.length > 0 && texts[0].description) {
        description += ` (Text: ${texts[0].description.substring(0, 50)}...)`;
    }

    return description || 'Item detected by AI';
}

// Page Detection
function detectPage() {
    const pageId = document.body.id;

    switch (pageId) {
        case "homePage":
            initHomePage();
            break;

        case "lostPage":
            initLostPage();
            break;

        case "foundPage":
            initFoundPage();
            break;

        case "galleryPage":
            initGalleryPage();
            break;

        case "itemDetailPage":
            initItemDetailPage();
            break;

        case "matchDetailPage":
            initMatchDetailPage();
            break;

        case "signinPage":
            initSignInPage();
            break;

        case "signupPage":
            initSignUpPage();
            break;

        default:
            console.log("No specific JS for this page");
    }
}

// --------------------------------
// Home Page Logic
// --------------------------------
function initHomePage() {
    console.log("Home page logic initialized");
}

// --------------------------------
// Lost Item Page Logic
// --------------------------------
function initLostPage() {
    console.log("Lost item page logic initialized");

    const form = document.getElementById('lostForm');
    const imageInput = document.getElementById('itemImage');
    const imagePreview = document.getElementById('imagePreview');

    if (form) {
        form.addEventListener('submit', handleLostFormSubmit);
    }

    if (imageInput) {
        imageInput.addEventListener('change', (e) => handleImageUpload(e, imagePreview));
    }
}

async function handleImageUpload(event, previewElement) {
    const file = event.target.files[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
        previewElement.innerHTML = `<img src="${e.target.result}" alt="Item preview">`;
        previewElement.style.display = 'block';
    };
    reader.readAsDataURL(file);

    // Analyze with Vision API
    try {
        const analysis = await analyzeImageWithVision(file);
        populateFormWithAnalysis(analysis);
        showAnalysisResults(analysis);
    } catch (error) {
        console.error('Image analysis failed:', error);
        alert('Image analysis failed. You can still fill the form manually.');
    }
}

function populateFormWithAnalysis(analysis) {
    // Auto-fill description if empty
    const descriptionField = document.getElementById('description');
    if (!descriptionField.value.trim()) {
        descriptionField.value = analysis.autoDescription;
    }

    // Auto-fill item name if empty
    const itemNameField = document.getElementById('itemName');
    if (!itemNameField.value.trim() && analysis.objects.length > 0) {
        itemNameField.value = analysis.objects[0].name;
    }
}

function showAnalysisResults(analysis) {
    const resultsDiv = document.createElement('div');
    resultsDiv.className = 'analysis-results';
    resultsDiv.innerHTML = `
        <h4>AI Analysis Results:</h4>
        <p><strong>Detected Objects:</strong> ${analysis.objects.map(o => o.name).join(', ')}</p>
        <p><strong>Labels:</strong> ${analysis.labels.slice(0, 5).map(l => l.description).join(', ')}</p>
        <p><strong>Suggested Category:</strong> ${analysis.suggestedCategory}</p>
        ${analysis.text ? `<p><strong>Detected Text:</strong> ${analysis.text}</p>` : ''}
    `;

    // Remove existing results
    const existing = document.querySelector('.analysis-results');
    if (existing) existing.remove();

    // Add new results
    const form = document.querySelector('.auth-form');
    form.insertBefore(resultsDiv, form.lastElementChild);
}

function handleLostFormSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const imageFile = formData.get('itemImage');

    const lostItem = {
        id: Date.now(),
        type: 'lost',
        itemName: formData.get('itemName'),
        description: formData.get('description'),
        location: formData.get('location'),
        date: formData.get('lostDate'),
        contact: formData.get('contact'),
        image: imageFile ? URL.createObjectURL(imageFile) : null,
        timestamp: new Date().toISOString()
    };

    // Save to localStorage
    const lostItems = getData('lostItems') || [];
    lostItems.push(lostItem);
    saveData('lostItems', lostItems);

    alert('Lost item reported successfully! AI analysis will help match your item.');
    event.target.reset();

    // Clear preview
    document.getElementById('imagePreview').style.display = 'none';
    const results = document.querySelector('.analysis-results');
    if (results) results.remove();

    // Check for immediate matches
    checkForMatches();
}

// --------------------------------
// Found Item Page Logic
// --------------------------------
function initFoundPage() {
    console.log("Found item page logic initialized");

    const form = document.getElementById('foundForm');
    const imageInput = document.getElementById('itemImage');
    const imagePreview = document.getElementById('imagePreview');

    if (form) {
        form.addEventListener('submit', handleFoundFormSubmit);
    }

    if (imageInput) {
        imageInput.addEventListener('change', (e) => handleImageUpload(e, imagePreview));
    }
}

async function handleFoundFormSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target); // contains text + file

    try {
        const response = await fetch('http://localhost:5000/api/items/found', {
            method: 'POST',
            body: formData, // send the actual FormData
            // NOTE: Do NOT set Content-Type header manually; browser sets multipart/form-data automatically
        });

        const result = await response.json();
        if(result.success) {
            alert('Found item reported successfully!');
            console.log('Matches:', result.matches);
            event.target.reset();
            const results = document.querySelector('.analysis-results');
            if (results) results.remove();
            document.getElementById('imagePreview').style.display = 'none';
        } else {
            alert('Error reporting item: ' + result.error);
        }
    } catch (err) {
        console.error(err);
        alert('Server error: ' + err.message);
    }
}


// --------------------------------
// Sign In Page Logic
// --------------------------------
function initSignInPage() {
    console.log("Sign in page logic initialized");

    const form = document.getElementById('signinForm');
    if (form) {
        form.addEventListener('submit', handleSignIn);
    }
}

function handleSignIn(event) {
    event.preventDefault();
    // Basic demo - in real app, this would authenticate with backend
    const username = event.target.username.value;
    const password = event.target.password.value;

    if (username && password) {
        alert('Sign in successful! (Demo)');
        // Redirect to home or dashboard
        window.location.href = 'home.html';
    } else {
        alert('Please enter username and password');
    }
}

// --------------------------------
// Gallery Page Logic
// --------------------------------
function initGalleryPage() {
    console.log("Gallery page logic initialized");
    loadGalleryItems();
}

function loadGalleryItems() {
    const foundItems = getData('foundItems') || [];
    const galleryGrid = document.getElementById('galleryGrid');
    const galleryEmpty = document.getElementById('galleryEmpty');

    if (foundItems.length === 0) {
        galleryEmpty.style.display = 'block';
        galleryGrid.style.display = 'none';
        return;
    }

    galleryEmpty.style.display = 'none';
    galleryGrid.style.display = 'grid';
    galleryGrid.innerHTML = '';

    foundItems.forEach(item => {
        const itemElement = createGalleryItem(item);
        galleryGrid.appendChild(itemElement);
    });
}

function createGalleryItem(item) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'gallery-item';
    itemDiv.onclick = () => viewItemDetails(item.id);

    const imageHtml = item.image
        ? `<img src="${item.image}" alt="${item.itemName}">`
        : '<div style="font-size: 3rem;">📦</div>';

    itemDiv.innerHTML = `
        <div class="gallery-item-image">
            ${imageHtml}
        </div>
        <div class="gallery-item-content">
            <div class="gallery-item-title">${item.itemName}</div>
            <div class="gallery-item-description">${item.description}</div>
            <div class="gallery-item-meta">
                <span>Found: ${formatDate(item.date)}</span>
                <span>${item.location}</span>
            </div>
        </div>
    `;

    return itemDiv;
}

function viewItemDetails(itemId) {
    window.location.href = `item-detail.html?id=${itemId}`;
}

// --------------------------------
// Item Detail Page Logic
// --------------------------------
function initItemDetailPage() {
    console.log("Item detail page logic initialized");
    loadItemDetails();
}

function loadItemDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const itemId = urlParams.get('id');

    if (!itemId) {
        showItemNotFound();
        return;
    }

    const foundItems = getData('foundItems') || [];
    const item = foundItems.find(item => item.id == itemId);

    if (!item) {
        showItemNotFound();
        return;
    }

    displayItemDetails(item);
}

function displayItemDetails(item) {
    const container = document.getElementById('itemDetailContainer');

    const imageHtml = item.image
        ? `<img src="${item.image}" alt="${item.itemName}">`
        : '<div style="font-size: 4rem;">📦</div>';

    container.innerHTML = `
        <div class="item-detail-card">
            <div class="item-detail-image">
                ${imageHtml}
            </div>
            <div class="item-detail-content">
                <h1 class="item-detail-title">${item.itemName}</h1>
                <p class="item-detail-description">${item.description}</p>

                <div class="item-detail-grid">
                    <div class="detail-item">
                        <h4>Location Found</h4>
                        <p>${item.location}</p>
                    </div>
                    <div class="detail-item">
                        <h4>Date Found</h4>
                        <p>${formatDate(item.date)}</p>
                    </div>
                    <div class="detail-item">
                        <h4>Contact Information</h4>
                        <p>${item.contact}</p>
                    </div>
                    <div class="detail-item">
                        <h4>Report Date</h4>
                        <p>${formatDate(item.timestamp)}</p>
                    </div>
                </div>

                <div class="item-detail-actions">
                    <a href="tel:${item.contact}" class="btn-success">📞 Contact Finder</a>
                    <a href="gallery.html" class="btn-secondary">⬅️ Back to Gallery</a>
                    <a href="lost.html" class="btn-primary">Report Lost Item</a>
                </div>
            </div>
        </div>
    `;
}

function showItemNotFound() {
    const container = document.getElementById('itemDetailContainer');
    container.innerHTML = `
        <div class="item-detail-card">
            <div class="item-detail-content" style="text-align: center; padding: 4rem 2rem;">
                <h1 style="color: #ef4444; margin-bottom: 1rem;">Item Not Found</h1>
                <p style="color: #6b7280; margin-bottom: 2rem;">The item you're looking for doesn't exist or may have been removed.</p>
                <a href="gallery.html" class="btn-secondary">⬅️ Back to Gallery</a>
            </div>
        </div>
    `;
}

// --------------------------------
// Match Detail Page Logic
// --------------------------------
function initMatchDetailPage() {
    console.log("Match detail page logic initialized");
    loadMatchDetails();
}

function loadMatchDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const notificationId = urlParams.get('id');

    if (!notificationId) {
        showMatchNotFound();
        return;
    }

    const notifications = getData('notifications') || [];
    const notification = notifications.find(n => n.id == notificationId);

    if (!notification) {
        showMatchNotFound();
        return;
    }

    displayMatchDetails(notification);
}

function displayMatchDetails(notification) {
    const container = document.getElementById('matchDetailContainer');

    const lostItem = notification.lostItem;
    const foundItem = notification.foundItem;

    const lostImageHtml = lostItem.image
        ? `<img src="${lostItem.image}" alt="${lostItem.itemName}">`
        : '<div style="font-size: 4rem;">📦</div>';

    const foundImageHtml = foundItem.image
        ? `<img src="${foundItem.image}" alt="${foundItem.itemName}">`
        : '<div style="font-size: 4rem;">🔍</div>';

    container.innerHTML = `
        <div class="match-detail-header">
            <h1>Potential Match Found!</h1>
            <p>We've found a potential match for your lost item. Please review the details below and contact the finder to arrange pickup.</p>
        </div>

        <div class="match-detail-cards">
            <div class="match-item-card">
                <h2>Your Lost Item</h2>
                <div class="item-detail-image">
                    ${lostImageHtml}
                </div>
                <div class="item-detail-content">
                    <h3>${lostItem.itemName}</h3>
                    <p>${lostItem.description}</p>
                    <div class="item-detail-grid">
                        <div class="detail-item">
                            <h4>Location Lost</h4>
                            <p>${lostItem.location}</p>
                        </div>
                        <div class="detail-item">
                            <h4>Date Lost</h4>
                            <p>${formatDate(lostItem.date)}</p>
                        </div>
                        <div class="detail-item">
                            <h4>Your Contact</h4>
                            <p>${lostItem.contact}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="match-item-card">
                <h2>Found Item Match</h2>
                <div class="item-detail-image">
                    ${foundImageHtml}
                </div>
                <div class="item-detail-content">
                    <h3>${foundItem.itemName}</h3>
                    <p>${foundItem.description}</p>
                    <div class="item-detail-grid">
                        <div class="detail-item">
                            <h4>Location Found</h4>
                            <p>${foundItem.location}</p>
                        </div>
                        <div class="detail-item">
                            <h4>Date Found</h4>
                            <p>${formatDate(foundItem.date)}</p>
                        </div>
                        <div class="detail-item">
                            <h4>Finder's Contact</h4>
                            <p>${foundItem.contact}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="match-actions">
            <a href="tel:${foundItem.contact}" class="btn-success">📞 Contact Finder</a>
            <a href="mailto:${foundItem.contact}" class="btn-primary">✉️ Email Finder</a>
            <a href="home.html" class="btn-secondary">⬅️ Back to Home</a>
        </div>
    `;
}

function showMatchNotFound() {
    const container = document.getElementById('matchDetailContainer');
    container.innerHTML = `
        <div class="match-detail-header">
            <h1 style="color: #ef4444;">Match Not Found</h1>
            <p>The match you're looking for doesn't exist or may have been removed.</p>
            <a href="home.html" class="btn-secondary">⬅️ Back to Home</a>
        </div>
    `;
}

// Utility function to format dates
function formatDate(dateString) {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function handleSignUp(event) {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;
    const confirmPassword = event.target.confirmPassword.value;

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    if (email && password) {
        // Save user (demo)
        const users = getData('users') || [];
        users.push({ email, password });
        saveData('users', users);

        alert('Sign up successful! Please sign in.');
        window.location.href = 'signin.html';
    } else {
        alert('Please fill all fields');
    }
}

// --------------------------------
// Navigation (Used Everywhere)
// --------------------------------
function goTo(page) {
    window.location.href = page;
}

// --------------------------------
// Notification System
// --------------------------------

// Initialize notification system
function initNotifications() {
    // Check for matches and create notifications
    checkForMatches();

    // Set up notification button event listener
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationDropdown = document.getElementById('notificationDropdown');

    if (notificationBtn && notificationDropdown) {
        notificationBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            notificationDropdown.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!notificationBtn.contains(e.target) && !notificationDropdown.contains(e.target)) {
                notificationDropdown.classList.remove('show');
            }
        });
    }

    // Update notification display
    updateNotificationDisplay();

    // Initialize back button
    initBackButton();
}

// Initialize back button functionality
function initBackButton() {
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            // Try to go back in history, if not possible, go to home
            if (window.history.length > 1) {
                window.history.back();
            } else {
                // If no history, go to home page
                window.location.href = 'home.html';
            }
        });
    }
}

// Check for matches between lost and found items
function checkForMatches() {
    const lostItems = getData('lostItems') || [];
    const foundItems = getData('foundItems') || [];
    const notifications = getData('notifications') || [];

    console.log('Checking for matches:', { lostItems: lostItems.length, foundItems: foundItems.length });

    // Simple matching algorithm based on item name and description similarity
    lostItems.forEach(lostItem => {
        foundItems.forEach(foundItem => {
            if (isPotentialMatch(lostItem, foundItem)) {
                console.log('Match found:', lostItem.itemName, 'vs', foundItem.itemName);
                // Check if notification already exists
                const existingNotification = notifications.find(n =>
                    n.lostItemId === lostItem.id && n.foundItemId === foundItem.id
                );

                if (!existingNotification) {
                    createNotification(lostItem, foundItem);
                }
            }
        });
    });
}

// Simple matching algorithm
function isPotentialMatch(lostItem, foundItem) {
    // Check if items are similar based on name, description, and category
    const lostName = lostItem.itemName.toLowerCase();
    const foundName = foundItem.itemName.toLowerCase();
    const lostDesc = lostItem.description.toLowerCase();
    const foundDesc = foundItem.description.toLowerCase();

    // Exact name match
    if (lostName === foundName) return true;

    // Partial name match (at least 3 characters)
    if (lostName.length >= 3 && foundName.length >= 3) {
        if (lostName.includes(foundName) || foundName.includes(lostName)) return true;
    }

    // Description similarity (check for common keywords)
    const lostWords = lostDesc.split(' ');
    const foundWords = foundDesc.split(' ');
    const commonWords = lostWords.filter(word =>
        word.length > 3 && foundWords.includes(word)
    );

    return commonWords.length >= 2; // At least 2 common meaningful words
}

// Create a notification for a potential match
function createNotification(lostItem, foundItem) {
    const notification = {
        id: Date.now(),
        type: 'match',
        lostItemId: lostItem.id,
        foundItemId: foundItem.id,
        lostItem: lostItem,
        foundItem: foundItem,
        timestamp: new Date().toISOString(),
        read: false,
        message: `Potential match found for your ${lostItem.itemName}!`
    };

    const notifications = getData('notifications') || [];
    notifications.unshift(notification); // Add to beginning
    saveData('notifications', notifications);

    updateNotificationDisplay();
}

// Update notification display
function updateNotificationDisplay() {
    const notifications = getData('notifications') || [];
    const unreadCount = notifications.filter(n => !n.read).length;

    // Update badge
    const badge = document.getElementById('notificationBadge');
    if (badge) {
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? 'flex' : 'none';
    }

    // Update dropdown
    const dropdown = document.getElementById('notificationDropdown');
    if (dropdown) {
        const notificationList = dropdown.querySelector('.notification-empty') || dropdown;

        // Clear existing notifications
        const existingItems = dropdown.querySelectorAll('.notification-item');
        existingItems.forEach(item => item.remove());

        if (notifications.length === 0) {
            const emptyMsg = dropdown.querySelector('.notification-empty') || document.createElement('div');
            emptyMsg.className = 'notification-empty';
            emptyMsg.textContent = 'No notifications yet';
            if (!dropdown.contains(emptyMsg)) {
                dropdown.appendChild(emptyMsg);
            }
        } else {
            // Remove empty message if it exists
            const emptyMsg = dropdown.querySelector('.notification-empty');
            if (emptyMsg) emptyMsg.remove();

            // Add notification items
            notifications.slice(0, 10).forEach(notification => {
                const item = document.createElement('div');
                item.className = `notification-item ${notification.read ? '' : 'unread'}`;
                item.onclick = () => {
                    markAsRead(notification.id);
                    window.location.href = `match-detail.html?id=${notification.id}`;
                };

                item.innerHTML = `
                    <h4>${notification.message}</h4>
                    <p>Lost: ${notification.lostItem.itemName} | Found: ${notification.foundItem.itemName}</p>
                    <div class="notification-time">${formatTimeAgo(notification.timestamp)}</div>
                `;

                dropdown.appendChild(item);
            });
        }
    }
}

// Mark notification as read
function markAsRead(notificationId) {
    const notifications = getData('notifications') || [];
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
        notification.read = true;
        saveData('notifications', notifications);
        updateNotificationDisplay();
    }
}

// Format time ago
function formatTimeAgo(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now - time) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
}

// --------------------------------
// Temporary Data Storage (MVP)
// --------------------------------

// Sample data for testing
function populateSampleData() {
    // Only add if no data exists
    if (!getData('lostItems') || getData('lostItems').length === 0) {
        const sampleLostItems = [
            {
                id: Date.now() - 1000,
                itemName: "iPhone 12",
                description: "Black iPhone 12 with cracked screen",
                location: "Library",
                date: "2024-12-25",
                contact: "john@example.com",
                timestamp: new Date().toISOString(),
                image: null
            },
            {
                id: Date.now() - 2000,
                itemName: "Blue Backpack",
                description: "Blue Nike backpack with books inside",
                location: "Cafeteria",
                date: "2024-12-24",
                contact: "jane@example.com",
                timestamp: new Date().toISOString(),
                image: null
            }
        ];
        saveData('lostItems', sampleLostItems);
    }

    if (!getData('foundItems') || getData('foundItems').length === 0) {
        const sampleFoundItems = [
            {
                id: Date.now() - 1500,
                itemName: "iPhone 12 Pro",
                description: "Black iPhone found on the ground",
                location: "Library entrance",
                date: "2024-12-25",
                contact: "finder1@example.com",
                timestamp: new Date().toISOString(),
                image: null
            },
            {
                id: Date.now() - 2500,
                itemName: "Blue Backpack",
                description: "Blue backpack left at cafeteria table",
                location: "Cafeteria",
                date: "2024-12-24",
                contact: "finder2@example.com",
                timestamp: new Date().toISOString(),
                image: null
            }
        ];
        saveData('foundItems', sampleFoundItems);
    }
}

function saveData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function getData(key) {
    return JSON.parse(localStorage.getItem(key));
}

// Initialize everything when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    console.log("FoundIt AI loaded successfully");

    // Add sample data for testing (remove in production)
    populateSampleData();

    detectPage();
    initNotifications();
});
