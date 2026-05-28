import express from 'express'
import { z } from 'zod'
import { jiraClient, JiraCredentials } from '../llm/jiraClient'

export const jiraRouter = express.Router()

// Validation schema for Jira credentials
const JiraCredentialsSchema = z.object({
  baseUrl: z.string().url('Invalid base URL format'),
  email: z.string().email('Invalid email format'),
  apiKey: z.string().min(1, 'API key is required')
})

// Test Jira connection
jiraRouter.post('/connect', async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const validationResult = JiraCredentialsSchema.safeParse(req.body)

    if (!validationResult.success) {
      res.status(400).json({
        error: `Validation error: ${validationResult.error.message}`,
        details: validationResult.error.errors
      })
      return
    }

    const credentials: JiraCredentials = validationResult.data

    // Set credentials in the Jira client
    jiraClient.setCredentials(credentials)

    // Test the connection
    const isConnected = await jiraClient.testConnection()

    if (!isConnected) {
      res.status(401).json({
        error: 'Failed to authenticate with Jira. Please check your credentials.'
      })
      return
    }

    res.json({
      success: true,
      message: 'Successfully connected to Jira',
      credentials: {
        baseUrl: credentials.baseUrl,
        email: credentials.email
      }
    })
  } catch (error) {
    console.error('Jira connection error:', error)
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to connect to Jira'
    })
  }
})

// Get connection status
jiraRouter.get('/status', (req: express.Request, res: express.Response): void => {
  try {
    const credentials = jiraClient.getCredentials()

    if (!credentials) {
      res.json({
        connected: false,
        message: 'Jira is not connected'
      })
      return
    }

    res.json({
      connected: true,
      message: 'Jira is connected',
      baseUrl: credentials.baseUrl,
      email: credentials.email
    })
  } catch (error) {
    console.error('Error getting Jira status:', error)
    res.status(500).json({
      error: 'Failed to get Jira connection status'
    })
  }
})

// Get Jira story by key
jiraRouter.get('/issue/:issueKey', async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const credentials = jiraClient.getCredentials()

    if (!credentials) {
      res.status(401).json({
        error: 'Jira is not connected. Please connect first.'
      })
      return
    }

    const { issueKey } = req.params
    const issue = await jiraClient.getIssue(issueKey)

    res.json({
      success: true,
      issue: {
        key: issue.key,
        summary: issue.fields.summary,
        description: issue.fields.description || '',
        issueType: issue.fields.issuetype.name,
        status: issue.fields.status.name
      }
    })
  } catch (error) {
    console.error('Error fetching Jira issue:', error)
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to fetch Jira issue'
    })
  }
})

// Get Jira stories
jiraRouter.get('/stories', async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const credentials = jiraClient.getCredentials()

    if (!credentials) {
      res.status(401).json({
        error: 'Jira is not connected. Please connect first.'
      })
      return
    }

    const { projectKey } = req.query
    const searchResponse = await jiraClient.getStories(projectKey as string | undefined)

    const stories = searchResponse.issues.map(issue => ({
      key: issue.key,
      summary: issue.fields.summary,
      description: issue.fields.description || '',
      issueType: issue.fields.issuetype.name,
      status: issue.fields.status.name
    }))

    res.json({
      success: true,
      total: searchResponse.total,
      stories: stories
    })
  } catch (error) {
    console.error('Error fetching Jira stories:', error)
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to fetch Jira stories'
    })
  }
})

// Disconnect Jira
jiraRouter.post('/disconnect', (req: express.Request, res: express.Response): void => {
  try {
    jiraClient.setCredentials(null as any)

    res.json({
      success: true,
      message: 'Successfully disconnected from Jira'
    })
  } catch (error) {
    console.error('Error disconnecting Jira:', error)
    res.status(500).json({
      error: 'Failed to disconnect from Jira'
    })
  }
})
