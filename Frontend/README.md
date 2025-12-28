# FoundIt AI - Lost & Found Platform

A modern web application that uses AI-powered image recognition to help match lost and found items efficiently.

## Features

- 🖼️ **AI-Powered Image Recognition** using Google Vision API
- 📱 **Responsive Design** for all devices
- 🔍 **Smart Matching** with automatic categorization
- 🔔 **Real-time Notifications** for item matches
- ⬅️ **Back Navigation** with intuitive back buttons
- 🖼️ **Found Items Gallery** with detailed item views
- 💾 **Local Storage** for demo data persistence
- 🎨 **Professional UI/UX** with modern design
- 🎨 **Professional UI/UX** with modern design

## Setup Instructions

### 1. Google Vision API Setup

To enable AI image recognition, you need to set up Google Vision API:

1. **Create a Google Cloud Project**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one

2. **Enable Vision API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Cloud Vision API" and enable it

3. **Create API Key**:
   - Go to "APIs & Services" > "Credentials"
   - Create a new API key
   - Copy the API key

4. **Update the Code**:
   - Open `main.js`
   - Replace `'YOUR_API_KEY_HERE'` with your actual API key:
   ```javascript
   const GOOGLE_VISION_API_KEY = 'your_actual_api_key_here';
   ```

### 2. Running the Application

Simply open `home.html` in your web browser. No server required for the demo.

### 3. How It Works

1. **Upload an Image**: When reporting lost/found items, upload a photo
2. **AI Analysis**: Google Vision API analyzes the image for:
   - Object detection (phones, wallets, etc.)
   - Label detection (colors, materials, etc.)
   - Text recognition (if any text on the item)
3. **Auto-Fill**: The system suggests item names and descriptions
4. **Smart Matching**: AI helps match lost items with found items

## Notification System

The app includes a smart notification system that:

- **Automatic Matching**: Continuously checks for matches between lost and found items
- **Real-time Alerts**: Shows notification badge with unread count
- **Detailed Notifications**: Displays match details with timestamps
- **Smart Algorithm**: Matches based on item names, descriptions, and AI analysis
- **Mark as Read**: Users can mark notifications as read

### How Matching Works:
1. When a new item is reported (lost or found), the system checks against existing items
2. Matches are found based on:
   - Exact name matches
   - Partial name similarities
   - Common keywords in descriptions
   - AI-detected categories
3. Notifications are created and displayed immediately
4. Users get alerted with a bell icon and badge count

## Navigation

- **Back Button**: Available on all pages for easy navigation
- **Smart Back**: Uses browser history when available, falls back to home page
- **Consistent UI**: Back buttons styled to match the overall design theme

### Back Button Locations:
- **Main Pages** (Home, Lost, Found): Integrated in navbar
- **Auth Pages** (Sign In, Sign Up): Fixed position in top-left corner

## Gallery & Item Details

The app includes a comprehensive gallery system for browsing found items:

- **Gallery View**: Grid layout displaying all found items with images and basic info
- **Item Details**: Dedicated detail page showing complete item information
- **Contact Integration**: Direct phone links for contacting finders
- **Responsive Design**: Optimized for all screen sizes

### Gallery Features:
- Click any item card to view full details
- Image previews with fallback icons
- Location and date information
- Quick access to contact finder
- Easy navigation back to gallery

## API Features Used

- **LABEL_DETECTION**: Identifies objects and scenes
- **OBJECT_LOCALIZATION**: Detects specific objects with confidence scores
- **TEXT_DETECTION**: Extracts text from images (useful for branded items)

## Demo Mode

If the API key is not configured, the app falls back to mock data for demonstration purposes.

### Testing Notifications:
1. Report a lost item (e.g., "iPhone 12")
2. Report a found item with similar name (e.g., "iPhone 12 Pro")
3. Click the notification bell icon to see matches
4. The system will show potential matches automatically

## File Structure

```
Frontend/
├── home.html              # Landing page
├── gallery.html           # Found items gallery
├── item-detail.html       # Individual item details
├── lost.html              # Report lost item
├── found.html             # Report found item
├── signin.html            # Sign in form
├── signup.html            # Sign up form
├── styles.css             # Professional styling
├── main.js               # Application logic & AI integration
└── magnifying-glass-is-black-background_1186366-52229.avif  # Logo
```

## Technologies Used

- HTML5
- CSS3 (with Google Fonts)
- JavaScript (ES6+)
- Google Vision API
- Local Storage API

## Future Enhancements

- Backend integration for persistent storage
- Image similarity matching
- User authentication
- Notification system
- Mobile app version

## License

This project is for educational/hackathon purposes.