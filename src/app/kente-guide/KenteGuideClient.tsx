"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { kentePatternInsights, KentePatternInsightsOutput } from "@/ai/flows/kente-pattern-insights";

const formSchema = z.object({
  patternName: z.string().min(2, {
    message: "Pattern name must be at least 2 characters.",
  }),
});

export function KenteGuideClient() {
  const [insights, setInsights] = useState<KentePatternInsightsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patternName: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setInsights(null);
    try {
      const result = await kentePatternInsights(values);
      setInsights(result);
    } catch (e) {
      setError("Could not retrieve insights. Please try another pattern name.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Search for a Pattern</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mb-8">
            <FormField
              control={form.control}
              name="patternName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pattern Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Adwinasa, Sika Futoro" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Get Insights
            </Button>
          </form>
        </Form>

        {isLoading && (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {error && (
            <div className="text-destructive p-4 border border-destructive/50 rounded-md">
                {error}
            </div>
        )}

        {insights && (
          <div className="space-y-6 animate-in fade-in-50 duration-500">
            <div>
              <h3 className="font-headline text-2xl font-bold mb-2">Cultural Significance</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{insights.culturalSignificance}</p>
            </div>
            <div>
              <h3 className="font-headline text-2xl font-bold mb-2">The Story Behind the Weave</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{insights.story}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
