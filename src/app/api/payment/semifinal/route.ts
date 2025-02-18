// src/app/api/payment/semifinal/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { xenditService } from '@/lib/xenditService';
import { db } from '@/lib/firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Team } from '@/models/Team';

const SEMIFINAL_FEE = 500000; // IDR 500,000

export async function POST(request: NextRequest) {
  try {
    const { teamId } = await request.json();

    // Get team data
    const teamDoc = await getDoc(doc(db, 'teams', teamId));
    const team = teamDoc.data() as Team;

    if (!team) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      );
    }

    // Check eligibility
    if (team.stages[1]?.status !== 'cleared') {
      return NextResponse.json(
        { error: 'Team must clear first stage before proceeding to semifinal' },
        { status: 400 }
      );
    }

    // Create Xendit invoice
    const result = await xenditService.createInvoice({
      teamId,
      teamName: team.teamName,
      email: team.teamLeader.email,
      amount: SEMIFINAL_FEE,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      invoiceUrl: result.invoiceUrl,
      externalId: result.externalId,
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
