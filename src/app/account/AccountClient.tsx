"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Mail, Lock, Building } from 'lucide-react';

export function AccountClient() {
  return (
    <div className="flex justify-center items-center">
      <Tabs defaultValue="signin" className="w-full max-w-md">
        <Card className="bg-card/60 backdrop-blur-xl border-white/20 shadow-2xl">
           <TabsList className="grid w-full grid-cols-2 bg-transparent p-0 h-auto rounded-t-lg">
              <TabsTrigger value="signin" className="py-4 rounded-tl-lg data-[state=active]:bg-black/20 data-[state=active]:text-white data-[state=active]:shadow-inner">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="py-4 rounded-tr-lg data-[state=active]:bg-black/20 data-[state=active]:text-white data-[state=active]:shadow-inner">Sign Up</TabsTrigger>
            </TabsList>
          <TabsContent value="signin">
            <CardHeader className="text-center">
              <CardTitle className="font-headline text-3xl">Welcome Back</CardTitle>
              <CardDescription>
                Enter your credentials to access your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative">
                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input id="email-signin" type="email" placeholder="you@example.com" className="pl-10" />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input id="password-signin" type="password" placeholder="Password" className="pl-10" />
              </div>
              <Button type="submit" className="w-full h-12 text-lg">Sign In</Button>
            </CardContent>
          </TabsContent>
          <TabsContent value="signup">
            <CardHeader className="text-center">
              <CardTitle className="font-headline text-3xl">Create an Account</CardTitle>
              <CardDescription>
                Join our community to start weaving your story.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input id="name-signup" placeholder="Your Name" className="pl-10"/>
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input id="email-signup" type="email" placeholder="you@example.com" className="pl-10"/>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input id="password-signup" type="password" placeholder="Password" className="pl-10"/>
              </div>
              <Button type="submit" className="w-full h-12 text-lg">Create Account</Button>
            </CardContent>
          </TabsContent>
        </Card>
      </Tabs>
    </div>
  );
}
