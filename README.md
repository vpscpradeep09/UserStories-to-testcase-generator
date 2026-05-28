# User Story to Test Case Generator

A full-stack application that automatically generates test cases and Gherkin feature files from user stories using AI-powered analysis. This tool leverages the Groq API to intelligently convert acceptance criteria into comprehensive test scenarios.

## Features

- **AI-Powered Test Case Generation**: Automatically generate test cases from user story acceptance criteria
- **Gherkin Feature File Generation**: Create BDD-style `.feature` files with scenarios and steps
- **Real-time Processing**: Fast response times with Groq API integration
- **User-Friendly Interface**: Clean React-based UI for input and results
- **Full-Stack TypeScript**: Type-safe code across frontend and backend
- **RESTful API**: Well-documented API endpoints for integration
- **Jira Integration**: Connect your Jira instance to manage user stories seamlessly

## Tech Stack

### Backend
- **Framework**: Express.js (Node.js)
- **Language**: TypeScript
- **Runtime**: Node.js
- **API Client**: node-fetch
- **Validation**: Zod
- **CORS**: Enabled for frontend communication
- **Environment**: dotenv for configuration

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: CSS (customizable)
- **Package Manager**: npm

### External Services
- **LLM Provider**: Groq API (OpenAI-compatible)
- **Model**: openai/gpt-oss-120b

## Prerequisites

- **Node.js** 16+ and npm
- **Groq API Key** (Get it from [console.groq.com](https://console.groq.com))
- **Git** (optional, for version control)

## Installation

### 1. Clone or Extract the Repository
```bash
cd user-story-to-tests
```

### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

## Environment Configuration

### Create `.env` File

Create a `.env` file in the root directory of the project (same level as `backend/` and `frontend/` folders):

```bash
# Server Configuration
PORT=8090
CORS_ORIGIN=http://localhost:5173

# Groq API Configuration
groq_API_BASE=https://api.groq.com/openai/v1
groq_API_KEY=your_groq_api_key_here
groq_MODEL=openai/gpt-oss-120b
```

**Environment Variables Explanation**:
- `PORT`: Port on which the backend server runs (default: 8090)
- `CORS_ORIGIN`: Frontend URL for CORS policy (default: http://localhost:5173 for Vite dev server)
- `groq_API_BASE`: Groq API endpoint
- `groq_API_KEY`: Your Groq API key (obtain from Groq console)
- `groq_MODEL`: LLM model to use for generation

## Running the Project

### Option 1: Run Backend and Frontend Separately

**Terminal 1 - Start Backend Server**:
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:8090`

**Terminal 2 - Start Frontend Dev Server**:
```bash
cd frontend
npm run dev
```
Frontend will be available at `http://localhost:5173`

### Option 2: Production Build

**Build Backend**:
```bash
cd backend
npm run build
npm start
```

**Build Frontend**:
```bash
cd frontend
npm run build
npm run preview
```

## API Documentation

### 1. Health Check
```http
GET /api/health
```
**Response**:
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 2. Generate Test Cases
```http
POST /api/generate-tests
Content-Type: application/json
```
**Request Body**:
```json
{
  "storyTitle": "User Login Functionality",
  "acceptanceCriteria": "User should be able to login with valid credentials",
  "description": "As a user, I want to login to the system",
  "additionalInfo": "Must support email and password"
}
```

**Response**:
```json
{
  "testCases": [
    {
      "id": "TC_001",
      "title": "Valid Login",
      "steps": [
        "Navigate to login page",
        "Enter valid email",
        "Enter valid password",
        "Click login button"
      ],
      "expectedResult": "User should be logged in successfully"
    }
  ],
  "summary": "Generated 5 test cases from user story"
}
```

### 3. Generate Feature File
```http
POST /api/generate-feature-file
Content-Type: application/json
```
**Request Body**:
```json
{
  "storyTitle": "User Login Functionality",
  "acceptanceCriteria": "User should be able to login with valid credentials",
  "description": "As a user, I want to login to the system",
  "additionalInfo": "Must support email and password"
}
```

**Response**:
```json
{
  "featureFileContent": "Feature: User Login Functionality\n  ...",
  "scenarios": [
    {
      "name": "Valid Login with Correct Credentials",
      "givenSteps": ["User is on the login page"],
      "whenSteps": ["User enters valid email and password"],
      "thenSteps": ["User should be logged in successfully"]
    }
  ]
}
```

## Jira Integration

This application now supports Jira integration! Connect your Jira instance to:
- Connect to your Jira instance with secure credentials
- **NEW**: Fetch user stories directly from Jira
- **NEW**: Auto-populate form fields by selecting a story
- Manage user stories and validate credentials

### Quick Start with Jira

1. **Connect to Jira**:
   - Click the "Connect Jira" button in the UI
   - Enter your Jira Base URL, email, and API key
   - Click "Test & Connect" to verify credentials

2. **Fetch User Stories** (NEW):
   - Once connected, click "📋 Fetch User Stories"
   - Optionally filter by Project Key
   - Select a story to auto-populate the form
   - Generate test cases!

3. **Get Your Jira API Key**:
   - For Jira Cloud: https://id.atlassian.com/manage-profile/security/api-tokens
   - For Jira Server: Use your password or generate an API token

### Jira API Endpoints

All Jira endpoints require a prior successful connection via the connect endpoint.

- **POST** `/api/jira/connect` - Connect to your Jira instance
- **GET** `/api/jira/status` - Check connection status
- **GET** `/api/jira/issue/{issueKey}` - Fetch a specific issue
- **GET** `/api/jira/stories` - Fetch all user stories
- **POST** `/api/jira/disconnect` - Disconnect from Jira

### Documentation

For detailed Jira integration documentation:
- **Setup & Features**: [JIRA_INTEGRATION.md](./JIRA_INTEGRATION.md)
- **Fetch Stories Feature**: [FETCH_STORIES_GUIDE.md](./FETCH_STORIES_GUIDE.md)
- **Quick Start**: [QUICK_START.md](./QUICK_START.md)

## Implementation & Architecture

### System Architecture

The application follows a **client-server architecture** with clear separation of concerns:

```
┌─────────────────┐                    ┌──────────────────┐
│  React Frontend │  ◄─HTTP/JSON──►   │ Express Backend  │
│  (Vite)         │  (REST API)       │  (TypeScript)    │
└─────────────────┘                    └──────────────────┘
                                                │
                                                │
                                       ┌────────▼────────┐
                                       │  Groq API       │
                                       │  (LLM Service)  │
                                       └─────────────────┘
```

### Data Flow

#### Test Case Generation Flow

1. **Frontend Layer**:
   - User enters story details (title, acceptance criteria, description)
   - React component state manages form data using `useState` hook
   - User clicks "Generate Test Cases" button

2. **API Call**:
   - Frontend calls `generateTests()` function from `api.ts`
   - Sends HTTP POST request to `/api/generate-tests` endpoint
   - Request body contains `GenerateRequest` object with user input

3. **Backend Validation**:
   - Express router in `generate.ts` receives request
   - Zod schema (`GenerateRequestSchema`) validates input:
     - Ensures storyTitle and acceptanceCriteria are not empty
     - Allows optional description and additionalInfo
   - Returns 400 error if validation fails

4. **Prompt Engineering**:
   - Valid request passed to `buildPrompt()` function in `prompt.ts`
   - Creates user prompt by formatting story details
   - Combines with `SYSTEM_PROMPT` which instructs AI to act as a QA engineer
   - System prompt defines exact JSON schema expected from AI

5. **LLM API Call**:
   - `GroqClient` class in `llm/groqClient.ts` handles Groq API communication
   - Sends HTTP POST to `https://api.groq.com/openai/v1/chat/completions`
   - Request includes:
     - System prompt (role definition and instructions)
     - User prompt (actual story details)
     - Temperature: 0.2 (low randomness for consistent output)
     - Model: `openai/gpt-oss-120b` (Groq's open-source model)
   - Authorization via Bearer token (Groq API key)

6. **Response Processing**:
   - Groq API returns JSON with AI-generated test cases
   - Backend extracts content from response
   - Validates response against `GenerateResponseSchema`:
     - Must contain array of test cases
     - Each case must have: id, title, steps array, expectedResult, category
   - Attaches token usage info (prompt_tokens, completion_tokens)
   - Returns 502 error if LLM response invalid

7. **Frontend Display**:
   - Frontend receives validated JSON response
   - React component updates state with test cases
   - Renders collapsible test case cards
   - Displays step-by-step test details

#### Feature File Generation Flow

Same flow as above, but:
- Uses `/api/generate-feature-file` endpoint
- Uses `FEATURE_FILE_SYSTEM_PROMPT` (BDD expert instructions)
- Uses `buildFeatureFilePrompt()` for user prompt
- Validates against `GenerateFeatureFileResponseSchema`
- Returns Gherkin-formatted scenarios with Given/When/Then steps

### Key Implementation Details

#### Backend Request Validation
```typescript
// All requests validated with Zod schemas
const validationResult = GenerateRequestSchema.safeParse(req.body)
if (!validationResult.success) {
  // Return detailed validation error
}
```

#### Prompt Engineering
- **System Prompt**: Instructs AI to act as QA engineer/BDD expert and return only JSON
- **User Prompt**: Structured template with story title, acceptance criteria, description, and additional info
- **Schema Definition**: JSON schema embedded in system prompt ensures AI outputs valid format

#### Type Safety
- TypeScript interfaces for all data structures
- Zod schemas for runtime validation
- Type inference from schemas (`z.infer<typeof Schema>`)
- Full end-to-end type safety from frontend to backend

#### Error Handling
- **Validation Errors**: 400 status with detailed messages
- **LLM Errors**: 502 status when Groq API fails
- **Format Errors**: 502 status if AI returns invalid JSON
- **Server Errors**: 500 status for unexpected errors
- Console logging for debugging in development

### Technology Decisions

| Aspect | Technology | Reason |
|--------|-----------|--------|
| Backend Framework | Express.js | Lightweight, widely-used, good middleware support |
| Validation | Zod | Runtime type safety, excellent error messages |
| LLM Provider | Groq API | Fast inference, OpenAI-compatible API, generous free tier |
| Frontend Framework | React | Component-based, hooks for state management |
| Build Tool | Vite | Fast development experience, optimized production builds |
| Language | TypeScript | Type safety, better developer experience, fewer bugs |

## Project Structure

```
user-story-to-tests/
├── backend/
│   ├── src/
│   │   ├── server.ts                 # Express server setup, middleware, routes
│   │   ├── prompt.ts                 # System prompts and prompt builders
│   │   ├── schemas.ts                # Zod validation schemas (request/response)
│   │   ├── routes/
│   │   │   ├── generate.ts           # POST /api/generate-tests endpoint
│   │   │   └── feature.ts            # POST /api/generate-feature-file endpoint
│   │   └── llm/
│   │       └── groqClient.ts         # Groq API HTTP client, chat completion
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── App.tsx                   # Main React component, form and results UI
│   │   ├── api.ts                    # HTTP client functions for backend calls
│   │   ├── types.ts                  # TypeScript interfaces and type definitions
│   │   ├── main.tsx                  # React DOM render entry point
│   │   └── vite-env.d.ts            # Vite environment type definitions
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── README.md
├── .env                              # Environment configuration (git ignored)
└── README.md                          # This file
```

## Usage Guide

### Step 1: Enter User Story Details
1. Open the application at `http://localhost:5173`
2. Fill in the following fields:
   - **Story Title**: Brief title of the user story
   - **Acceptance Criteria**: Specific criteria the story must meet
   - **Description**: Detailed description of the feature
   - **Additional Info**: Any extra context or requirements

### Step 2: Generate Test Cases
1. Click the "Generate Test Cases" button
2. Wait for the AI to process and generate test cases
3. Review the generated test cases in the results panel
4. Each test case includes steps and expected results

### Step 3: Generate Feature File
1. Click the "Generate Feature File" button
2. The system will create a Gherkin-formatted feature file
3. Review the scenarios in the results panel
4. Copy the feature file content for use in your BDD framework

## Available Scripts

### Backend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run compiled server
- `npm run typecheck` - Check TypeScript types without building

### Frontend
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run typecheck` - Check TypeScript types

## Error Handling

The application includes comprehensive error handling:

- **Validation Errors**: Invalid input will show appropriate error messages
- **API Errors**: Network or API failures are caught and displayed
- **Server Errors**: Detailed error logs in development, generic messages in production

## Performance Considerations

- The Groq API provides fast inference times (typically 2-5 seconds)
- Large acceptance criteria may take longer to process
- Frontend uses React hooks for efficient state management
- Backend supports request bodies up to 10MB

## Troubleshooting

### Backend Won't Start
- Ensure `.env` file is in the root directory (same level as `backend/` and `frontend/` folders)
- Check that `PORT` is not already in use
- Verify Node.js version: `node --version` (should be 16+)

### Frontend Won't Connect to Backend
- Ensure backend is running on port 8090
- Check that `CORS_ORIGIN` in `.env` matches your frontend URL
- Clear browser cache if needed

### API Key Errors
- Verify your Groq API key is correct and not expired
- Check that `groq_API_BASE` is set to the correct endpoint
- Ensure the API key has sufficient quotas

### Generation Times Out
- Check your internet connection
- Verify Groq API status
- Try with shorter acceptance criteria

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

This project is provided as-is for educational and commercial use.

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the API documentation
3. Check environment configuration
4. Review console logs for error messages

## Future Enhancements

- [ ] Support for additional LLM providers
- [ ] Test case export to various formats (CSV, Excel, JSON)
- [ ] Integration with test management tools
- [ ] User authentication and workspace management
- [ ] Test case templates and customization
- [ ] Batch processing for multiple user stories
- [ ] Automated test case execution integration

---

**Version**: 1.0.0  
**Last Updated**: January 2024  
**Maintainer**: Your Name