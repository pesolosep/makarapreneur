// lib/paymentService/semifinalPayment.ts
import { db } from '@/lib/firebase/firebase';
import { doc, updateDoc, getDoc, Timestamp } from 'firebase/firestore';
import { Team } from '@/models/Team';

// Xendit payment gateway types
interface XenditPaymentRequest {
  externalID: string;
  amount: number;
  payerEmail: string;
  description: string;
  shouldSendEmail?: boolean;
  successRedirectURL?: string;
  failureRedirectURL?: string;
  paymentMethods?: string[];
}

interface XenditPaymentResponse {
  id: string;
  externalID: string;
  status: 'PENDING' | 'PAID' | 'EXPIRED' | 'FAILED';
  paymentURL: string;
  amount: number;
  expiryDate: string;
}

interface XenditCallbackPayload {
  id: string;
  externalID: string;
  status: 'PAID' | 'EXPIRED' | 'FAILED';
  paidAmount: number;
  paidAt: string;
  paymentChannel: string;
  paymentMethod: string;
}

const SEMIFINAL_PAYMENT_AMOUNT = 500000; // IDR 500,000
const XENDIT_API_URL = process.env.NEXT_PUBLIC_XENDIT_API_URL || 'https://api.xendit.co';
const XENDIT_API_KEY = process.env.XENDIT_API_KEY || 'mock_key';

export const semifinalPaymentService = {

    async getPaymentStatus(teamId: string): Promise<{
        status: 'PENDING' | 'PAID' | 'EXPIRED' | 'FAILED';
        message?: string;
      }> {
        try {
          // Get team data
          const teamDoc = await getDoc(doc(db, 'teams', teamId));
          const team = teamDoc.data() as Team;
    
          if (!team) {
            throw new Error('Team not found');
          }
    
          // Get the payment details from the team's semifinal stage
          const paymentDetails = team.stages[2]?.paymentDetails;
    
          if (!paymentDetails) {
            return {
              status: 'PENDING',
              message: 'No payment initiated'
            };
          }
    
          // In production, you would make an API call to Xendit to get the latest status
          // For now, we'll use the stored status
          return {
            status: paymentDetails.status,
            message: paymentDetails.status === 'PAID' ? 
              `Payment completed on ${paymentDetails.paidAt?.toDate().toLocaleDateString()}` :
              undefined
          };
        } catch (error) {
          console.error('Error checking payment status:', error);
          throw error;
        }
      },
      
  // Create payment invoice for semifinal stage
  async createPayment(teamId: string): Promise<{
    success: boolean;
    paymentUrl?: string;
    error?: string;
  }> {
    try {
      // Get team data
      const teamDoc = await getDoc(doc(db, 'teams', teamId));
      const team = teamDoc.data() as Team;

      if (!team) {
        throw new Error('Team not found');
      }

      // Verify eligibility (must have cleared first stage)
      if (team.stages[1]?.status !== 'cleared') {
        throw new Error('Team must clear first stage before paying for semifinal');
      }

      // Check if payment already done
      if (team.stages[2]?.paidStatus) {
        throw new Error('Semifinal payment already completed');
      }

      // Create payment request for Xendit
      const paymentRequest: XenditPaymentRequest = {
        externalID: `SF-${teamId}-${Date.now()}`,
        amount: SEMIFINAL_PAYMENT_AMOUNT,
        payerEmail: team.teamLeader.email,
        description: `Semifinal Registration Fee - ${team.teamName}`,
        shouldSendEmail: true,
        successRedirectURL: `${window.location.origin}/dashboard/payment/success`,
        failureRedirectURL: `${window.location.origin}/dashboard/payment/failed`,
        paymentMethods: ['CREDIT_CARD', 'BCA', 'BRI', 'MANDIRI', 'BNI', 'PERMATA', 'OVO', 'DANA', 'GOPAY']
      };

      // Mock Xendit API call
      // In production, replace with actual Xendit API call
      const response = await this.mockXenditCreateInvoice(paymentRequest);

      // Store payment details in team document
      await updateDoc(doc(db, 'teams', teamId), {
        'stages.2.paymentDetails': {
          xenditInvoiceId: response.id,
          externalID: response.externalID,
          amount: response.amount,
          status: response.status,
          paymentURL: response.paymentURL,
          createdAt: Timestamp.fromDate(new Date()),
          expiryDate: Timestamp.fromDate(new Date(response.expiryDate))
        },
        updatedAt: Timestamp.fromDate(new Date())
      });

      return {
        success: true,
        paymentUrl: response.paymentURL
      };
    } catch (error) {
      console.error('Error creating semifinal payment:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create payment'
      };
    }
  },

  // Handle Xendit payment callback
  async handleCallback(payload: XenditCallbackPayload): Promise<boolean> {
    try {
      // Extract team ID from external ID
      const teamId = payload.externalID.split('-')[1];

      // Verify payment amount
      if (payload.status === 'PAID' && payload.paidAmount !== SEMIFINAL_PAYMENT_AMOUNT) {
        throw new Error('Invalid payment amount');
      }

      // Update team payment status
      await updateDoc(doc(db, 'teams', teamId), {
        'stages.2.paidStatus': payload.status === 'PAID',
        'stages.2.paymentDetails': {
          status: payload.status,
          paidAt: payload.status === 'PAID' ? Timestamp.fromDate(new Date(payload.paidAt)) : null,
          paymentChannel: payload.paymentChannel,
          paymentMethod: payload.paymentMethod,
          updatedAt: Timestamp.fromDate(new Date())
        },
        updatedAt: Timestamp.fromDate(new Date())
      });

      return true;
    } catch (error) {
      console.error('Error processing payment callback:', error);
      return false;
    }
  },

  // Mock Xendit API call (replace with actual API call in production)
  async mockXenditCreateInvoice(
    request: XenditPaymentRequest
  ): Promise<XenditPaymentResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      id: `xnd-inv-${Date.now()}`,
      externalID: request.externalID,
      status: 'PENDING',
      paymentURL: `https://mock-xendit-checkout.com/invoice/${request.externalID}`,
      amount: request.amount,
      expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
  }
};

// API route handler for Xendit callback
export async function handleXenditCallback(req: any, res: any) {
  try {
    const payload = req.body as XenditCallbackPayload;
    
    // Verify Xendit callback signature (implement in production)
    // const isValidCallback = verifyXenditCallback(req.headers, payload);
    // if (!isValidCallback) {
    //   return res.status(401).json({ error: 'Invalid callback signature' });
    // }

    const success = await semifinalPaymentService.handleCallback(payload);
    
    if (success) {
      res.status(200).json({ message: 'Payment processed successfully' });
    } else {
      res.status(400).json({ error: 'Failed to process payment' });
    }
  } catch (error) {
    console.error('Error handling Xendit callback:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}