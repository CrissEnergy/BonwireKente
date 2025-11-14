"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Mail, Lock } from 'lucide-react';
import { useAuth, useUser } from "@/firebase";
import { signOut } from "firebase/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { initiateEmailSignIn, initiateEmailSignUp } from "@/firebase/non-blocking-login";
import { useToast } from "@/hooks/use-toast";

const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

const signUpSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Invalid email address." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export function AccountClient() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const { toast } = useToast();

  const signInForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const signUpForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const handleSignIn = (values: z.infer<typeof signInSchema>) => {
    initiateEmailSignIn(auth, values.email, values.password);
  };

  const handleSignUp = (values: z.infer<typeof signUpSchema>) => {
    initiateEmailSignUp(auth, values.email, values.password);
    // In a real app, you'd also update the user's profile with their name
  };

  const handleSignOut = () => {
    signOut(auth);
    toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
    });
  };

  if (isUserLoading) {
    return (
        <div className="flex justify-center items-center">
            <Card className="w-full max-w-md bg-card/60 backdrop-blur-xl border-white/20 shadow-2xl p-8 text-center">
                <CardTitle>Loading Account...</CardTitle>
            </Card>
        </div>
    )
  }

  if (user) {
    return (
      <div className="flex justify-center items-center">
        <Card className="w-full max-w-md bg-card/60 backdrop-blur-xl border-white/20 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-3xl">Welcome Back</CardTitle>
            <CardDescription>
              You are signed in as {user.email}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button onClick={handleSignOut} className="w-full h-12 text-lg">Sign Out</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            <CardContent>
              <Form {...signInForm}>
                <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-6">
                  <FormField
                    control={signInForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <FormControl>
                            <Input placeholder="you@example.com" {...field} className="pl-10" />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signInForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <FormControl>
                            <Input type="password" placeholder="Password" {...field} className="pl-10" />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full h-12 text-lg">Sign In</Button>
                </form>
              </Form>
            </CardContent>
          </TabsContent>
          <TabsContent value="signup">
            <CardHeader className="text-center">
              <CardTitle className="font-headline text-3xl">Create an Account</CardTitle>
              <CardDescription>
                Join our community to start weaving your story.
              </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...signUpForm}>
                    <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-6">
                        <FormField
                            control={signUpForm.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                        <FormControl>
                                            <Input placeholder="Your Name" {...field} className="pl-10"/>
                                        </FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={signUpForm.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                        <FormControl>
                                            <Input placeholder="you@example.com" {...field} className="pl-10"/>
                                        </FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={signUpForm.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                        <FormControl>
                                            <Input type="password" placeholder="Password" {...field} className="pl-10"/>
                                        </FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full h-12 text-lg">Create Account</Button>
                    </form>
                </Form>
            </CardContent>
          </TabsContent>
        </Card>
      </Tabs>
    </div>
  );
}