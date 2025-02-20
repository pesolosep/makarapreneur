'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';

interface SemifinalPaymentButtonProps {
  teamId: string;
  disabled?: boolean;
  amount?: string;
}

export default function SemifinalPaymentButton({ 
  teamId, 
  disabled = false,
  amount = "Rp 150.000"
}: SemifinalPaymentButtonProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handlePayment = async () => {
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }

    try {
      setIsLoading(true);
      
      const response = await fetch('/api/payment/semifinal/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Payment initiation failed');
      }
      
      window.location.href = data.invoiceUrl;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: error instanceof Error ? error.message : 'Failed to initiate payment',
      });
      setShowConfirm(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  if (disabled) {
    return (
      <div className="w-full p-4 bg-signalBlack/5 rounded-lg border border-signalBlack/10">
        <div className="flex items-center gap-2 text-signalBlack/60">
          <AlertCircle className="w-5 h-5" />
          <span>Payment is not available at this time</span>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {!showConfirm ? (
        <motion.div
          key="initial"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="w-full"
        >
          <Button 
            onClick={handlePayment}
            className="w-full bg-juneBud hover:bg-juneBud/90 text-signalBlack group relative overflow-hidden py-6"
            disabled={isLoading}
          >
            <span className="flex items-center justify-center gap-2">
              <CreditCard className="w-5 h-5" />
              <span className="font-medium">Proceed to Payment</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </span>
          </Button>
        </motion.div>
      ) : (
        <motion.div
          key="confirm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="w-full space-y-4"
        >
          <div className="bg-juneBud/20 p-4 rounded-lg">
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-lg text-signalBlack">Confirm Payment</h3>
              <p className="text-signalBlack/70">You will be redirected to our payment gateway</p>
              <p className="text-2xl font-bold text-signalBlack">{amount}</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={handleCancel}
              variant="outline"
              className="flex-1 py-6"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePayment}
              className="flex-1 bg-juneBud hover:bg-juneBud/90 text-signalBlack py-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Confirm Payment
                </span>
              )}
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}