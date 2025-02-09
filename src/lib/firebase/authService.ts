import { 
  auth, 
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification
} from './firebase';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc 
} from 'firebase/firestore';
import { 
  UserCredential,
} from 'firebase/auth';

// Generate 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}


// Register User
export async function registerUser(email: string, password: string) {
  console.log('Auth instance:', auth);
  try {
    // Create user in Firebase Authentication
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth, 
      email, 
      password
    );
    const user = userCredential.user;

    // Generate OTP
    const otp = generateOTP();

    // Store user details in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email,
      verified: false,
      otp,
      otpExpiry: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      createdAt: new Date()
    });

    // Send email verification
    await sendEmailVerification(user);

    return {
      user,
      otp,
      message: 'Registration successful. Please verify your email and OTP.'
    };
  } catch (error: any) {
    console.error('Registration Error:', error);
    
    // Check for specific Firebase auth error codes
    if (error.code) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          throw new Error('Email is already registered');
        case 'auth/invalid-email':
          throw new Error('Invalid email format');
        case 'auth/weak-password':
          throw new Error('Password is too weak');
        default:
          throw new Error('Registration failed');
      }
    }
    throw error;
  }
}



export async function loginUser(email: string, password: string) {
  try {
    // Sign in with Firebase Authentication
    const userCredential = await signInWithEmailAndPassword(
      auth, 
      email, 
      password
    );
    const user = userCredential.user;

    // Check if user is verified in Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists()) {
      throw new Error('User profile not found');
    }

    const userData = userDoc.data();

    // Check email verification
    if (!user.emailVerified) {
      throw new Error('Please verify your email');
    }


    return {
      user,

      message: 'Login successful.'
    };
  } catch (error: any) {
    console.error('Login Error:', error);
    
    // Handle specific Firebase errors
    if (error.code) {
      switch (error.code) {
        case 'auth/user-not-found':
          throw new Error('No user found with this email');
        case 'auth/wrong-password':
          throw new Error('Incorrect password');
        case 'auth/too-many-requests':
          throw new Error('Too many login attempts. Please try again later.');
        default:
          throw new Error('Login failed');
      }
    }
    throw error;
  }
}

