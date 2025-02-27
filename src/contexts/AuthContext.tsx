// contexts/AuthContext.tsx
'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/firebase';

interface UserData {
  userId: string | null;
  isAdmin: boolean;
  email: string;
  verified: boolean;
  createdAt: Date;
  lastLogin: Date;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  userId: string | null;
  isAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  isAdmin: false,
  userId: null,
  loading: true
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Set up Firebase persistence
  useEffect(() => {
    const setupPersistence = async () => {
      try {
        await setPersistence(auth, browserLocalPersistence);
      } catch (error) {
        console.error('Error setting persistence:', error);
      }
    };
    setupPersistence();
  }, []);

  // Handle auth state changes and user data
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const initializeAuth = async () => {
      try {
        // Set up auth state listener
        unsubscribe = onAuthStateChanged(auth, async (user) => {
          setUser(user);
          
          if (user) {
            try {
              const userDoc = await getDoc(doc(db, 'users', user.uid));
              if (userDoc.exists()) {
                const data = userDoc.data();
                // Convert Firestore Timestamps to Dates
                const userData = {
                  ...data,
                  createdAt: data.createdAt?.toDate(),
                  lastLogin: data.lastLogin?.toDate()
                } as UserData;
                
                setUserData(userData);
              }
            } catch (error) {
              console.error('Error fetching user data:', error);
              setUserData(null);
            }
          } else {
            setUserData(null);
          }
          
          setLoading(false);
        });
      } catch (error) {
        console.error('Error initializing auth:', error);
        setLoading(false);
      }
    };

    initializeAuth();

    // Cleanup
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const isAdmin = userData?.isAdmin === true;
  const userId = user?.uid || null;
  const value = {
    user,
    userData,
    userId,
    isAdmin,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};