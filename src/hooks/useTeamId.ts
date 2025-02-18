// hooks/useTeamId.ts
import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';

export function useTeamId(competitionId: string) {
  const [teamId, setTeamId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamId = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user?.email) {
          setLoading(false);
          return;
        }

        // Query teams where team leader email matches current user
        const teamsRef = collection(db, 'teams');
        const q = query(
          teamsRef,
          where('competitionId', '==', competitionId),
          where('teamLeader.email', '==', user.email)
        );

        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setTeamId(querySnapshot.docs[0].id);
        }
      } catch (error) {
        console.error('Error fetching team ID:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamId();
  }, [competitionId]);

  return { teamId, loading };
}