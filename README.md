# Meeting Room Booking App
This repository contains a web application for booking meeting rooms.
The application allows users to manage meeting rooms, create bookings, and collaborate with other users using role-based access control.
# Features
- User registration and authentication using Firebase Authentication (email/password)
- Persistent authentication state via Firebase-managed tokens
- Meeting rooms management
- Create, edit, and delete rooms
- Bookings
- Create bookings for a specific room and time range
- Edit and cancel bookings
- Time conflict validation (no overlapping bookings)
- Roles and permissions
- Admin: full control over rooms and bookings
- User: view rooms and create bookings
- Add room members by email with assigned role
- Cascade deletion of bookings when a room is deleted
- Access control enforced with Firestore Security Rules
- Reactive UI updates without page reload
# Technologies used
- TypeScript
- React
- Vite
- Tailwind CSS
- Firebase Authentication
- Cloud Firestore
- Zustand (state management)
# How to run the project
### Step 1: Clone the repository
```
git clone https://github.com/YanamiYokico/react_meeting-room-booking.git
```
### Step 2: Navigate into the project folder
```
cd react_meeting-room-booking
```
### Step 3: Install dependencies
```
npm install
```
### Step 4: Configure Firebase
Create a .env file in the root directory and add your Firebase configuration:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```
### Step 5: Run the project locally
```
npm run dev
```
