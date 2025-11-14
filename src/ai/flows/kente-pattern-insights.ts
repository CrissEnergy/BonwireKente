'use server';

/**
 * @fileOverview Provides cultural insights and stories behind Kente patterns.
 *
 * - kentePatternInsights - A function that retrieves insights for a given Kente pattern.
 * - KentePatternInsightsInput - The input type for the kentePatternInsights function.
 * - KentePatternInsightsOutput - The return type for the kentePatternInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const KentePatternInsightsInputSchema = z.object({
  patternName: z
    .string()
    .describe('The name of the Kente pattern for which to retrieve insights.'),
});
export type KentePatternInsightsInput = z.infer<typeof KentePatternInsightsInputSchema>;

const KentePatternInsightsOutputSchema = z.object({
  culturalSignificance: z
    .string()
    .describe('Detailed cultural insights and historical context of the Kente pattern.'),
  story: z
    .string()
    .describe('A captivating story or legend associated with the Kente pattern.'),
});
export type KentePatternInsightsOutput = z.infer<typeof KentePatternInsightsOutputSchema>;

export async function kentePatternInsights(input: KentePatternInsightsInput): Promise<KentePatternInsightsOutput> {
  return kentePatternInsightsFlow(input);
}

const kentePatternInsightsPrompt = ai.definePrompt({
  name: 'kentePatternInsightsPrompt',
  input: {schema: KentePatternInsightsInputSchema},
  output: {schema: KentePatternInsightsOutputSchema},
  prompt: `You are a Kente cloth expert, skilled in the history, cultural significance, and stories behind various patterns.

  Provide detailed cultural insights, historical context, and a captivating story or legend associated with the specified Kente pattern.

  Pattern Name: {{{patternName}}}
  `,
});

const kentePatternInsightsFlow = ai.defineFlow(
  {
    name: 'kentePatternInsightsFlow',
    inputSchema: KentePatternInsightsInputSchema,
    outputSchema: KentePatternInsightsOutputSchema,
  },
  async input => {
    const {output} = await kentePatternInsightsPrompt(input);
    return output!;
  }
);
