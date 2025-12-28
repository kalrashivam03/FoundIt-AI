// ================================
// FoundIt AI - Global JavaScript
// ================================

// Runs after every page loads
document.addEventListener("DOMContentLoaded", () => {
    console.log("FoundIt AI loaded successfully");

    detectPage();
});
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
}

// --------------------------------
// Found Item Page Logic
// --------------------------------
function initFoundPage() {
    console.log("Found item page logic initialized");
}

// --------------------------------
// Sign In Page Logic
// --------------------------------
function initSignInPage() {
    console.log("Sign in page logic initialized");
}

// --------------------------------
// Sign Up Page Logic
// --------------------------------
function initSignUpPage() {
    console.log("Sign up page logic initialized");
}

// --------------------------------
// Navigation (Used Everywhere)
// --------------------------------
function goTo(page) {
    window.location.href = page;
}

// --------------------------------
// Temporary Data Storage (MVP)
// --------------------------------
function saveData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function getData(key) {
    return JSON.parse(localStorage.getItem(key));
}
