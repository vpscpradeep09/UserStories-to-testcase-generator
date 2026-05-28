const r = require('./dist/routes/jira.js');

r.__test_addMockStoryDirect({
  key: 'MOCK-1',
  fields: {
    summary: 'Sample user story one',
    description: 'As a user, I can do one thing',
    issuetype: { name: 'Story' },
    status: { name: 'To Do' }
  }
});

r.__test_addMockStoryDirect({
  key: 'MOCK-2',
  fields: {
    summary: 'Sample user story two',
    description: 'As a user, I can do another thing',
    issuetype: { name: 'Story' },
    status: { name: 'In Progress' }
  }
});

console.log(JSON.stringify(r.__test_getMockStoriesDirect(), null, 2));
