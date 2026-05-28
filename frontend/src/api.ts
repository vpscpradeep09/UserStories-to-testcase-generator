import { GenerateRequest, GenerateResponse, GenerateFeatureFileResponse } from './types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

export async function generateTests(request: GenerateRequest): Promise<GenerateResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/generate-tests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    const data: GenerateResponse = await response.json()
    return data
  } catch (error) {
    console.error('Error generating tests:', error)
    throw error instanceof Error ? error : new Error('Unknown error occurred')
  }
}

export async function generateFeatureFile(request: GenerateRequest): Promise<GenerateFeatureFileResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/generate-feature-file`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    const data: GenerateFeatureFileResponse = await response.json()
    return data
  } catch (error) {
    console.error('Error generating feature file:', error)
    throw error instanceof Error ? error : new Error('Unknown error occurred')
  }
}

// Jira API functions
export interface JiraCredentials {
  baseUrl: string
  email: string
  apiKey: string
}

export interface JiraIssue {
  key: string
  summary: string
  description: string
  issueType: string
  status: string
}

export interface JiraStory {
  key: string
  summary: string
  description: string
  issueType: string
  status: string
}

export async function connectToJira(credentials: JiraCredentials): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/jira/connect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error connecting to Jira:', error)
    throw error instanceof Error ? error : new Error('Unknown error occurred')
  }
}

export async function getJiraConnectionStatus(): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/jira/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error getting Jira status:', error)
    throw error instanceof Error ? error : new Error('Unknown error occurred')
  }
}

export async function getJiraIssue(issueKey: string): Promise<JiraIssue> {
  try {
    const response = await fetch(`${API_BASE_URL}/jira/issue/${issueKey}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.issue
  } catch (error) {
    console.error('Error fetching Jira issue:', error)
    throw error instanceof Error ? error : new Error('Unknown error occurred')
  }
}

export async function getJiraStories(projectKey?: string): Promise<JiraStory[]> {
  try {
    const url = new URL(`${API_BASE_URL}/jira/stories`)
    if (projectKey) {
      url.searchParams.append('projectKey', projectKey)
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.stories || []
  } catch (error) {
    console.error('Error fetching Jira stories:', error)
    throw error instanceof Error ? error : new Error('Unknown error occurred')
  }
}

export async function disconnectFromJira(): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/jira/disconnect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error disconnecting from Jira:', error)
    throw error instanceof Error ? error : new Error('Unknown error occurred')
  }
}