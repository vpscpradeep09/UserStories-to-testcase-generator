import { useState } from 'react'
import { generateTests, generateFeatureFile } from './api'
import { GenerateRequest, GenerateResponse, TestCase, GenerateFeatureFileResponse, Scenario } from './types'

function App() {
  const [formData, setFormData] = useState<GenerateRequest>({
    storyTitle: '',
    acceptanceCriteria: '',
    description: '',
    additionalInfo: ''
  })
  const [results, setResults] = useState<GenerateResponse | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [expandedTestCases, setExpandedTestCases] = useState<Set<string>>(new Set())
  const [featureFileResults, setFeatureFileResults] = useState<GenerateFeatureFileResponse | null>(null)
  const [isLoadingFeatureFile, setIsLoadingFeatureFile] = useState<boolean>(false)
  const [expandedScenarios, setExpandedScenarios] = useState<Set<string>>(new Set())

  const toggleTestCaseExpansion = (testCaseId: string) => {
    const newExpanded = new Set(expandedTestCases)
    if (newExpanded.has(testCaseId)) {
      newExpanded.delete(testCaseId)
    } else {
      newExpanded.add(testCaseId)
    }
    setExpandedTestCases(newExpanded)
  }

  const toggleScenarioExpansion = (scenarioName: string) => {
    const newExpanded = new Set(expandedScenarios)
    if (newExpanded.has(scenarioName)) {
      newExpanded.delete(scenarioName)
    } else {
      newExpanded.add(scenarioName)
    }
    setExpandedScenarios(newExpanded)
  }

  const handleInputChange = (field: keyof GenerateRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.storyTitle.trim() || !formData.acceptanceCriteria.trim()) {
      setError('Story Title and Acceptance Criteria are required')
      return
    }

    setIsLoading(true)
    setError(null)
    
    try {
      const response = await generateTests(formData)
      setResults(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate tests')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateFeatureFile = async () => {
    if (!formData.storyTitle.trim() || !formData.acceptanceCriteria.trim()) {
      setError('Story Title and Acceptance Criteria are required')
      return
    }

    setIsLoadingFeatureFile(true)
    setError(null)
    
    try {
      const response = await generateFeatureFile(formData)
      setFeatureFileResults(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate feature file')
    } finally {
      setIsLoadingFeatureFile(false)
    }
  }

  return (
    <div>
      <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          background-color: #f5f5f5;
          color: #333;
          line-height: 1.6;
        }
        
        .container {
          max-width: 95%;
          width: 100%;
          margin: 0 auto;
          padding: 20px;
          min-height: 100vh;
        }
        
        @media (min-width: 768px) {
          .container {
            max-width: 90%;
            padding: 30px;
          }
        }
        
        @media (min-width: 1024px) {
          .container {
            max-width: 85%;
            padding: 40px;
          }
        }
        
        @media (min-width: 1440px) {
          .container {
            max-width: 1800px;
            padding: 50px;
          }
        }
        
        .header {
          text-align: center;
          margin-bottom: 40px;
        }
        
        .title {
          font-size: 2.5rem;
          color: #2c3e50;
          margin-bottom: 10px;
        }
        
        .subtitle {
          color: #666;
          font-size: 1.1rem;
        }
        
        .form-container {
          background: white;
          border-radius: 8px;
          padding: 30px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          margin-bottom: 30px;
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        
        .form-label {
          display: block;
          font-weight: 600;
          margin-bottom: 8px;
          color: #2c3e50;
        }
        
        .form-input, .form-textarea {
          width: 100%;
          padding: 12px;
          border: 2px solid #e1e8ed;
          border-radius: 6px;
          font-size: 14px;
          transition: border-color 0.2s;
        }
        
        .form-input:focus, .form-textarea:focus {
          outline: none;
          border-color: #3498db;
        }
        
        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }
        
        .submit-btn {
          background: #3498db;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
          margin-right: 12px;
        }
        
        .submit-btn:hover:not(:disabled) {
          background: #2980b9;
        }
        
        .submit-btn:disabled {
          background: #bdc3c7;
          cursor: not-allowed;
        }

        .feature-file-btn {
          background: #27ae60;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .feature-file-btn:hover:not(:disabled) {
          background: #229954;
        }
        
        .feature-file-btn:disabled {
          background: #bdc3c7;
          cursor: not-allowed;
        }

        .button-group {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        
        .error-banner {
          background: #e74c3c;
          color: white;
          padding: 15px;
          border-radius: 6px;
          margin-bottom: 20px;
        }
        
        .loading {
          text-align: center;
          padding: 40px;
          color: #666;
          font-size: 18px;
        }
        
        .results-container {
          background: white;
          border-radius: 8px;
          padding: 30px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .results-header {
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 2px solid #e1e8ed;
        }
        
        .results-title {
          font-size: 1.8rem;
          color: #2c3e50;
          margin-bottom: 10px;
        }
        
        .results-meta {
          color: #666;
          font-size: 14px;
        }
        
        .table-container {
          overflow-x: auto;
        }
        
        .results-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        
        .results-table th,
        .results-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #e1e8ed;
        }
        
        .results-table th {
          background: #f8f9fa;
          font-weight: 600;
          color: #2c3e50;
        }
        
        .results-table tr:hover {
          background: #f8f9fa;
        }
        
        .category-positive { color: #27ae60; font-weight: 600; }
        .category-negative { color: #e74c3c; font-weight: 600; }
        .category-edge { color: #f39c12; font-weight: 600; }
        .category-authorization { color: #9b59b6; font-weight: 600; }
        .category-non-functional { color: #34495e; font-weight: 600; }
        
        .test-case-id {
          cursor: pointer;
          color: #3498db;
          font-weight: 600;
          padding: 8px 12px;
          border-radius: 4px;
          transition: background-color 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        
        .test-case-id:hover {
          background: #f8f9fa;
        }
        
        .test-case-id.expanded {
          background: #e3f2fd;
          color: #1976d2;
        }
        
        .expand-icon {
          font-size: 10px;
          transition: transform 0.2s;
        }
        
        .expand-icon.expanded {
          transform: rotate(90deg);
        }
        
        .expanded-details {
          margin-top: 15px;
          background: #fafbfc;
          border: 1px solid #e1e8ed;
          border-radius: 8px;
          padding: 20px;
        }
        
        .step-item {
          background: white;
          border: 1px solid #e1e8ed;
          border-radius: 6px;
          padding: 15px;
          margin-bottom: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        
        .step-header {
          display: grid;
          grid-template-columns: 80px 1fr 1fr 1fr;
          gap: 15px;
          align-items: start;
        }
        
        .step-id {
          font-weight: 600;
          color: #2c3e50;
          background: #f8f9fa;
          padding: 4px 8px;
          border-radius: 4px;
          text-align: center;
          font-size: 12px;
        }
        
        .step-description {
          color: #2c3e50;
          line-height: 1.5;
        }
        
        .step-test-data {
          color: #666;
          font-style: italic;
          font-size: 14px;
        }
        
        .step-expected {
          color: #27ae60;
          font-weight: 500;
          font-size: 14px;
        }
        
        .step-labels {
          display: grid;
          grid-template-columns: 80px 1fr 1fr 1fr;
          gap: 15px;
          margin-bottom: 10px;
          font-weight: 600;
          color: #666;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .scenario-id {
          cursor: pointer;
          color: #27ae60;
          font-weight: 600;
          padding: 8px 12px;
          border-radius: 4px;
          transition: background-color 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        
        .scenario-id:hover {
          background: #f8f9fa;
        }
        
        .scenario-id.expanded {
          background: #e8f8f5;
          color: #16a085;
        }

        .scenario-details {
          margin-top: 15px;
          background: #f8fdf9;
          border: 1px solid #d5f4e6;
          border-radius: 8px;
          padding: 20px;
        }

        .gherkin-steps {
          margin-top: 15px;
        }

        .gherkin-section {
          margin-bottom: 20px;
        }

        .gherkin-keyword {
          font-weight: 700;
          color: #555;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .gherkin-keyword.given {
          color: #2980b9;
        }

        .gherkin-keyword.when {
          color: #e74c3c;
        }

        .gherkin-keyword.then {
          color: #27ae60;
        }

        .gherkin-keyword::before {
          content: '▸';
          font-size: 16px;
        }

        .gherkin-step {
          background: white;
          border-left: 4px solid #e1e8ed;
          padding: 12px 15px;
          margin-bottom: 8px;
          border-radius: 4px;
          font-family: 'Monaco', 'Courier New', monospace;
          font-size: 14px;
          line-height: 1.5;
        }

        .gherkin-step.given {
          border-left-color: #3498db;
        }

        .gherkin-step.when {
          border-left-color: #e74c3c;
        }

        .gherkin-step.then {
          border-left-color: #27ae60;
        }

        .examples-section {
          margin-top: 20px;
          background: white;
          border: 1px solid #e1e8ed;
          border-radius: 8px;
          padding: 15px;
        }

        .examples-title {
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 12px;
          font-size: 14px;
        }

        .examples-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }

        .examples-table th {
          background: #f8f9fa;
          border: 1px solid #e1e8ed;
          padding: 8px 12px;
          text-align: left;
          font-weight: 600;
          color: #2c3e50;
        }

        .examples-table td {
          border: 1px solid #e1e8ed;
          padding: 8px 12px;
        }

        .examples-table tr:nth-child(even) {
          background: #fafbfc;
        }

        .feature-file-container {
          margin-top: 30px;
          margin-bottom: 30px;
        }

        .tabs-container {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          border-bottom: 2px solid #e1e8ed;
        }

        .tab-button {
          background: none;
          border: none;
          padding: 12px 24px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
          color: #666;
          border-bottom: 3px solid transparent;
          transition: all 0.2s;
        }

        .tab-button.active {
          color: #3498db;
          border-bottom-color: #3498db;
        }

        .tab-button:hover:not(.active) {
          color: #2c3e50;
        }
      `}</style>
      
      <div className="container">
        <div className="header">
          <h1 className="title">User Story to Tests</h1>
          <p className="subtitle">Generate comprehensive test cases from your user stories</p>
        </div>
        
        <form onSubmit={handleSubmit} className="form-container">
          <div className="form-group">
            <label htmlFor="storyTitle" className="form-label">
              Story Title *
            </label>
            <input
              type="text"
              id="storyTitle"
              className="form-input"
              value={formData.storyTitle}
              onChange={(e) => handleInputChange('storyTitle', e.target.value)}
              placeholder="Enter the user story title..."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              className="form-textarea"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Additional description (optional)..."
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="acceptanceCriteria" className="form-label">
              Acceptance Criteria *
            </label>
            <textarea
              id="acceptanceCriteria"
              className="form-textarea"
              value={formData.acceptanceCriteria}
              onChange={(e) => handleInputChange('acceptanceCriteria', e.target.value)}
              placeholder="Enter the acceptance criteria..."
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="additionalInfo" className="form-label">
              Additional Info
            </label>
            <textarea
              id="additionalInfo"
              className="form-textarea"
              value={formData.additionalInfo}
              onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
              placeholder="Any additional information (optional)..."
            />
          </div>
          
          <div className="button-group">
            <button
              type="submit"
              className="submit-btn"
              disabled={isLoading || isLoadingFeatureFile}
            >
              {isLoading ? 'Generating Tests...' : 'Generate Test Cases'}
            </button>
            <button
              type="button"
              className="feature-file-btn"
              onClick={handleGenerateFeatureFile}
              disabled={isLoading || isLoadingFeatureFile}
            >
              {isLoadingFeatureFile ? 'Generating Feature File...' : 'Generate Feature File'}
            </button>
          </div>
        </form>

        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="loading">
            Generating test cases...
          </div>
        )}

        {results && (
          <div className="results-container feature-file-container">
            <div className="results-header">
              <h2 className="results-title">Generated Test Cases</h2>
              <div className="results-meta">
                {results.cases.length} test case(s) generated
                {results.model && ` • Model: ${results.model}`}
                {results.promptTokens > 0 && ` • Tokens: ${results.promptTokens + results.completionTokens}`}
              </div>
            </div>
            
            <div className="table-container">
              <table className="results-table">
                <thead>
                  <tr>
                    <th>Test Case ID</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Expected Result</th>
                  </tr>
                </thead>
                <tbody>
                  {results.cases.map((testCase: TestCase) => (
                    <>
                      <tr key={testCase.id}>
                        <td>
                          <div 
                            className={`test-case-id ${expandedTestCases.has(testCase.id) ? 'expanded' : ''}`}
                            onClick={() => toggleTestCaseExpansion(testCase.id)}
                          >
                            <span className={`expand-icon ${expandedTestCases.has(testCase.id) ? 'expanded' : ''}`}>
                              ▶
                            </span>
                            {testCase.id}
                          </div>
                        </td>
                        <td>{testCase.title}</td>
                        <td>
                          <span className={`category-${testCase.category.toLowerCase()}`}>
                            {testCase.category}
                          </span>
                        </td>
                        <td>{testCase.expectedResult}</td>
                      </tr>
                      {expandedTestCases.has(testCase.id) && (
                        <tr key={`${testCase.id}-details`}>
                          <td colSpan={4}>
                            <div className="expanded-details">
                              <h4 style={{marginBottom: '15px', color: '#2c3e50'}}>Test Steps for {testCase.id}</h4>
                              <div className="step-labels">
                                <div>Step ID</div>
                                <div>Step Description</div>
                                <div>Test Data</div>
                                <div>Expected Result</div>
                              </div>
                              {testCase.steps.map((step, index) => (
                                <div key={index} className="step-item">
                                  <div className="step-header">
                                    <div className="step-id">S{String(index + 1).padStart(2, '0')}</div>
                                    <div className="step-description">{step}</div>
                                    <div className="step-test-data">{testCase.testData || 'N/A'}</div>
                                    <div className="step-expected">
                                      {index === testCase.steps.length - 1 ? testCase.expectedResult : 'Step completed successfully'}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {featureFileResults && (
          <div className="results-container feature-file-container">
            <div className="results-header">
              <h2 className="results-title">Generated Feature File</h2>
              <div className="results-meta">
                Feature: {featureFileResults.featureFile.featureName} • {featureFileResults.featureFile.scenarios.length} scenario(s)
                {featureFileResults.model && ` • Model: ${featureFileResults.model}`}
                {featureFileResults.promptTokens > 0 && ` • Tokens: ${featureFileResults.promptTokens + featureFileResults.completionTokens}`}
              </div>
            </div>

            <div style={{ background: '#f8fdf9', border: '1px solid #d5f4e6', borderRadius: '8px', padding: '20px', marginTop: '20px' }}>
              <h3 style={{ color: '#27ae60', marginBottom: '10px', fontSize: '16px' }}>Feature</h3>
              <p style={{ fontSize: '14px', color: '#555', marginBottom: '20px', fontStyle: 'italic' }}>
                {featureFileResults.featureFile.featureDescription}
              </p>

              <div>
                {featureFileResults.featureFile.scenarios.map((scenario: Scenario, index: number) => (
                  <div key={index} style={{ marginBottom: '20px', background: 'white', border: '1px solid #e1e8ed', borderRadius: '8px', overflow: 'hidden' }}>
                    <div
                      style={{
                        padding: '15px',
                        borderLeft: '4px solid #27ae60',
                        cursor: 'pointer',
                        background: expandedScenarios.has(scenario.name) ? '#e8f8f5' : 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        userSelect: 'none'
                      }}
                      onClick={() => toggleScenarioExpansion(scenario.name)}
                    >
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: '600', color: '#666', textTransform: 'uppercase', marginBottom: '4px' }}>Scenario</div>
                        <div style={{ fontSize: '15px', fontWeight: '600', color: '#2c3e50' }}>{scenario.name}</div>
                      </div>
                      <span style={{ 
                        transition: 'transform 0.2s',
                        transform: expandedScenarios.has(scenario.name) ? 'rotate(90deg)' : 'rotate(0deg)',
                        fontSize: '16px',
                        color: '#27ae60'
                      }}>
                        ▶
                      </span>
                    </div>

                    {expandedScenarios.has(scenario.name) && (
                      <div style={{ padding: '20px', borderTop: '1px solid #e1e8ed', background: '#fafbfc' }}>
                        {scenario.description && (
                          <p style={{ marginBottom: '15px', color: '#555', fontSize: '14px', fontStyle: 'italic' }}>
                            {scenario.description}
                          </p>
                        )}

                        <div className="gherkin-steps">
                          {scenario.givenSteps.length > 0 && (
                            <div className="gherkin-section">
                              <div className="gherkin-keyword given">Given</div>
                              {scenario.givenSteps.map((step, stepIndex) => (
                                <div key={stepIndex} className="gherkin-step given">
                                  {step}
                                </div>
                              ))}
                            </div>
                          )}

                          {scenario.whenSteps.length > 0 && (
                            <div className="gherkin-section">
                              <div className="gherkin-keyword when">When</div>
                              {scenario.whenSteps.map((step, stepIndex) => (
                                <div key={stepIndex} className="gherkin-step when">
                                  {step}
                                </div>
                              ))}
                            </div>
                          )}

                          {scenario.thenSteps.length > 0 && (
                            <div className="gherkin-section">
                              <div className="gherkin-keyword then">Then</div>
                              {scenario.thenSteps.map((step, stepIndex) => (
                                <div key={stepIndex} className="gherkin-step then">
                                  {step}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {scenario.examples && scenario.examples.length > 0 && (
                          <div className="examples-section">
                            <div className="examples-title">Examples:</div>
                            {scenario.examples.map((example, exIndex) => (
                              <div key={exIndex} style={{ marginBottom: exIndex < scenario.examples!.length - 1 ? '15px' : '0' }}>
                                {example.description && (
                                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px', fontWeight: '500' }}>
                                    {example.description}
                                  </div>
                                )}
                                <table className="examples-table">
                                  <thead>
                                    <tr>
                                      {Object.keys(example.rows[0] || {}).map((key) => (
                                        <th key={key}>{key}</th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {example.rows.map((row, rowIndex) => (
                                      <tr key={rowIndex}>
                                        {Object.values(row).map((value, cellIndex) => (
                                          <td key={cellIndex}>{value}</td>
                                        ))}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App