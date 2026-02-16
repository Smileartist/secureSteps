// firebase-handler.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    getDocs, 
    doc, 
    setDoc, 
    getDoc,
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- CONFIGURATION (REPLACE WITH YOUR KEYS) ---
const firebaseConfig = {
  apiKey: "AIzaSyDWYvlqzfmVDDVtmqumzIS5mN_77YFXI1A",
  authDomain: "steps-2fec8.firebaseapp.com",
  projectId: "steps-2fec8",
  storageBucket: "steps-2fec8.firebasestorage.app",
  messagingSenderId: "251576412084",
  appId: "1:251576412084:web:de06501986cc97a049b4e1",
  measurementId: "G-TQLBKWY1JV"
};

// Initialize
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- 1. AUTHENTICATION ---

export async function loginUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        // If user doesn't exist, try to register them automatically (Simplified flow)
        if(error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
            const register = confirm("User not found. Do you want to create a new account?");
            if(register) return registerUser(email, password);
        }
        alert("Login Error: " + error.message);
        throw error;
    }
}

export async function registerUser(email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Create user profile in Firestore
        await setDoc(doc(db, "users", userCredential.user.uid), {
            email: email,
            contacts: []
        });
        return userCredential.user;
    } catch (error) {
        alert("Registration Error: " + error.message);
        throw error;
    }
}

export async function logoutUser() {
    await signOut(auth);
    location.reload(); // Refresh to clear state
}

// --- 2. DATABASE (RISKY ZONES) ---

export async function addRiskyZone(lat, lng, description) {
    try {
        await addDoc(collection(db, "risky_zones"), {
            lat: lat,
            lng: lng,
            description: description,
            timestamp: serverTimestamp(),
            reportedBy: auth.currentUser ? auth.currentUser.uid : 'anon'
        });
        console.log("Risk Zone Saved to Firestore");
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

export async function getRiskyZones() {
    const querySnapshot = await getDocs(collection(db, "risky_zones"));
    let zones = [];
    querySnapshot.forEach((doc) => {
        zones.push(doc.data());
    });
    return zones;
}

// --- 3. DATABASE (USER CONTACTS) ---

export async function saveContactsToCloud(contacts) {
    const user = auth.currentUser;
    if(!user) return;
    
    await setDoc(doc(db, "users", user.uid), {
        contacts: contacts
    }, { merge: true }); // Merge ensures we don't overwrite other profile data
}

export async function getUserProfile() {
    const user = auth.currentUser;
    if(!user) return null;

    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        return null;
    }
}

// --- 4. STATE LISTENER ---
export function monitorAuthState(callback) {
    onAuthStateChanged(auth, callback);
}