import express from 'express'
import { GroqClient } from '../llm/groqClient'
import { GenerateRequestSchema, GenerateFeatureFileResponseSchema, GenerateFeatureFileResponse } from '../schemas'
import { FEATURE_FILE_SYSTEM_PROMPT, buildFeatureFilePrompt } from '../prompt'

export const featureRouter = express.Router()

featureRouter.post('/', async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    // Validate request body
    const validationResult = GenerateRequestSchema.safeParse(req.body)
    
    if (!validationResult.success) {
      res.status(400).json({
        error: `Validation error: ${validationResult.error.message}`
      })
      return
    }

    const request = validationResult.data

    // Build prompts
    const userPrompt = buildFeatureFilePrompt(request)

    // Create GroqClient instance
    const groqClient = new GroqClient()

    // Generate feature file using Groq
    try {
      const groqResponse = await groqClient.generateTests(FEATURE_FILE_SYSTEM_PROMPT, userPrompt)
      
      // Parse the JSON content
      let parsedResponse: GenerateFeatureFileResponse
      try {
        parsedResponse = JSON.parse(groqResponse.content)
      } catch (parseError) {
        res.status(502).json({
          error: 'LLM returned invalid JSON format'
        })
        return
      }

      // Validate the response schema
      const responseValidation = GenerateFeatureFileResponseSchema.safeParse(parsedResponse)
      if (!responseValidation.success) {
        res.status(502).json({
          error: 'LLM response does not match expected schema'
        })
        return
      }

      // Add token usage info if available
      const finalResponse = {
        ...responseValidation.data,
        model: groqResponse.model,
        promptTokens: groqResponse.promptTokens,
        completionTokens: groqResponse.completionTokens
      }

      res.json(finalResponse)
    } catch (llmError) {
      console.error('LLM error:', llmError)
      res.status(502).json({
        error: 'Failed to generate feature file from LLM service'
      })
      return
    }
  } catch (error) {
    console.error('Error in feature file route:', error)
    res.status(500).json({
      error: 'Internal server error'
    })
  }
})
