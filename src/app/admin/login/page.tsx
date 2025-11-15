
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShieldCheck, Phone } from 'lucide-react';
import { useAdminAuth } from '../AdminAuthProvider';

const ADMIN_PHONE_NUMBER = '0596352632';

export default function AdminLoginPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAdminAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (phoneNumber === ADMIN_PHONE_NUMBER) {
      toast({ title: 'Success', description: 'Admin login successful.' });
      login();
      router.push('/admin');
    } else {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'The phone number is incorrect.',
      });
      setLoading(false);
    }
  };

  return (
    <Card className="w-full bg-card/70 backdrop-blur-xl border-white/20 shadow-2xl text-white">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <ShieldCheck className="h-12 w-12 text-primary" />
        </div>
        <CardTitle className="font-headline text-3xl">Admin Login</CardTitle>
        <CardDescription className="text-slate-300">
          Please enter the magic login to continue.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="tel"
              placeholder="Magic login"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="pl-10 h-12 text-lg"
              required
            />
          </div>
          <Button type="submit" className="w-full h-12 text-lg" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Login'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
