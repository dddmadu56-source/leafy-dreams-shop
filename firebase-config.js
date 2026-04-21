// ═══════════════════════════════════════════════════
// 🔥 LEAFY DREAMS — FIREBASE CONFIG
// ═══════════════════════════════════════════════════
// Step 1: Go to https://console.firebase.google.com
// Step 2: Your project → Settings (⚙️) → Your apps → Web (</>)
// Step 3: Copy the firebaseConfig object and REPLACE the one below
// ═══════════════════════════════════════════════════

const firebaseConfig = {
    apiKey: "AIzaSyCDPbYgDcKXuwvVN77zkHZ9egGlKI4DJ24",
    authDomain: "leafy-dreams.firebaseapp.com",
    databaseURL: "https://leafy-dreams-default-rtdb.firebaseio.com",
    projectId: "leafy-dreams",
    storageBucket: "leafy-dreams.firebasestorage.app",
    messagingSenderId: "754080429268",
    appId: "1:754080429268:web:3a21d88c3d4cd61e953741"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

console.log("🔥 Firebase connected — Leafy Dreams");
