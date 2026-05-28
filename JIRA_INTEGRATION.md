# Jira Integration Guide

## Overview

The User Story to Test Case Generator now integrates with Jira, allowing you to:
- Connect to your Jira instance using credentials
- Fetch user stories directly from Jira
- Manage Jira connections securely
- Pre-populate form data from Jira issues

## Setup Instructions

### Prerequisites
- Jira Cloud Account or Jira Server/Data Center instance
- Jira API Key (for Cloud instances)
- Jira Base URL (e.g., `https://your-company.atlassian.net`)
- Email address associated with your Jira account

### Getting Your Jira API Key

For **Jira Cloud**:
1. Go to https://id.atlassian.com/manage-profile/security/api-tokens
2. Click "Create API token"
3. Give it a descriptive name (e.g., "Test Case Generator")
4. Copy the generated token securely
5. Use this token in the "Connect Jira" form

For **Jira Server/Data Center**:
- Use your Jira password or generate an API token if available

## Frontend Features

### Connect Jira Button
Located at the top of the application, this button allows you to:
- Enter your Jira Base URL
- Enter your email address
- Enter your Jira API Key
- Test the connection before saving

### Connection Status
Once connected, the interface displays:
- ✓ Connected badge
- Your Jira email and base URL
- Disconnect button to remove credentials

### Error Handling
Clear error messages are displayed if:
- Invalid credentials are provided
- Connection cannot be established
- Required fields are missing

## Backend API Endpoints

### 1. Connect to Jira
**POST** `/api/jira/connect`

Request body:
```json
{
  "baseUrl": "https://your-company.atlassian.net",
  "email": "your-email@example.com",
  "apiKey": "your-jira-api-key"
}
```

Response:
```json
{
  "success": true,
  "message": "Successfully connected to Jira",
  "credentials": {
    "baseUrl": "https://your-company.atlassian.net",
    "email": "your-email@example.com"
  }
}
```

### 2. Get Connection Status
**GET** `/api/jira/status`

Response:
```json
{
  "connected": true,
  "message": "Jira is connected",
  "baseUrl": "https://your-company.atlassian.net",
  "email": "your-email@example.com"
}
```

### 3. Get Jira Issue
**GET** `/api/jira/issue/{issueKey}`

Example: `/api/jira/issue/PROJ-123`

Response:
```json
{
  "success": true,
  "issue": {
    "key": "PROJ-123",
    "summary": "User Story Title",
    "description": "Story description",
    "issueType": "Story",
    "status": "In Progress"
  }
}
```

### 4. Get Jira Stories
**GET** `/api/jira/stories?projectKey=PROJ`

Query Parameters:
- `projectKey` (optional): Filter stories by project key

Response:
```json
{
  "success": true,
  "total": 10,
  "stories": [
    {
      "key": "PROJ-123",
      "summary": "User Story Title",
      "description": "Story description",
      "issueType": "Story",
      "status": "In Progress"
    }
  ]
}
```

### 5. Disconnect Jira
**POST** `/api/jira/disconnect`

Response:
```json
{
  "success": true,
  "message": "Successfully disconnected from Jira"
}
```

## Security Considerations

### Current Implementation
- Credentials are stored in memory (session-based)
- API Key is sent only over HTTPS (in production)
- Credentials are not logged or persisted to disk by default

### Future Enhancements
- Encrypted credential storage in database
- OAuth2 integration for better security
- Credential rotation and expiration
- Audit logging for all Jira operations

## Troubleshooting

### Connection Failed
**Error:** "Failed to authenticate with Jira. Please check your credentials."

**Solutions:**
1. Verify your Jira Base URL format (should include https://)
2. Confirm your email address matches your Jira account
3. Verify your API Key is correct and hasn't expired
4. Check if your Jira instance is accessible from your network

### Issue Not Found
**Error:** "Failed to fetch Jira issue"

**Solutions:**
1. Verify the issue key exists in your Jira instance
2. Ensure you have permission to view the issue
3. Check the issue key spelling

### Stories Not Loading
**Error:** "Failed to fetch Jira stories"

**Solutions:**
1. Verify your project key is correct
2. Ensure you have permission to view stories in that project
3. Check your API Key permissions

## Usage Workflow

1. **Connect Jira**
   - Click "Connect Jira" button
   - Enter your Jira credentials
   - Click "Test & Connect"

2. **Fetch Stories** (future enhancement)
   - Browse available stories from Jira
   - Select a story to populate form data

3. **Generate Tests**
   - Form is pre-populated with Jira story data
   - Click "Generate Test Cases" or "Generate Feature File"
   - Review and export results

## API Documentation

For detailed API documentation, see:
- [Jira Cloud REST API](https://developer.atlassian.com/cloud/jira/platform/rest/v3/)
- [Jira Server REST API](https://docs.atlassian.com/software/jira/docs/api/REST/latest/)

## Example: Integration Workflow

```typescript
// Frontend example
import { connectToJira, getJiraStories, getJiraIssue } from './api'

// Step 1: Connect to Jira
const connectionResult = await connectToJira({
  baseUrl: 'https://your-company.atlassian.net',
  email: 'your-email@example.com',
  apiKey: 'your-api-key'
})

// Step 2: Fetch stories
const stories = await getJiraStories('PROJECT-KEY')

// Step 3: Get specific issue
const issue = await getJiraIssue('PROJECT-123')

// Step 4: Use data to populate form
setFormData({
  storyTitle: issue.summary,
  description: issue.description,
  acceptanceCriteria: 'AC from story',
  additionalInfo: ''
})
```

## Future Enhancements

- [ ] Automatic story data population in form
- [ ] Create test results as Jira issues
- [ ] Link test cases to original stories
- [ ] Support for multiple Jira instances
- [ ] OAuth2 integration
- [ ] Encrypted credential storage
- [ ] Test execution tracking in Jira
