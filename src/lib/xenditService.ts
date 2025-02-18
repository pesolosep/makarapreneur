// lib/xenditService.ts
import { Xendit, Invoice as InvoiceClient } from 'xendit-node';
import { CreateInvoiceRequest } from 'xendit-node/invoice/models'
const x = new Xendit({
  secretKey: process.env.XENDIT_SECRET_KEY!,
});

const {  } = x;
const invoiceClient = new InvoiceClient({
    secretKey: process.env.XENDIT_SECRET_KEY!,
});

export interface CreateInvoiceParams {
  teamId: string;
  teamName: string;
  email: string;
  amount: number;
}

export const xenditService = {
  async createInvoice({
    teamId,
    teamName,
    email,
    amount,
  }: CreateInvoiceParams) {
    try {
      const externalId = `SF-${teamId}-${Date.now()}`; // SF for Semifinal
      const data :CreateInvoiceRequest ={
        externalId : externalId,
        amount:amount,
        payerEmail: email,
        description: `Semifinal Registration Fee - ${teamName}`,
        successRedirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/payment/success`,
        failureRedirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/payment/failed`,
        customer: {
          email,
          givenNames: teamName,
        },
        invoiceDuration: '86400', // 24 hours
        currency: 'IDR',
        reminderTime: 3600,
      }
      const invoice = await invoiceClient.createInvoice({
        data
      });

      return {
        success: true,
        invoiceUrl: invoice.invoiceUrl,
        externalId: invoice.externalId,
      };
    } catch (error) {
      console.error('Xendit invoice creation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create invoice',
      };
    }
  },
};