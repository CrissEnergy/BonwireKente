import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="container py-16 md:py-24 animate-fade-in-up">
        <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">Get In Touch</h1>
            <p className="text-lg text-muted-foreground">
                We'd love to hear from you. Whether you have a question about our products, a custom order request, or just want to say hello, our team is ready to assist you.
            </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
                <div className="flex items-start gap-4">
                    <div className="bg-primary/10 text-primary p-3 rounded-full"><Mail className="h-6 w-6"/></div>
                    <div>
                        <h3 className="text-xl font-semibold">Email</h3>
                        <p className="text-muted-foreground">Reach out to us for any inquiries.</p>
                        <a href="mailto:hello@bonwirekente.com" className="text-primary font-medium">hello@bonwirekente.com</a>
                    </div>
                </div>
                 <div className="flex items-start gap-4">
                    <div className="bg-primary/10 text-primary p-3 rounded-full"><Phone className="h-6 w-6"/></div>
                    <div>
                        <h3 className="text-xl font-semibold">Phone</h3>
                        <p className="text-muted-foreground">Speak with our customer service team.</p>
                        <p className="text-primary font-medium">+233 24 123 4567</p>
                    </div>
                </div>
                 <div className="flex items-start gap-4">
                    <div className="bg-primary/10 text-primary p-3 rounded-full"><MapPin className="h-6 w-6"/></div>
                    <div>
                        <h3 className="text-xl font-semibold">Our Workshop</h3>
                        <p className="text-muted-foreground">Visit us by appointment.</p>
                        <p className="text-primary font-medium">123 Kente Lane, Adanwomase, Ghana</p>
                    </div>
                </div>
            </div>
            
            <Card className="bg-card/60 backdrop-blur-sm border-white/20">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Send a Message</CardTitle>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" placeholder="Your Name" />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="Your Email" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="subject">Subject</Label>
                            <Input id="subject" placeholder="Subject" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="message">Message</Label>
                            <Textarea id="message" placeholder="Your message..." rows={5} />
                        </div>
                        <Button type="submit" className="w-full">Send Message</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
