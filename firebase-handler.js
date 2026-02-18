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
    updateDoc,
    arrayUnion,
    arrayRemove,
    onSnapshot,
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- PASTE YOUR CONFIG HERE ---
const firebaseConfig = {
  // ... your keys ...
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- AUTHENTICATION ---
export const loginUser = (email, pass) => signInWithEmailAndPassword(auth, email, pass);
export const registerUser = async (email, pass) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    // Create empty profile
    await setDoc(doc(db, "users", cred.user.uid), { email, contacts: [] });
    return cred.user;
};
export const logoutUser = () => signOut(auth);
export const monitorAuthState = (cb) => onAuthStateChanged(auth, cb);

// --- 1. CONTACTS MANAGEMENT ---
export async function addEmergencyContact(name, phone) {
    const user = auth.currentUser;
    if (!user) throw new Error("Must be logged in");
    
    // Use arrayUnion to add to the list without overwriting
    await updateDoc(doc(db, "users", user.uid), {
        contacts: arrayUnion({ name, phone })
    });
}

export async function removeEmergencyContact(contactObj) {
    const user = auth.currentUser;
    if (!user) return;
    await updateDoc(doc(db, "users", user.uid), {
        contacts: arrayRemove(contactObj)
    });
}

export async function getMyContacts() {
    const user = auth.currentUser;
    if (!user) return [];
    const docSnap = await getDoc(doc(db, "users", user.uid));
    return docSnap.exists() ? (docSnap.data().contacts || []) : [];
}

// --- 2. RED ZONES (Global Data) ---
export async function addRedZone(lat, lng, reason) {
    // Add to a global collection 'risk_zones'
    await addDoc(collection(db, "risk_zones"), {
        lat,
        lng,
        reason,
        reportedBy: auth.currentUser.uid,
        timestamp: serverTimestamp()
    });
}

// Real-time listener for Red Zones (Updates map automatically)
export function listenToRedZones(callback) {
    const q = collection(db, "risk_zones");
    return onSnapshot(q, (snapshot) => {
        const zones = [];
        snapshot.forEach(doc => zones.push({ id: doc.id, ...doc.data() }));
        callback(zones);
    });
}

// --- 3. ALERT LOGIC (SOS) ---
export async function triggerSOS(location) {
    const user = auth.currentUser;
    if (!user) return;

    // 1. Save Alert to DB (This triggers the "Notification" logic)
    const alertRef = await addDoc(collection(db, "active_alerts"), {
        uid: user.uid,
        email: user.email,
        location: location,
        status: "ACTIVE",
        timestamp: serverTimestamp()
    });

    // 2. Fetch contacts to show user who is being notified
    const contacts = await getMyContacts();
    return { alertId: alertRef.id, contacts };
}