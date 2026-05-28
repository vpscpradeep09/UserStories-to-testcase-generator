# 📱 Fetch Stories Feature - Visual Guide

## 🎨 UI Layout & Components

---

## Before: Connected State (Original)

```
┌──────────────────────────────────────────────┐
│ Jira Integration              Connected ✓    │
├──────────────────────────────────────────────┤
│                                              │
│  Connected to:                               │
│  user@company.com @                          │
│  https://company.atlassian.net               │
│                                              │
│  [Disconnect Jira]                           │
│                                              │
└──────────────────────────────────────────────┘
```

---

## After: Connected State (New)

```
┌──────────────────────────────────────────────────────┐
│ Jira Integration                      Connected ✓    │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Connected to:                                       │
│  user@company.com @                                  │
│  https://company.atlassian.net                       │
│                                                      │
│ ┌──────────────────────────────────────────────┐    │
│ │ Project Key (optional)                       │    │ ← NEW
│ │ [____________________________]                │    │
│ │ Leave empty to fetch all stories             │    │
│ │                                              │    │
│ │ [📋 Fetch User Stories]                      │    │ ← NEW BUTTON
│ └──────────────────────────────────────────────┘    │
│                                                      │
│ ┌──────────────────────────────────────────────┐    │
│ │ Available Stories (5)                        │    │ ← NEW LIST
│ ├──────────────────────────────────────────────┤    │
│ │                                              │    │
│ │ [PROJ-123] User Login Feature                │    │ ← NEW ITEM
│ │ Story | In Progress                    [→]  │    │
│ │                                              │    │
│ │ [PROJ-124] Payment Processing               │    │
│ │ Story | To Do                          [→]  │    │
│ │                                              │    │
│ │ [PROJ-125] Email Notifications              │    │
│ │ Epic | In Progress                     [→]  │    │
│ │                                              │    │
│ │ [PROJ-126] Database Migration               │    │
│ │ Task | In Progress                     [→]  │    │
│ │                                              │    │
│ │ [PROJ-127] API Documentation                │    │
│ │ Story | To Do                          [→]  │    │
│ │                                              │    │
│ └──────────────────────────────────────────────┘    │
│                                                      │
│  [Disconnect Jira]                                   │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## Story Item Details

### Normal State (Unselected)
```
┌──────────────────────────────────────────────┐
│ PROJ-123 │ User Login Feature                │
│ (Blue)   │ Story | In Progress         [→]   │
└──────────────────────────────────────────────┘
  ↑        ↑                               ↑
  Issue    Summary & Meta                 Hover
  Key      Information                    Effect
```

### Components
```
[PROJ-123]     User Login Feature     Story    In Progress    [→]
   ↓                  ↓                 ↓           ↓          ↓
Issue Key          Summary            Type      Status     Select
(Badge)            (Bold)           (Yellow)   (Green)     Arrow
Blue Bg            Dark Gray         Badge      Badge      (Teal)
```

### Color Scheme
```
Issue Key Badge:
┌─────────────┐
│  PROJ-123   │  Background: #e3f2fd (Light Blue)
│             │  Color: #3498db (Blue)
└─────────────┘

Type Badge:
┌──────────┐
│  Story   │  Background: #fff3cd (Light Yellow)
│          │  Color: #856404 (Dark Yellow)
└──────────┘

Status Badge:
┌─────────────────┐
│  In Progress    │  Background: #d4edda (Light Green)
│                 │  Color: #155724 (Dark Green)
└─────────────────┘

Select Arrow:
[→]  Color: #16a085 (Teal), Size: 18px, Bold
```

---

## Workflow Visualization

### Step 1: Connected & Ready
```
┌──────────────────────────────────────┐
│ Jira Integration      Connected ✓    │
├──────────────────────────────────────┤
│                                      │
│ Connected to: user@company.com       │
│                                      │
│ Project Key: [_____________]         │
│                                      │
│ [📋 Fetch User Stories]  ← CLICK    │
│                                      │
│ [Disconnect Jira]                    │
└──────────────────────────────────────┘
```

### Step 2: Fetching Stories
```
┌──────────────────────────────────────┐
│ Jira Integration      Connected ✓    │
├──────────────────────────────────────┤
│                                      │
│ Connected to: user@company.com       │
│                                      │
│ Project Key: [_____________]         │
│                                      │
│ [📋 Fetching Stories...] ← LOADING  │
│                                      │
│ [Disconnect Jira]                    │
└──────────────────────────────────────┘
```

### Step 3: Stories Displayed
```
┌──────────────────────────────────────┐
│ Jira Integration      Connected ✓    │
├──────────────────────────────────────┤
│                                      │
│ Connected to: user@company.com       │
│                                      │
│ Project Key: [_____________]         │
│                                      │
│ [📋 Fetch User Stories]              │
│                                      │
│ Available Stories (5)                │
│ ┌────────────────────────────────┐  │
│ │ [PROJ-123] User Login   [→]    │  │
│ │ [PROJ-124] Payment      [→]    │  │
│ │ [PROJ-125] Email        [→]    │  │
│ └────────────────────────────────┘  │
│                                      │
│ [Disconnect Jira]                    │
└──────────────────────────────────────┘
```

### Step 4: Story Selected (Form Auto-Populated)
```
Left Side:                       Right Side:
┌────────────────────┐          ┌────────────────────┐
│ Jira Integration   │          │ User Story Form    │
│ Connected ✓        │          ├────────────────────┤
│                    │          │ Story Title        │
│ [Selected Story]   │  ──→     │ [User Login] ✅    │
│ PROJ-123           │          │                    │
│ User Login         │          │ Description        │
│ Story | In Progress│          │ [Long desc...] ✅  │
│                    │          │                    │
│ [Disconnect Jira]  │          │ Acceptance Criteria│
└────────────────────┘          │ [_____________]    │
                                │                    │
                                │ [Generate Tests]   │
                                └────────────────────┘
```

---

## Mobile Responsive View

### Mobile Layout
```
SMALL SCREEN (≤ 600px)

┌──────────────────────┐
│ Jira Integration  ✓  │
├──────────────────────┤
│                      │
│ Project Key          │
│ [______________]     │
│                      │
│ [📋 Fetch Stories]   │
│                      │
│ Available Stories    │
│                      │
│ ┌──────────────────┐ │
│ │ PROJ-123         │ │
│ │ User Login       │ │
│ │ Story | In Prog  │ │
│ │            [→]   │ │
│ └──────────────────┘ │
│                      │
│ ┌──────────────────┐ │
│ │ PROJ-124         │ │
│ │ Payment          │ │
│ │ Story | To Do    │ │
│ │            [→]   │ │
│ └──────────────────┘ │
│                      │
│ [Disconnect Jira]    │
└──────────────────────┘
```

### Tablet Layout
```
MEDIUM SCREEN (600px - 1024px)

┌──────────────────────────────────────┐
│ Jira Integration            Connected │
├──────────────────────────────────────┤
│                                      │
│ Project Key                          │
│ [______________________]             │
│ [📋 Fetch User Stories]              │
│                                      │
│ Available Stories (5)                │
│ ┌──────────────────────────────────┐ │
│ │ PROJ-123 │ User Login      [→]  │ │
│ │ PROJ-124 │ Payment Proc   [→]   │ │
│ │ PROJ-125 │ Email Notify   [→]   │ │
│ │ PROJ-126 │ Database Mig   [→]   │ │
│ │ PROJ-127 │ API Docs       [→]   │ │
│ └──────────────────────────────────┘ │
│                                      │
│ [Disconnect Jira]                    │
└──────────────────────────────────────┘
```

### Desktop Layout
```
LARGE SCREEN (> 1024px)

┌──────────────────────────────────────────────┐
│ Jira Integration                Connected ✓   │
├──────────────────────────────────────────────┤
│                                              │
│ Project Key (optional)                       │
│ [_________________________________]          │
│ Leave empty to fetch all stories             │
│                                              │
│ [📋 Fetch User Stories]                      │
│                                              │
│ Available Stories (5)                        │
│ ┌──────────────────────────────────────────┐ │
│ │ [PROJ-123] User Login Feature             │ │
│ │ Story | In Progress                  [→]  │ │
│ │                                           │ │
│ │ [PROJ-124] Payment Processing             │ │
│ │ Story | To Do                        [→]  │ │
│ │                                           │ │
│ │ [PROJ-125] Email Notifications            │ │
│ │ Epic | In Progress                   [→]  │ │
│ │                                           │ │
│ │ [PROJ-126] Database Migration             │ │
│ │ Task | In Progress                   [→]  │ │
│ │                                           │ │
│ │ [PROJ-127] API Documentation              │ │
│ │ Story | To Do                        [→]  │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│ [Disconnect Jira]                            │
└──────────────────────────────────────────────┘
```

---

## Interaction States

### Button States

#### Default State
```
[📋 Fetch User Stories]
Background: #16a085 (Teal)
Color: White
Cursor: Pointer
```

#### Hover State
```
[📋 Fetch User Stories]
Background: #117a65 (Darker Teal)
Color: White
Cursor: Pointer
Shadow: Subtle
```

#### Loading State
```
[📋 Fetching Stories...]
Background: #bdc3c7 (Gray - Disabled)
Color: White
Cursor: Not-allowed
Opacity: 0.6
```

#### Error State
```
Project Key: [invalid-key]
[📋 Fetch User Stories]

↓ (Click fetch)

[Error: Failed to fetch stories]
Background: #f8d7da (Light Red)
Color: #721c24 (Dark Red)
```

### Story Item States

#### Default
```
┌──────────────────────────────────────┐
│ PROJ-123 │ User Login          [→]  │
│ Story | In Progress                 │
└──────────────────────────────────────┘
Background: #f8f9fa (Light Gray)
```

#### Hover
```
┌──────────────────────────────────────┐
│ PROJ-123 │ User Login          [→]  │
│ Story | In Progress                 │
└──────────────────────────────────────┘
Background: #f0f4f8 (Slightly darker)
Cursor: Pointer
Box-shadow: Subtle shadow
```

#### Selected
```
┌──────────────────────────────────────┐
│ PROJ-123 │ User Login          [→]  │
│ Story | In Progress                 │
└──────────────────────────────────────┘
(Story disappears as list closes)
```

---

## Message States

### Loading Message
```
[📋 Fetching Stories...]
```

### Success Message
```
✓ Fetched 5 stories
Background: #d4edda (Light Green)
Color: #155724 (Dark Green)
Border: #c3e6cb (Green)
```

### Error Message
```
⚠️ Failed to fetch stories
Background: #f8d7da (Light Red)
Color: #721c24 (Dark Red)
Border: #f5c6cb (Red)
```

### Empty Result
```
✓ No stories found
Background: #d4edda (Light Green)
Color: #155724 (Dark Green)
```

---

## Animation Timeline

### Fetch Stories Click
```
T=0ms    User clicks button
         ↓
T=50ms   Button shows loading state
         ↓
T=100ms  Loading spinner appears
         ↓
T=500ms  API response received
         ↓
T=600ms  Stories list fades in
         ↓
T=700ms  Animation complete
```

### Story Selection Click
```
T=0ms    User clicks story
         ↓
T=50ms   Story highlights
         ↓
T=100ms  Parent receives callback
         ↓
T=150ms  Form updates
         ↓
T=200ms  Stories list fades out
         ↓
T=300ms  Animation complete
```

---

## Accessibility Features

### Keyboard Navigation
```
Tab:        Focus next element
Shift+Tab:  Focus previous element
Enter:      Click focused button/story
Escape:     Close stories list (future)
```

### ARIA Labels
```
- Button: aria-label="Fetch user stories"
- List: role="list"
- Items: role="listitem"
- Input: aria-label="Project key filter"
```

### Color Contrast
```
✓ All text meets WCAG AA standards
✓ Color not sole indicator (badges have text)
✓ Focus indicators visible
```

---

## Dark Mode Support (Future)

### Dark Theme Colors
```
Container: #2c3e50 (Dark Gray)
Background: #34495e (Darker Gray)
Text: #ecf0f1 (Light Text)
Badge: #3498db (Bright Blue)
Button: #16a085 (Teal - same)
```

---

**Visual Design**: Clean, modern, intuitive, accessible  
**User Experience**: Smooth, responsive, feedback-rich  
**Mobile Support**: Fully responsive across all screen sizes  

---

*UI Design: May 29, 2026*
*Status: Production Ready*
