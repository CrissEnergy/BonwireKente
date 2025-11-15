'use client';

import { useState } from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Shield, Mail, Lock, Loader2, LogIn } from 'lucide-react';
import { useAuth } from '@/firebase';
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from 'next/navigation';

const ADMIN_EMAIL = 'admin@bonwirekente.com';

export default function AdminLoginPage() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-image');
  const auth = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    if (email.toLowerCase() !== ADMIN_EMAIL) {
        toast({
            variant: 'destructive',
            title: 'Invalid Credentials',
            description: 'The provided email is not a valid admin account.',
        });
        setLoading(false);
        return;
    }

    try {
        if (!auth) throw new Error('Firebase Auth not available');
        await signInWithEmailAndPassword(auth, email, password);
        toast({
            title: 'Success!',
            description: "You've been successfully logged in as admin.",
        });
        router.push('/admin'); // Redirect to admin dashboard on successful login
    } catch (error: any) {
        console.error('Error signing in:', error);
        toast({
            variant: 'destructive',
            title: 'Login Failed',
            description: 'Please check your password and try again.',
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
      <div className="relative z-10 container flex justify-center">
        <Card className="w-full max-w-md bg-card/60 backdrop-blur-xl border-white/20 shadow-2xl text-white">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/20 text-primary-foreground p-3 rounded-full w-fit mb-4">
              <Shield className="h-10 w-10" />
            </div>
            <CardTitle className="font-headline text-3xl">Admin Access</CardTitle>
            <CardDescription className="text-slate-300">
              Please enter your admin credentials.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="admin@bonwirekente.com"
                        className="pl-10 h-12 text-lg"
                    />
                </div>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="pl-10 h-12 text-lg"
                    />
                </div>
                <Button onClick={handleLogin} className="w-full h-12 text-lg" disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-5 w-5" />}
                    Login
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
