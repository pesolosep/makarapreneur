'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface SemifinalPaymentButtonProps {
  teamId: string;
  disabled?: boolean;
}

export default function SemifinalPaymentButton({ 
  teamId, 
  disabled = false 
}: SemifinalPaymentButtonProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
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
      
      // Redirect to Xendit payment page
      window.location.href = data.invoiceUrl;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: error instanceof Error ? error.message : 'Failed to initiate payment',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handlePayment} 
      disabled={disabled || isLoading} 
      className="w-full"
    >
      {isLoading ? (
        <Loader2 className="w-6 h-6 mr-2" />
      ) : (
        'Proceed to Payment'
      )}
    </Button>
  );
}