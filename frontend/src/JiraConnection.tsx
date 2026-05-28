import { useState, useEffect } from 'react'

interface JiraStory {
  key: string
  summary: string
  description: string
  issueType: string
  status: string
}

interface JiraConnectionProps {
  onConnectionStatusChange: (isConnected: boolean) => void
  onStorySelected?: (story: JiraStory) => void
}

export function JiraConnection({ onConnectionStatusChange, onStorySelected }: JiraConnectionProps) {
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [showForm, setShowForm] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    baseUrl: '',
    email: '',
    apiKey: ''
  })
  const [stories, setStories] = useState<JiraStory[]>([])
  const [isLoadingStories, setIsLoadingStories] = useState<boolean>(false)
  const [showStories, setShowStories] = useState<boolean>(false)
  const [projectKey, setProjectKey] = useState<string>('')

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8090/api'

  // Check initial connection status
  useEffect(() => {
    checkConnectionStatus()
  }, [])

  const checkConnectionStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/jira/status`)
      const data = await response.json()
      
      if (data.connected) {
        setIsConnected(true)
        setFormData({
          baseUrl: data.baseUrl || '',
          email: data.email || '',
          apiKey: ''
        })
        onConnectionStatusChange(true)
      } else {
        setIsConnected(false)
        onConnectionStatusChange(false)
      }
    } catch (err) {
      console.error('Error checking Jira connection status:', err)
      setIsConnected(false)
      onConnectionStatusChange(false)
    }
  }

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError(null)
    setSuccessMessage(null)
  }

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.baseUrl.trim() || !formData.email.trim() || !formData.apiKey.trim()) {
      setError('All fields are required')
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const response = await fetch(`${API_BASE_URL}/jira/connect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          baseUrl: formData.baseUrl.trim(),
          email: formData.email.trim(),
          apiKey: formData.apiKey.trim()
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to connect to Jira')
        setIsLoading(false)
        return
      }

      setIsConnected(true)
      setShowForm(false)
      setSuccessMessage('Successfully connected to Jira!')
      setFormData({ ...formData, apiKey: '' })
      onConnectionStatusChange(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to Jira')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisconnect = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/jira/disconnect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        setIsConnected(false)
        setFormData({ baseUrl: '', email: '', apiKey: '' })
        setStories([])
        setShowStories(false)
        setProjectKey('')
        setSuccessMessage('Successfully disconnected from Jira')
        onConnectionStatusChange(false)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disconnect from Jira')
    }
  }

  const handleFetchStories = async () => {
    setIsLoadingStories(true)
    setError(null)

    try {
      const url = new URL(`${API_BASE_URL}/jira/stories`)
      if (projectKey.trim()) {
        url.searchParams.append('projectKey', projectKey.trim())
      }

      const response = await fetch(url.toString())
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to fetch stories')
        setIsLoadingStories(false)
        return
      }

      setStories(data.stories || [])
      setShowStories(true)
      if (data.stories && data.stories.length === 0) {
        setSuccessMessage('No stories found')
      } else {
        setSuccessMessage(`Fetched ${data.stories?.length || 0} stories`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stories')
    } finally {
      setIsLoadingStories(false)
    }
  }

  const handleStorySelect = (story: JiraStory) => {
    if (onStorySelected) {
      onStorySelected(story)
    }
    setShowStories(false)
  }

  return (
    <div style={styles.jiraContainer}>
      <div style={styles.jiraHeader}>
        <h3 style={styles.jiraTitle}>Jira Integration</h3>
        {isConnected && (
          <span style={styles.connectedBadge}>Connected ✓</span>
        )}
      </div>

      {error && <div style={styles.errorMessage}>{error}</div>}
      {successMessage && <div style={styles.successMessage}>{successMessage}</div>}

      {!isConnected ? (
        <>
          <button 
            onClick={() => setShowForm(!showForm)}
            style={styles.connectBtn}
            disabled={isLoading}
          >
            {showForm ? 'Hide Connection Form' : 'Connect Jira'}
          </button>

          {showForm && (
            <form onSubmit={handleConnect} style={styles.jiraForm}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Jira Base URL *</label>
                <input
                  type="url"
                  placeholder="https://your-jira-instance.atlassian.net"
                  value={formData.baseUrl}
                  onChange={(e) => handleInputChange('baseUrl', e.target.value)}
                  style={styles.input}
                  disabled={isLoading}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Email Address *</label>
                <input
                  type="email"
                  placeholder="your-email@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  style={styles.input}
                  disabled={isLoading}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Jira API Key *</label>
                <input
                  type="password"
                  placeholder="Your Jira API Key"
                  value={formData.apiKey}
                  onChange={(e) => handleInputChange('apiKey', e.target.value)}
                  style={styles.input}
                  disabled={isLoading}
                />
                <p style={styles.helpText}>
                  Get your API key from: https://id.atlassian.com/manage-profile/security/api-tokens
                </p>
              </div>

              <button 
                type="submit"
                style={styles.submitBtn}
                disabled={isLoading}
              >
                {isLoading ? 'Connecting...' : 'Test & Connect'}
              </button>
            </form>
          )}
        </>
      ) : (
        <div style={styles.connectedInfo}>
          <p style={styles.connectedText}>
            <strong>Connected to:</strong> {formData.email} @ {formData.baseUrl}
          </p>
          
          <div style={styles.storiesFetchSection}>
            <div style={styles.projectFilterGroup}>
              <label style={styles.label}>Project Key (optional)</label>
              <input
                type="text"
                placeholder="e.g., PROJ"
                value={projectKey}
                onChange={(e) => setProjectKey(e.target.value)}
                style={styles.input}
                disabled={isLoadingStories}
              />
              <p style={styles.helpText}>Leave empty to fetch all stories</p>
            </div>

            <button 
              onClick={handleFetchStories}
              style={styles.fetchStoriesBtn}
              disabled={isLoadingStories}
            >
              {isLoadingStories ? 'Fetching Stories...' : '📋 Fetch User Stories'}
            </button>
          </div>

          {showStories && stories.length > 0 && (
            <div style={styles.storiesContainer}>
              <h4 style={styles.storiesTitle}>Available Stories ({stories.length})</h4>
              <div style={styles.storiesList}>
                {stories.map((story) => (
                  <div
                    key={story.key}
                    style={styles.storyItem}
                    onClick={() => handleStorySelect(story)}
                  >
                    <div style={styles.storyKey}>{story.key}</div>
                    <div style={styles.storyContent}>
                      <div style={styles.storySummary}>{story.summary}</div>
                      <div style={styles.storyMeta}>
                        <span style={styles.storyType}>{story.issueType}</span>
                        <span style={styles.storyStatus}>{story.status}</span>
                      </div>
                    </div>
                    <div style={styles.selectIcon}>→</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button 
            onClick={handleDisconnect}
            style={styles.disconnectBtn}
          >
            Disconnect Jira
          </button>
        </div>
      )}
    </div>
  )
}

const styles = {
  jiraContainer: {
    background: '#f8f9fa',
    border: '2px solid #e1e8ed',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px',
  } as React.CSSProperties,
  jiraHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  } as React.CSSProperties,
  jiraTitle: {
    margin: '0',
    fontSize: '18px',
    color: '#2c3e50',
    fontWeight: '600',
  } as React.CSSProperties,
  connectedBadge: {
    background: '#27ae60',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
  } as React.CSSProperties,
  connectBtn: {
    background: '#3498db',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  } as React.CSSProperties,
  disconnectBtn: {
    background: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  } as React.CSSProperties,
  jiraForm: {
    background: 'white',
    padding: '20px',
    borderRadius: '6px',
    marginTop: '15px',
    border: '1px solid #e1e8ed',
  } as React.CSSProperties,
  formGroup: {
    marginBottom: '15px',
  } as React.CSSProperties,
  label: {
    display: 'block',
    fontWeight: '600',
    marginBottom: '6px',
    color: '#2c3e50',
    fontSize: '14px',
  } as React.CSSProperties,
  input: {
    width: '100%',
    padding: '10px',
    border: '2px solid #e1e8ed',
    borderRadius: '6px',
    fontSize: '14px',
    boxSizing: 'border-box',
  } as React.CSSProperties,
  helpText: {
    fontSize: '12px',
    color: '#666',
    marginTop: '6px',
    margin: '6px 0 0 0',
  } as React.CSSProperties,
  submitBtn: {
    background: '#27ae60',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%',
    transition: 'background-color 0.2s',
  } as React.CSSProperties,
  connectedInfo: {
    background: 'white',
    padding: '15px',
    borderRadius: '6px',
    border: '1px solid #27ae60',
    marginTop: '15px',
  } as React.CSSProperties,
  connectedText: {
    margin: '0 0 12px 0',
    color: '#27ae60',
    fontSize: '14px',
  } as React.CSSProperties,
  errorMessage: {
    background: '#f8d7da',
    color: '#721c24',
    border: '1px solid #f5c6cb',
    borderRadius: '6px',
    padding: '12px',
    marginBottom: '15px',
    fontSize: '14px',
  } as React.CSSProperties,
  successMessage: {
    background: '#d4edda',
    color: '#155724',
    border: '1px solid #c3e6cb',
    borderRadius: '6px',
    padding: '12px',
    marginBottom: '15px',
    fontSize: '14px',
  } as React.CSSProperties,
  storiesFetchSection: {
    background: '#f0f8ff',
    border: '1px solid #d6e9ff',
    borderRadius: '6px',
    padding: '15px',
    marginTop: '15px',
    marginBottom: '15px',
  } as React.CSSProperties,
  projectFilterGroup: {
    marginBottom: '12px',
  } as React.CSSProperties,
  fetchStoriesBtn: {
    background: '#16a085',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%',
    transition: 'background-color 0.2s',
  } as React.CSSProperties,
  storiesContainer: {
    background: 'white',
    border: '1px solid #e1e8ed',
    borderRadius: '6px',
    padding: '15px',
    marginTop: '15px',
    marginBottom: '15px',
  } as React.CSSProperties,
  storiesTitle: {
    margin: '0 0 12px 0',
    fontSize: '14px',
    fontWeight: '600',
    color: '#2c3e50',
  } as React.CSSProperties,
  storiesList: {
    maxHeight: '300px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  } as React.CSSProperties,
  storyItem: {
    background: '#f8f9fa',
    border: '1px solid #e1e8ed',
    borderRadius: '6px',
    padding: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
  } as React.CSSProperties,
  storyKey: {
    fontWeight: '700',
    color: '#3498db',
    fontSize: '12px',
    minWidth: '70px',
    textAlign: 'center',
    background: '#e3f2fd',
    padding: '6px 8px',
    borderRadius: '4px',
  } as React.CSSProperties,
  storyContent: {
    flex: 1,
  } as React.CSSProperties,
  storySummary: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '4px',
    lineHeight: '1.4',
  } as React.CSSProperties,
  storyMeta: {
    display: 'flex',
    gap: '8px',
    fontSize: '11px',
  } as React.CSSProperties,
  storyType: {
    background: '#fff3cd',
    color: '#856404',
    padding: '2px 6px',
    borderRadius: '3px',
    fontWeight: '500',
  } as React.CSSProperties,
  storyStatus: {
    background: '#d4edda',
    color: '#155724',
    padding: '2px 6px',
    borderRadius: '3px',
    fontWeight: '500',
  } as React.CSSProperties,
  selectIcon: {
    fontSize: '18px',
    color: '#16a085',
    fontWeight: 'bold',
    alignSelf: 'center',
  } as React.CSSProperties,
}
