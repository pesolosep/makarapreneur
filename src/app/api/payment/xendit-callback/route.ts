
// src/app/api/payment/callback/xendit/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { db } from '@/lib/firebase/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const headersList = await headers();
    const callback_token = headersList.get('x-callback-token');

    // Verify Xendit callback token
    if (callback_token !== process.env.XENDIT_CALLBACK_TOKEN) {
      return NextResponse.json(
        { error: 'Invalid callback token' },
        { status: 401 }
      );
    }

    const payload = await request.json();
    
    // Extract team ID from external_id (format: SF-{teamId}-{timestamp})
    const teamId = payload.external_id.split('-')[1];

    // Update team's payment status
    if (payload.status === 'PAID') {
      await updateDoc(doc(db, 'teams', teamId), {
        'stages.2.paidStatus': true,
        updatedAt: new Date(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Callback processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}