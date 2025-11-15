
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import OtpInput from 'react-otp-input';
import { Loader2, ShieldCheck } from 'lucide-react';

const ADMIN_PHONE_NUMBER = '+233596352632';

export default function AdminLoginPage() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  const { toast } = useToast();
  const auth = useAuth();
  const router = useRouter();

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {},
      });
    }
  };

  const onSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setupRecaptcha();

    const appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, ADMIN_PHONE_NUMBER, appVerifier)
      .then((result) => {
        setConfirmationResult(result);
        setLoading(false);
        setShowOTP(true);
        toast({ title: 'OTP Sent', description: 'Please check your phone for the verification code.' });
      })
      .catch((error) => {
        console.error('SMS not sent error', error);
        toast({
          variant: 'destructive',
          title: 'Failed to Send OTP',
          description: 'There was an error sending the verification code. Please try again.',
        });
        setLoading(false);
      });
  };

  const onOTPVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!confirmationResult) {
      setLoading(false);
      return;
    }

    confirmationResult.confirm(otp)
      .then(async (result) => {
        setLoading(false);
        toast({ title: 'Success', description: 'Admin verification successful.' });
        router.push('/admin');
      })
      .catch((error) => {
        console.error('OTP verification error', error);
        toast({
          variant: 'destructive',
          title: 'OTP Verification Failed',
          description: 'The code you entered is incorrect. Please try again.',
        });
        setLoading(false);
      });
  };

  return (
    <Card className="w-full bg-card/70 backdrop-blur-xl border-white/20 shadow-2xl text-white">
      <div id="recaptcha-container"></div>
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
            <ShieldCheck className="h-12 w-12 text-primary" />
        </div>
        <CardTitle className="font-headline text-3xl">Admin Verification</CardTitle>
        <CardDescription className="text-slate-300">
            {showOTP ? 'Enter the code sent to your phone.' : 'A security code will be sent to the registered admin phone number.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!showOTP ? (
          <form onSubmit={onSignInSubmit}>
            <Button type="submit" className="w-full h-12 text-lg" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send Verification Code
            </Button>
          </form>
        ) : (
          <form onSubmit={onOTPVerify} className="space-y-6">
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderSeparator={<span className="mx-1">-</span>}
              renderInput={(props) => <Input {...props} />}
              containerStyle="flex justify-center"
              inputStyle="!w-12 h-12 text-lg text-center"
            />
            <Button type="submit" className="w-full h-12 text-lg" disabled={loading || otp.length < 6}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify & Sign In
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

// Extend the Window interface to include the recaptcha verifier
declare global {
    interface Window {
        recaptchaVerifier: RecaptchaVerifier;
    }
}
