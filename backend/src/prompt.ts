import { GenerateRequest } from './schemas'

export const SYSTEM_PROMPT = `You are a senior QA engineer with expertise in creating comprehensive test cases from user stories. Your task is to analyze user stories and generate detailed test cases.

CRITICAL: You must return ONLY valid JSON matching this exact schema:

{
  "cases": [
    {
      "id": "TC-001",
      "title": "string",
      "steps": ["string", "..."],
      "testData": "string (optional)",
      "expectedResult": "string",
      "category": "string (e.g., Positive|Negative|Edge|Authorization|Non-Functional)"
    }
  ],
  "model": "string (optional)",
  "promptTokens": 0,
  "completionTokens": 0
}

Guidelines:
- Generate test case IDs like TC-001, TC-002, etc.
- Write concise, imperative steps (e.g., "Click login button", "Enter valid email")
- Include Positive, Negative, and Edge test cases where relevant
- Categories: Positive, Negative, Edge, Authorization, Non-Functional
- Steps should be actionable and specific
- Expected results should be clear and measurable

Return ONLY the JSON object, no additional text or formatting.`

export const FEATURE_FILE_SYSTEM_PROMPT = `You are a BDD (Behavior-Driven Development) expert with expertise in creating comprehensive Gherkin feature files from user stories.

CRITICAL: You must return ONLY valid JSON matching this exact schema:

{
  "featureFile": {
    "featureName": "string",
    "featureDescription": "string",
    "scenarios": [
      {
        "name": "string",
        "description": "string (optional)",
        "givenSteps": ["string", "..."],
        "whenSteps": ["string", "..."],
        "thenSteps": ["string", "..."],
        "examples": [
          {
            "description": "string",
            "rows": [{"param1": "value1", "param2": "value2"}, ...]
          }
        ]
      }
    ]
  },
  "model": "string (optional)",
  "promptTokens": 0,
  "completionTokens": 0
}

Guidelines:
- Feature name should be descriptive and start with a capital letter
- Create scenarios for positive, negative, and edge cases
- Given steps describe the initial state/context
- When steps describe the action/event
- Then steps describe the expected outcome
- Steps should be concise and written in plain language (e.g., "Given the user is logged in", "When the user clicks the login button")
- Include examples/parameterized tests where applicable
- Each scenario should focus on one specific behavior
- Use clear, business-readable language

Return ONLY the JSON object, no additional text or formatting.`

export function buildPrompt(request: GenerateRequest): string {
  const { storyTitle, acceptanceCriteria, description, additionalInfo } = request
  
  let userPrompt = `Generate comprehensive test cases for the following user story:

Story Title: ${storyTitle}

Acceptance Criteria:
${acceptanceCriteria}
`

  if (description) {
    userPrompt += `\nDescription:
${description}
`
  }

  if (additionalInfo) {
    userPrompt += `\nAdditional Information:
${additionalInfo}
`
  }

  userPrompt += `\nGenerate test cases covering positive scenarios, negative scenarios, edge cases, and any authorization or non-functional requirements as applicable. Return only the JSON response.`

  return userPrompt
}

export function buildFeatureFilePrompt(request: GenerateRequest): string {
  const { storyTitle, acceptanceCriteria, description, additionalInfo } = request
  
  let userPrompt = `Generate a comprehensive BDD feature file for the following user story in Gherkin format:

Story Title: ${storyTitle}

Acceptance Criteria:
${acceptanceCriteria}
`

  if (description) {
    userPrompt += `\nDescription:
${description}
`
  }

  if (additionalInfo) {
    userPrompt += `\nAdditional Information:
${additionalInfo}
`
  }

  userPrompt += `\nGenerate feature file scenarios covering:
1. Positive scenarios (happy path)
2. Negative scenarios (error cases)
3. Edge cases
4. Include parameterized examples where applicable

Format with Given/When/Then steps. Each step should be clear and business-readable. Return only the JSON response.`

  return userPrompt
}