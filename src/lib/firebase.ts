import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Cloudinary config - these should be set in .env file by user
export const cloudinaryConfig = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '',
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '',
  apiUrl: 'https://api.cloudinary.com/v1_1/'
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

// Firebase Security Rules (Copy these to your Firebase Console)
/*
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Function to check if user is admin
    function isAdmin() {
      return request.auth != null && request.auth.token.email == "tb123983@gmail.com";
    }
    
    // Allow reading projects by anyone, but only admin can write
    match /projects/{projectId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Allow reading blog posts by anyone, but only admin can write
    match /blogPosts/{postId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Only admin can read and write contacts
    match /contacts/{contactId} {
      allow read: if isAdmin();
      allow create: if true; // Anyone can submit a contact form
      allow update, delete: if isAdmin();
    }
    
    // Allow reading visit stats by admin only
    match /visits/{visitId} {
      allow read: if isAdmin();
      allow write: if isAdmin();
    }
  }
}
*/