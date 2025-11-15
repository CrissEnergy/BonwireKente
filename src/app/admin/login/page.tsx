
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Shield, Phone, KeyRound, Loader2, LogIn } from 'lucide-react';
import { useAuth } from '@/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import OtpInput from 'react-otp-input';

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
  }
}

export default function AdminLoginPage() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-image');
  const auth = useAuth();
  const { toast } = useToast();

  const [phoneNumber, setPhoneNumber] = useState('+233596352632');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);

  const setupRecaptcha = () => {
    if (!auth) return;
    if (window.recaptchaVerifier) {
      // If verifier exists, ensure it's rendered.
      window.recaptchaVerifier.render();
      return;
    }

    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
      callback: () => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
      },
    });
  };

  const handleSendOtp = async () => {
    setLoading(true);
    try {
        if (!auth) throw new Error('Firebase Auth not available');
        
        setupRecaptcha();
        const appVerifier = window.recaptchaVerifier!;
        const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
        
        window.confirmationResult = confirmationResult;
        setShowOtpInput(true);
        setLoading(false);
        toast({
            title: 'OTP Sent',
            description: `An OTP has been sent to ${phoneNumber}.`,
        });

    } catch (error: any) {
        console.error('Error sending OTP:', error);
        toast({
            variant: 'destructive',
            title: 'Failed to Send OTP',
            description: error.message || 'Please check the phone number and try again.',
        });
        setLoading(false);
        // In case of error, reset reCAPTCHA
        if(window.recaptchaVerifier) {
            window.recaptchaVerifier.clear();
        }
    }
  };

  const handleVerifyOtp = async () => {
     if (!window.confirmationResult) {
        toast({ variant: 'destructive', title: 'Error', description: 'Please request an OTP first.' });
        return;
    }
    setLoading(true);
    try {
        await window.confirmationResult.confirm(otp);
        toast({
            title: 'Success!',
            description: "You've been successfully logged in as admin.",
        });
        // The layout will handle the redirect.
    } catch (error: any) {
        console.error('Error verifying OTP:', error);
        toast({
            variant: 'destructive',
            title: 'Invalid OTP',
            description: 'The code you entered is incorrect. Please try again.',
        });
        setLoading(false);
    }
  };


  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full flex items-center justify-center animate-fade-in-up">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover blur-sm scale-110"
          data-ai-hint={heroImage.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-black/50" />
      <div id="recaptcha-container"></div>
      <div className="relative z-10 container flex justify-center">
        <Card className="w-full max-w-md bg-card/60 backdrop-blur-xl border-white/20 shadow-2xl text-white">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/20 text-primary-foreground p-3 rounded-full w-fit mb-4">
              <Shield className="h-10 w-10" />
            </div>
            <CardTitle className="font-headline text-3xl">Admin Access</CardTitle>
            <CardDescription className="text-slate-300">
              Please verify your identity to proceed.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!showOtpInput ? (
                <div className="space-y-4">
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input 
                            type="tel" 
                            value={phoneNumber} 
                            onChange={(e) => setPhoneNumber(e.target.value)} 
                            className="pl-10 h-12 text-lg"
                            readOnly // Since it's a fixed number
                        />
                    </div>
                    <Button onClick={handleSendOtp} className="w-full h-12 text-lg" disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-5 w-5" />}
                        Send Verification Code
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                     <div className="relative">
                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <OtpInput
                          value={otp}
                          onChange={setOtp}
                          numInputs={6}
                          containerStyle="flex justify-between gap-2"
                          inputStyle={{
                              width: '100%',
                              height: '3rem',
                              fontSize: '1.25rem',
                              borderRadius: '0.375rem',
                              border: '1px solid hsl(var(--input))',
                              backgroundColor: 'hsl(var(--background) / 0.8)',
                              color: 'hsl(var(--foreground))',
                          }}
                          renderInput={(props) => <input {...props} />}
                        />
                    </div>
                    <Button onClick={handleVerifyOtp} className="w-full h-12 text-lg" disabled={loading || otp.length < 6}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Verify & Login
                    </Button>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
