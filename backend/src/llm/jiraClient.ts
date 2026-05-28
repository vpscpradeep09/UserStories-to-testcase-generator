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

  private normalizeBaseUrl(baseUrl: string): string {
    return baseUrl.replace(/\/+$/, '')
  }

  async testConnection(): Promise<boolean> {
    try {
      if (!this.credentials) {
        throw new Error('Jira credentials not set')
      }

      const baseUrl = this.normalizeBaseUrl(this.credentials.baseUrl)
      const response = await fetch(`${baseUrl}/rest/api/3/myself`, {
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

    const baseUrl = this.normalizeBaseUrl(this.credentials.baseUrl)
    const response = await fetch(
      `${baseUrl}/rest/api/3/issue/${issueKey}`,
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

    const baseUrl = this.normalizeBaseUrl(this.credentials.baseUrl)
    // JIRA Cloud uses /rest/api/3/issues/search (not /rest/api/3/search)
    // Try different endpoint variations for compatibility
    const attempts = [
      {
        name: 'GET v3 /issues/search',
        method: 'GET',
        url: `${baseUrl}/rest/api/3/issues/search?jql=${encodeURIComponent(jql)}&maxResults=50`,
        headers: {
          'Authorization': this.getAuthHeader(),
          'Accept': 'application/json'
        }
      },
      {
        name: 'GET v3 /search',
        method: 'GET',
        url: `${baseUrl}/rest/api/3/search?jql=${encodeURIComponent(jql)}&maxResults=50`,
        headers: {
          'Authorization': this.getAuthHeader(),
          'Accept': 'application/json'
        }
      },
      {
        name: 'GET v2 /search',
        method: 'GET',
        url: `${baseUrl}/rest/api/2/search?jql=${encodeURIComponent(jql)}&maxResults=50`,
        headers: {
          'Authorization': this.getAuthHeader(),
          'Accept': 'application/json'
        }
      }
    ]

    let lastError: string | null = null

    for (const attempt of attempts) {
      console.log(`Attempting ${attempt.name}:`, { url: attempt.url, jql })

      try {
        const response = await fetch(attempt.url, {
          method: attempt.method,
          headers: attempt.headers
        })

        console.log(`${attempt.name} response:`, { status: response.status, statusText: response.statusText })

        if (!response.ok) {
          const errorText = await response.text()
          console.warn(`${attempt.name} error (${response.status}):`, errorText?.substring(0, 300))
          lastError = `${attempt.name} returned ${response.status}`
          
          // Don't continue if we get a different error (like 401, 403)
          if (response.status !== 410 && response.status !== 404) {
            throw new Error(`${attempt.name} failed with status ${response.status}: ${errorText?.substring(0, 200)}`)
          }
          continue
        }

        const result: any = await response.json()
        console.log(`${attempt.name} successful, issues found:`, result.issues?.length || 0)
        return {
          issues: (result.issues || []).map((issue: any) => ({
            key: issue.key,
            fields: {
              summary: issue.fields?.summary || '',
              description: typeof issue.fields?.description === 'string'
                ? issue.fields.description
                : (issue.fields?.description?.content
                    ? issue.fields.description.content.map((c: any) => c.text || '').join('\n')
                    : ''),
              issuetype: {
                name: issue.fields?.issuetype?.name || 'Unknown'
              },
              status: {
                name: issue.fields?.status?.name || 'Unknown'
              }
            }
          })),
          total: result.total || 0
        }
      } catch (error) {
        lastError = `Error with ${attempt.name}: ${error instanceof Error ? error.message : String(error)}`
        console.error(lastError)
        
        // Don't try other endpoints if we get an authentication error
        if (error instanceof Error && (error.message.includes('401') || error.message.includes('403'))) {
          throw error
        }
      }
    }

    throw new Error(`Failed to search Jira issues. Last error: ${lastError || 'All endpoint attempts failed'}. Make sure your JIRA instance has issues and verify the base URL is correct.`)
  }

  async getStories(projectKey?: string): Promise<JiraSearchResponse> {
    let jql = 'type = Story'
    if (projectKey && projectKey.trim()) {
      const escapedProjectKey = projectKey.trim().replace(/"/g, '\\"')
      jql += ` AND project = "${escapedProjectKey}"`
    }
    jql += ' ORDER BY created DESC'

    return this.searchIssues(jql)
  }
}

// Global Jira client instance
export const jiraClient = new JiraClient()
