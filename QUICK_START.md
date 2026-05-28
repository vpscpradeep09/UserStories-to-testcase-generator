# Quick Start Guide - Testing Jira Integration

## ⚡ 5-Minute Setup & Test

### Prerequisites
- Node.js 16+ installed
- Two terminal windows open
- Your Jira credentials ready

### Step 1: Install Dependencies (if not done already)

**Terminal 1:**
```bash
cd backend
npm install
```

**Terminal 2:**
```bash
cd frontend
npm install
```

### Step 2: Start Backend Server

**Terminal 1:**
```bash
cd backend
npm run dev
```

Expected output:
```
🚀 Backend server running on port 8090
📡 API available at http://localhost:8090/api
🔍 Health check at http://localhost:8090/api/health
```

### Step 3: Start Frontend Server

**Terminal 2:**
```bash
cd frontend
npm run dev
```

Expected output:
```
VITE v8.0.13  ready in 123 ms

➜  Local:   http://localhost:5173/
```

### Step 4: Verify Setup

Open browser and go to: `http://localhost:5173`

You should see:
- ✅ Application title "User Story to Tests"
- ✅ **NEW**: "Jira Integration" section with "Connect Jira" button
- ✅ Form with Story Title, Description, Acceptance Criteria fields

## 🔑 Get Your Jira API Key

1. Go to: https://id.atlassian.com/manage-profile/security/api-tokens
2. Click "Create API token"
3. Name it: "Test Case Generator" (or your choice)
4. Copy the generated token
5. **Keep it safe** - you'll use it in the next step

## 🔗 Test Jira Connection

### With Valid Credentials

1. Click **"Connect Jira"** button in the UI
2. Fill in the form:
   - **Jira Base URL**: `https://your-company.atlassian.net`
   - **Email Address**: Your Jira email (e.g., name@company.com)
   - **Jira API Key**: The token from previous step
3. Click **"Test & Connect"**

Expected result:
- ✅ "Successfully connected to Jira!" message
- ✅ Green "✓ Connected" badge appears
- ✅ Form shows: "Connected to: email @ base-url"
- ✅ "Disconnect Jira" button appears

### With Invalid Credentials (Test Error Handling)

1. Click **"Connect Jira"** again
2. Enter invalid API key: "fake-key-123"
3. Click **"Test & Connect"**

Expected result:
- ❌ Error message: "Failed to authenticate with Jira. Please check your credentials."
- ❌ Form remains visible for correction

## 📝 Test API Endpoints

### Test Connection Status

Open new browser tab and paste:
```
http://localhost:8090/api/jira/status
```

Response when connected:
```json
{
  "connected": true,
  "message": "Jira is connected",
  "baseUrl": "https://your-company.atlassian.net",
  "email": "your-email@company.com"
}
```

### Test Getting a Jira Issue

Replace `PROJ-123` with actual issue key:
```
http://localhost:8090/api/jira/issue/PROJ-123
```

Response:
```json
{
  "success": true,
  "issue": {
    "key": "PROJ-123",
    "summary": "Issue Title",
    "description": "Issue description",
    "issueType": "Story",
    "status": "To Do"
  }
}
```

### Test Getting Stories

```
http://localhost:8090/api/jira/stories
```

or with project filter:
```
http://localhost:8090/api/jira/stories?projectKey=PROJ
```

Response:
```json
{
  "success": true,
  "total": 5,
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

## 🧪 Test Scenarios

### Scenario 1: Basic Connection Test
✅ **Objective**: Connect and disconnect from Jira
1. Click "Connect Jira"
2. Enter valid credentials
3. Verify connection success
4. Click "Disconnect Jira"
5. Verify form resets

**Expected**: Smooth transitions, no errors

### Scenario 2: Credential Validation
✅ **Objective**: Test form validation
1. Click "Connect Jira"
2. Leave all fields empty
3. Click "Test & Connect"
4. Verify error: "All fields are required"
5. Fill only Base URL
6. Verify same error
7. Fill all fields correctly

**Expected**: Proper validation messages

### Scenario 3: Connection Persistence
✅ **Objective**: Test connection state
1. Connect to Jira (valid credentials)
2. Refresh browser (F5)
3. Verify connection status is checked

**Expected**: Status checked on page load

### Scenario 4: Error Handling
✅ **Objective**: Test error messages
1. Connect to Jira successfully
2. Disconnect
3. Try invalid API key
4. Verify clear error message
5. Correct the key
6. Reconnect

**Expected**: Clear, helpful error messages

### Scenario 5: UI Integration
✅ **Objective**: Verify Jira component fits with existing UI
1. Check component styling
2. Verify responsive on different screen sizes
3. Check alignment with form fields
4. Verify no layout shifts

**Expected**: Seamless integration

## 🐛 Debugging Tips

### Issue: Backend not connecting
**Check**:
1. Is backend running on port 8090?
2. Is Jira instance accessible from your network?
3. Check browser console for network errors
4. Check backend console for error logs

**Solution**:
```bash
# Verify health check works
curl http://localhost:8090/api/health

# Check backend is running
netstat -ano | findstr :8090  # Windows
lsof -i :8090  # macOS/Linux
```

### Issue: "Connect button not showing"
**Check**:
1. Frontend compiled successfully
2. No TypeScript errors
3. Browser cache (hard refresh: Ctrl+Shift+R)

**Solution**:
```bash
# Clear cache and restart
cd frontend
npm run dev
```

### Issue: CORS errors in browser console
**Check**:
1. Backend CORS configuration
2. Frontend API URL

**Solution**:
Verify in `backend/src/server.ts`:
```typescript
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}))
```

### Issue: "Failed to connect" with correct credentials
**Check**:
1. Jira instance is accessible
2. API key hasn't expired
3. User has API access enabled
4. Network firewall isn't blocking

**Solution**:
1. Test API key directly: `curl -u email:apikey https://your-jira/rest/api/3/myself`
2. Regenerate API key if unsure
3. Check Jira audit logs for login attempts

## 📊 Testing Checklist

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] "Jira Integration" section visible on page
- [ ] "Connect Jira" button is clickable
- [ ] Form expands when button clicked
- [ ] Form validation works (empty fields)
- [ ] Valid credentials connect successfully
- [ ] Success message appears
- [ ] Connected badge displays
- [ ] Email and Base URL shown in connected state
- [ ] "Disconnect Jira" button appears
- [ ] Disconnect clears connection
- [ ] Invalid credentials show error
- [ ] Error message is clear
- [ ] Form can be corrected after error
- [ ] API status endpoint works
- [ ] Can fetch issues via API
- [ ] Can fetch stories via API
- [ ] Component styling matches UI theme
- [ ] Responsive on mobile view

## 🎯 What's Working Now

✅ Jira connection component with full UI
✅ Credential validation
✅ Connection testing
✅ Status checking
✅ Error handling
✅ Disconnect functionality
✅ All backend endpoints
✅ API documentation

## 🚀 Next Steps After Testing

1. **Integration with Form**
   - Auto-fetch issue details when issue key entered
   - Auto-populate form fields from Jira issue

2. **Story Selector**
   - Dropdown to browse Jira stories
   - Click to populate form

3. **Data Persistence**
   - Store credentials securely
   - Add database integration

4. **Advanced Features**
   - Sync test results back to Jira
   - Create test issues
   - Link test cases to stories

## 📞 Support & Documentation

- **Jira Integration Guide**: See `JIRA_INTEGRATION.md`
- **Implementation Details**: See `IMPLEMENTATION_SUMMARY.md`
- **UI/UX Changes**: See `UI_CHANGES.md`
- **Main README**: See `README.md`

## 💾 Environment Variables

Ensure your `.env` file has:
```bash
# Server Configuration
PORT=8090
CORS_ORIGIN=http://localhost:5173

# Groq API Configuration
groq_API_BASE=https://api.groq.com/openai/v1
groq_API_KEY=your_groq_api_key_here
groq_MODEL=openai/gpt-oss-120b

# Note: Jira credentials are entered via UI
# They are stored in memory, not in .env
```

---

**Happy Testing!** 🎉

If you encounter any issues, check the debugging tips section or review the full documentation files.
