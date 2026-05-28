# Fetch User Stories from Jira - Feature Guide

## ✨ New Feature: Fetch & Select Jira Stories

After connecting to Jira, you can now fetch user stories directly and populate the form automatically!

---

## 🎯 What's New

### Frontend Changes

#### 1. **Updated JiraConnection Component**
- Added "📋 Fetch User Stories" button (appears when connected)
- Optional "Project Key" filter field
- Stories list display with click-to-select functionality
- Story details preview (Issue Key, Summary, Type, Status)

#### 2. **Updated App Component**
- New `handleJiraStorySelected()` function
- Automatically populates form fields when story is selected:
  - **Story Title** ← Story Summary
  - **Description** ← Story Description
  - **Additional Info** ← Jira Key & Status

### Backend (Already Working)
- `GET /api/jira/stories` endpoint (existing)
- Query parameter support for project filtering

---

## 📖 How to Use

### Step 1: Connect to Jira
1. Click "Connect Jira" button
2. Enter credentials (Base URL, Email, API Key)
3. Click "Test & Connect"
4. See "Connected ✓" badge

### Step 2: Fetch Stories
1. In the "Jira Integration" section, you'll see:
   - **Project Key** field (optional)
   - **📋 Fetch User Stories** button

2. **To fetch all stories**: Just click "📋 Fetch User Stories"

3. **To fetch stories from specific project**:
   - Enter project key (e.g., "PROJ")
   - Click "📋 Fetch User Stories"

### Step 3: Select a Story
1. Click on any story in the list
2. Form fields auto-populate:
   - Story Title
   - Description
   - Additional Info (with Jira key and status)
3. Stories list closes automatically
4. Ready to generate test cases!

---

## 📊 UI Components

### Fetch Stories Section
```
┌─────────────────────────────────────────────┐
│ Project Key (optional)                      │
│ [e.g., PROJ                               ] │
│ Leave empty to fetch all stories            │
│                                             │
│ [📋 Fetch User Stories]                    │
└─────────────────────────────────────────────┘
```

### Stories List Display
```
┌─────────────────────────────────────────────┐
│ Available Stories (5)                       │
│                                             │
│ [PROJ-123] User Login Feature               │
│ Story | In Progress              [→]       │
│                                             │
│ [PROJ-124] Payment Processing               │
│ Story | To Do                    [→]       │
│                                             │
│ [PROJ-125] Email Notifications              │
│ Epic | In Progress               [→]       │
│                                             │
│ ... (scrollable list)                       │
└─────────────────────────────────────────────┘
```

---

## 🔄 Complete Workflow

```
1. CONNECT JIRA
   ↓
2. ENTER PROJECT KEY (optional)
   ↓
3. CLICK "FETCH USER STORIES"
   ↓
4. STORIES APPEAR IN LIST
   ↓
5. CLICK STORY TO SELECT
   ↓
6. FORM AUTO-POPULATES
   ↓
7. GENERATE TEST CASES
   ↓
8. DONE! 🎉
```

---

## 🛠️ Technical Details

### Frontend - JiraConnection.tsx

**New State Variables**:
```typescript
const [stories, setStories] = useState<JiraStory[]>([])
const [isLoadingStories, setIsLoadingStories] = useState<boolean>(false)
const [showStories, setShowStories] = useState<boolean>(false)
const [projectKey, setProjectKey] = useState<string>('')
```

**New Functions**:
```typescript
handleFetchStories()  // Fetches stories from Jira
handleStorySelect()   // Emits selected story to parent
```

**New Props**:
```typescript
onStorySelected?: (story: JiraStory) => void
```

### Frontend - App.tsx

**New Handler**:
```typescript
handleJiraStorySelected(story: any) {
  // Populates form with:
  // - storyTitle: story.summary
  // - description: story.description
  // - additionalInfo: "Jira Issue: ${key} | Status: ${status}"
}
```

### Backend - No Changes Needed
The existing `/api/jira/stories` endpoint handles everything!

---

## 📋 API Request Flow

### Request
```bash
GET /api/jira/stories?projectKey=PROJ
```

Query Parameters:
- `projectKey` (optional): Filter stories by project

### Response
```json
{
  "success": true,
  "total": 5,
  "stories": [
    {
      "key": "PROJ-123",
      "summary": "User Login Feature",
      "description": "Long description...",
      "issueType": "Story",
      "status": "In Progress"
    },
    ...
  ]
}
```

---

## 🎨 Styling Details

### New Colors
- Fetch Button: `#16a085` (Teal)
- Story List Background: `#f0f8ff` (Light Blue)
- Story Item: `#f8f9fa` (Light Gray)
- Issue Key Badge: `#e3f2fd` (Blue)
- Status Badge: `#d4edda` (Green)
- Type Badge: `#fff3cd` (Yellow)

### Interactive Elements
- Story items are clickable with cursor pointer
- Hover effect on story items
- Stories list scrollable (max height 300px)
- Loading state on button
- Success/error messages

---

## 🔍 Features Breakdown

| Feature | Status | Details |
|---------|--------|---------|
| Fetch Stories | ✅ | Get all or filtered stories |
| Project Filter | ✅ | Optional project key filter |
| Story Display | ✅ | Shows key, summary, type, status |
| Click to Select | ✅ | Auto-populate form |
| Loading State | ✅ | Button shows loading feedback |
| Error Handling | ✅ | Clear error messages |
| Success Feedback | ✅ | Shows count of fetched stories |

---

## 🚀 Usage Examples

### Example 1: Fetch All Stories
```
1. Connected to Jira ✓
2. Leave "Project Key" empty
3. Click "📋 Fetch User Stories"
4. See all stories from entire Jira instance
5. Click any story to select
```

### Example 2: Fetch Project-Specific Stories
```
1. Connected to Jira ✓
2. Enter "PROJ" in Project Key field
3. Click "📋 Fetch User Stories"
4. See only stories from PROJ project
5. Click to select
```

### Example 3: Auto-Populate Form
```
1. Fetch stories
2. Click story "PROJ-123: User Login"
3. Form auto-fills:
   - Title: "User Login"
   - Description: "Long description..."
   - Additional Info: "Jira Issue: PROJ-123 | Status: In Progress"
4. Ready to generate tests!
```

---

## ⚙️ Configuration

### Backend Configuration
No changes needed! Uses existing endpoint.

### Frontend Configuration
All functionality is built-in. No configuration required.

### Jira Requirements
- User must be connected to Jira first
- Sufficient permissions to view stories
- Project key (optional) must be valid

---

## 🐛 Troubleshooting

### Issue: "No stories found"
**Causes**:
- No stories exist in Jira
- Project key is invalid
- User lacks permissions

**Solution**:
- Verify project key exists
- Check user permissions in Jira
- Try without project filter

### Issue: "Failed to fetch stories"
**Causes**:
- Network error
- Connection dropped
- Backend error

**Solution**:
- Verify backend is running
- Check internet connection
- Reconnect to Jira

### Issue: Form not populating
**Causes**:
- Story selection failed
- Handler not connected

**Solution**:
- Check browser console for errors
- Verify App.tsx has onStorySelected callback
- Try selecting story again

---

## 📝 Code Changes Summary

### Files Modified
1. **frontend/src/JiraConnection.tsx** (updated)
   - Added story fetching UI
   - Added story selection logic
   - Added new styles

2. **frontend/src/App.tsx** (updated)
   - Added handleJiraStorySelected handler
   - Passed onStorySelected callback

### Files Unchanged
- backend/src/llm/jiraClient.ts ✓ (already has getStories)
- backend/src/routes/jira.ts ✓ (already has /stories endpoint)
- backend/src/server.ts ✓ (already registered routes)

---

## 🎯 Next Steps

### Enhancements to Consider
1. **Multiple Selection**: Select multiple stories
2. **Acceptance Criteria Extraction**: Auto-populate acceptance criteria from Jira
3. **Story Preview Modal**: Full story details in modal
4. **Search/Filter**: Search stories by text
5. **Story History**: Remember recently selected stories
6. **Batch Processing**: Generate tests for multiple stories

### Integration Ideas
- Export results back to Jira as test issue
- Link test cases to original stories
- Sync test status back to Jira
- Generate test subtasks

---

## ✅ Testing Checklist

- [ ] Backend running on 8090
- [ ] Frontend running on 5173
- [ ] Connected to Jira successfully
- [ ] "Fetch User Stories" button visible
- [ ] Fetch without project filter works
- [ ] Fetch with project filter works
- [ ] Stories list displays correctly
- [ ] Click story populates form
- [ ] Form fields auto-fill accurately
- [ ] Error messages show on failures
- [ ] Success message shows story count

---

## 📚 Related Documentation

- [JIRA_INTEGRATION.md](./JIRA_INTEGRATION.md) - Full Jira integration guide
- [QUICK_START.md](./QUICK_START.md) - Quick start testing guide
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Technical details

---

## 🎉 You're All Set!

You can now fetch Jira user stories and auto-populate the form. The feature integrates seamlessly with the existing test case generation workflow.

**Happy generating!** 🚀

---

*Updated: May 29, 2026*
*Feature: Fetch User Stories from Jira*
