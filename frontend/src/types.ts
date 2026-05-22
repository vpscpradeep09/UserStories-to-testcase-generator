export interface GenerateRequest {
  storyTitle: string
  acceptanceCriteria: string
  description?: string
  additionalInfo?: string
}

export interface TestCase {
  id: string
  title: string
  steps: string[]
  testData?: string
  expectedResult: string
  category: string
}

export interface GenerateResponse {
  cases: TestCase[]
  model?: string
  promptTokens: number
  completionTokens: number
}

export interface FeatureFile {
  featureName: string
  featureDescription: string
  scenarios: Scenario[]
}

export interface Scenario {
  name: string
  description?: string
  givenSteps: string[]
  whenSteps: string[]
  thenSteps: string[]
  examples?: Example[]
}

export interface Example {
  description: string
  rows: { [key: string]: string }[]
}

export interface GenerateFeatureFileResponse {
  featureFile: FeatureFile
  model?: string
  promptTokens: number
  completionTokens: number
}