# Secure Steps

## Project Vision
Secure Steps is a personal safety application designed to empower users with tools to enhance their security in daily life. It provides features for real-time location sharing, reporting of dangerous areas, and immediate alerting of trusted contacts during emergencies. Our vision is to create a community-driven platform where individuals can walk with confidence, knowing they have a safety net.

## Features

*   **User Authentication:** Secure user registration and login functionalities powered by Firebase Authentication.
*   **Interactive Map:** An intuitive map interface, utilizing Leaflet.js, to display the user's current location.
*   **Risk Zone Reporting:** Users can identify and mark potentially dangerous areas on the map, providing reasons for caution. These zones are visible to all users in real-time, fostering a safer community.
*   **SOS Alerts:** A one-tap emergency button that records the user's current GPS location and sends immediate alerts to their pre-configured trusted contacts.
*   **Contact Management:** Users can easily add, view, and remove emergency contacts directly within the application.
*   **Theme Toggle:** Enhances user experience with the option to switch between light and dark visual themes.
*   **Real-time Data:** All critical safety data, including risk zones and alerts, are updated and reflected in real-time using Firebase Firestore.

## Workflow

1.  **User Authentication:** Users can securely register new accounts or log in using their email and password, managed by Firebase Authentication.
2.  **Interactive Map Display:** Upon successful authentication, users are directed to the main application interface featuring an interactive map, powered by Leaflet.js, which displays their current geographical location.
3.  **Risk Zone Management:**
    *   Users activate a "Risk Mode" from the map interface.
    *   By tapping on any location on the map, users can mark it as a dangerous area.
    *   A prompt allows users to specify a reason for marking the zone (e.g., "Poor lighting," "Frequent incidents").
    *   Once marked, these risk zones become immediately visible on the maps of all other Secure Steps users, contributing to collective awareness.
4.  **Contact Management:**
    *   Users navigate to a dedicated "My Circle" section.
    *   They can add new emergency contacts by providing a name and phone number.
    *   Existing contacts can be easily removed from their list.
5.  **SOS Activation:**
    *   In an emergency, users can press the prominent "SOS" button.
    *   The application automatically fetches and records the user's precise GPS location.
    *   An alert containing the user's location is then sent to all pre-saved emergency contacts (note: the current implementation saves the alert to Firestore; a complete notification system would involve server-side triggers for SMS/email).
6.  **Theme Switching:** Users can personalize their app experience by toggling between light and dark visual themes via the settings page.

## Technology Stack

*   **Frontend:**
    *   HTML5
    *   CSS3
    *   JavaScript (Vanilla JS)
    *   **Mapping Library:** Leaflet.js
    *   **Icons:** Font Awesome
*   **Backend/Database/Authentication:**
    *   Google Firebase (Firestore for real-time database, Firebase Authentication for user management).
*   **Server (for Static Files):**
    *   Node.js (used for serving frontend assets locally).