import express from 'express'
import { z } from 'zod'
import { jiraClient, JiraCredentials } from '../llm/jiraClient'

export const jiraRouter = express.Router()

// In-memory mock stories used for local testing
const mockStories: Array<any> = []

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

    // Prevent users from accidentally pasting the Atlassian login page URL
    try {
      const parsed = new URL(credentials.baseUrl)
      const host = parsed.hostname.toLowerCase()
      if (host === 'id.atlassian.com' || host === 'login.atlassian.com' || parsed.pathname.includes('/login') || parsed.search) {
        res.status(400).json({
          error: 'Please provide your Jira instance URL (for example https://your-domain.atlassian.net). Do not paste the Atlassian login URL.'
        })
        return
      }
    } catch (err) {
      // if URL parsing somehow fails, fall back to existing validation
    }
    // Set credentials in the Jira client and test the connection
    jiraClient.setCredentials(credentials)

    // Test the connection
    const isConnected = await jiraClient.testConnection()

    if (!isConnected) {
      // Clear credentials if test failed
      jiraClient.setCredentials(null as any)
      res.status(401).json({
        error: 'Failed to authenticate with Jira. Please check your credentials and ensure the base URL is your Jira instance.'
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

    // Allow fetching mock stories for local testing via ?mock=true
    const { projectKey, mock } = req.query
    if (mock === 'true' || mock === '1') {
      const stories = mockStories.map((issue) => ({
        key: issue.key,
        summary: issue.fields.summary,
        description: issue.fields.description || '',
        issueType: issue.fields.issuetype.name,
        status: issue.fields.status.name
      }))

      res.json({
        success: true,
        total: stories.length,
        stories
      })
      return
    }

    if (!credentials) {
      res.status(401).json({
        error: 'Jira is not connected. Please connect first.'
      })
      return
    }

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

// Mock endpoints to help with local testing without a real Jira instance
jiraRouter.post('/mock/add', (req: express.Request, res: express.Response) => {
  try {
    const { key, summary, description, issueType, status } = req.body

    if (!key || !summary) {
      res.status(400).json({ error: 'Mock story requires `key` and `summary`' })
      return
    }

    mockStories.push({
      key,
      fields: {
        summary,
        description: description || '',
        issuetype: { name: issueType || 'Story' },
        status: { name: status || 'To Do' }
      }
    })

    res.json({ success: true })
  } catch (err) {
    console.error('Error adding mock story:', err)
    res.status(500).json({ error: 'Failed to add mock story' })
  }
})

jiraRouter.get('/mock/stories', (req: express.Request, res: express.Response) => {
  try {
    const stories = mockStories.map((issue) => ({
      key: issue.key,
      summary: issue.fields.summary,
      description: issue.fields.description || '',
      issueType: issue.fields.issuetype.name,
      status: issue.fields.status.name
    }))

    res.json({ success: true, total: stories.length, stories })
  } catch (err) {
    console.error('Error getting mock stories:', err)
    res.status(500).json({ error: 'Failed to get mock stories' })
  }
})

// Test helper functions (exported for local unit testing)
export function __test_addMockStoryDirect(story: any) {
  mockStories.push(story)
}

export function __test_getMockStoriesDirect() {
  return mockStories.map((issue) => ({
    key: issue.key,
    summary: issue.fields.summary,
    description: issue.fields.description || '',
    issueType: issue.fields.issuetype.name,
    status: issue.fields.status.name
  }))
}
