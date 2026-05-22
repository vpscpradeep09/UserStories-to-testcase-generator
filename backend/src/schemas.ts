import { z } from 'zod'

export const GenerateRequestSchema = z.object({
  storyTitle: z.string().min(1, 'Story title is required'),
  acceptanceCriteria: z.string().min(1, 'Acceptance criteria is required'),
  description: z.string().optional(),
  additionalInfo: z.string().optional()
})

export const TestCaseSchema = z.object({
  id: z.string(),
  title: z.string(),
  steps: z.array(z.string()),
  testData: z.string().optional(),
  expectedResult: z.string(),
  category: z.string()
})

export const GenerateResponseSchema = z.object({
  cases: z.array(TestCaseSchema),
  model: z.string().optional(),
  promptTokens: z.number(),
  completionTokens: z.number()
})

// Type exports
export type GenerateRequest = z.infer<typeof GenerateRequestSchema>
export type TestCase = z.infer<typeof TestCaseSchema>
export type GenerateResponse = z.infer<typeof GenerateResponseSchema>

// Feature File Schemas
export const ExampleSchema = z.object({
  description: z.string(),
  rows: z.array(z.record(z.string()))
})

export const ScenarioSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  givenSteps: z.array(z.string()),
  whenSteps: z.array(z.string()),
  thenSteps: z.array(z.string()),
  examples: z.array(ExampleSchema).optional()
})

export const FeatureFileSchema = z.object({
  featureName: z.string(),
  featureDescription: z.string(),
  scenarios: z.array(ScenarioSchema)
})

export const GenerateFeatureFileResponseSchema = z.object({
  featureFile: FeatureFileSchema,
  model: z.string().optional(),
  promptTokens: z.number(),
  completionTokens: z.number()
})

export type Example = z.infer<typeof ExampleSchema>
export type Scenario = z.infer<typeof ScenarioSchema>
export type FeatureFile = z.infer<typeof FeatureFileSchema>
export type GenerateFeatureFileResponse = z.infer<typeof GenerateFeatureFileResponseSchema>