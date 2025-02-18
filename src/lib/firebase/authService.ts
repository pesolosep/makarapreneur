
import { 
  auth, 
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  setPersistence,
  browserLocalPersistence,
  signOut
} from './firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { UserCredential } from 'firebase/auth';

// Setup persistence
export async function setupAuthPersistence() {
  try {
    await setPersistence(auth, browserLocalPersistence);
  } catch (error) {
    console.error('Persistence setup failed:', error);
    throw error;
  }
}

// Enhanced login function
export async function loginUser(email: string, password: string) {
  await setupAuthPersistence();
  
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists()) {
      throw new Error('User profile not found');
    }

    const userData = userDoc.data();

    // Verify email
    if (!user.emailVerified) {
      throw new Error('Please verify your email before logging in');
    }

    // Update last login
    await updateDoc(doc(db, 'users', user.uid), {
      lastLogin: new Date(),
    });

    return {
      user,
      isAdmin: userData.role === 'admin',
      message: 'Login successful'
    };
  } catch (error: any) {
    console.error('Login Error:', error);
    throw error;
  }
}

// Logout function
export async function logoutUser() {
  try {
    await signOut(auth);
    return { message: 'Logout successful' };
  } catch (error) {
    console.error('Logout Error:', error);
    throw error;
  }
}

// Your existing registerUser function with role
export async function registerUser(email: string, password: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Store user in Firestore with role
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email,
      role: 'user', // Default role
      verified: false,
      createdAt: new Date(),
      lastLogin: new Date()
    });

    await sendEmailVerification(user);

    return {
      user,
      message: 'Registration successful. Please verify your email.'
    };
  } catch (error: any) {
    console.error('Registration Error:', error);
    throw error;
  }
}

