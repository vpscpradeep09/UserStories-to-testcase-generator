import fetch from 'node-fetch'

export interface JiraCredentials {
  baseUrl: string
  email: string
  apiKey: string
}

export interface JiraIssue {
  key: string
  fields: {
    summary: string
    description: string
    issuetype: {
      name: string
    }
    status: {
      name: string
    }
  }
}

export interface JiraSearchResponse {
  issues: JiraIssue[]
  total: number
}

export class JiraClient {
  private credentials: JiraCredentials | null = null

  setCredentials(credentials: JiraCredentials) {
    this.credentials = credentials
  }

  getCredentials(): JiraCredentials | null {
    return this.credentials
  }

  private getAuthHeader(): string {
    if (!this.credentials) {
      throw new Error('Jira credentials not set')
    }
    const auth = Buffer.from(`${this.credentials.email}:${this.credentials.apiKey}`).toString('base64')
    return `Basic ${auth}`
  }

  async testConnection(): Promise<boolean> {
    try {
      if (!this.credentials) {
        throw new Error('Jira credentials not set')
      }

      const response = await fetch(`${this.credentials.baseUrl}/rest/api/3/myself`, {
        method: 'GET',
        headers: {
          'Authorization': this.getAuthHeader(),
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })

      return response.ok
    } catch (error) {
      console.error('Jira connection test failed:', error)
      return false
    }
  }

  async getIssue(issueKey: string): Promise<JiraIssue> {
    if (!this.credentials) {
      throw new Error('Jira credentials not set')
    }

    const response = await fetch(
      `${this.credentials.baseUrl}/rest/api/3/issue/${issueKey}`,
      {
        method: 'GET',
        headers: {
          'Authorization': this.getAuthHeader(),
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch Jira issue: ${response.statusText}`)
    }

    const issue = await response.json() as JiraIssue
    return issue
  }

  async searchIssues(jql: string): Promise<JiraSearchResponse> {
    if (!this.credentials) {
      throw new Error('Jira credentials not set')
    }

    const params = new URLSearchParams({
      jql: jql,
      maxResults: '50',
      fields: 'summary,description,issuetype,status'
    })

    const response = await fetch(
      `${this.credentials.baseUrl}/rest/api/3/search?${params}`,
      {
        method: 'GET',
        headers: {
          'Authorization': this.getAuthHeader(),
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to search Jira issues: ${response.statusText}`)
    }

    const result = await response.json() as JiraSearchResponse
    return result
  }

  async getStories(projectKey?: string): Promise<JiraSearchResponse> {
    let jql = 'type = Story'
    if (projectKey) {
      jql += ` AND project = ${projectKey}`
    }
    jql += ' ORDER BY created DESC'

    return this.searchIssues(jql)
  }
}

// Global Jira client instance
export const jiraClient = new JiraClient()
